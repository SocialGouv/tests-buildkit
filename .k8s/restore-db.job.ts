import ok from "assert";
import { ConfigMap } from "kubernetes-models/_definitions/IoK8sApiCoreV1ConfigMap";
import { Job } from "kubernetes-models/batch/v1/Job";
import { EnvFromSource } from "kubernetes-models/v1/EnvFromSource";
import type { EnvVar } from "kubernetes-models/v1/EnvVar";

//import { addInitContainer } from "@socialgouv/kosko-charts/utils/addInitContainer";
//import { waitForPostgres } from "@socialgouv/kosko-charts/utils/waitForPostgres";

import type { IIoK8sApiCoreV1Container } from "kubernetes-models/_definitions/IoK8sApiCoreV1Container";
import type { Deployment } from "kubernetes-models/apps/v1/Deployment";
import type { Job as JobType } from "kubernetes-models/batch/v1/Job";

//type Manifest = Deployment | JobType;

// export const addInitContainer = (
//   deployment: Manifest,
//   initContainer: IIoK8sApiCoreV1Container
// ): Manifest => {
//   if (!deployment.spec?.template) {
//     return deployment;
//   }

//   deployment.spec.template.spec = deployment.spec.template.spec ?? {
//     containers: [],
//     initContainers: [],
//   };
//   const containers = deployment.spec.template.spec.initContainers ?? [];
//   containers.push(initContainer);
//   deployment.spec.template.spec.initContainers = containers;

//   return deployment;
// };

interface RestoreDbJobArgs {
  project: string;
  env: EnvVar[];
  envFrom?: EnvFromSource[];
  postRestoreScript?: string;
}

// renovate: datasource=docker depName=registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db versioning=2.6.1
const SOCIALGOUV_DOCKER_AZURE_DB = "2.6.1";

const restoreScript = `

echo "starting restore into $PGHOST/$PGDATABASE"

[ ! -z $PGDATABASE ] || (echo "No PGDATABASE"; exit 1)
[ ! -z $PGHOST ] || (echo "No PGHOST"; exit 1)
[ ! -z $PGUSER ] || (echo "No PGUSER"; exit 1)
[ ! -z $PGPASSWORD ] || (echo "No PGPASSWORD"; exit 1)
[ ! -z $OWNER ] || (echo "No OWNER"; exit 1)

# get latest backup folder
LATEST=$(ls -1Fr /mnt/data | head -n 1);
DUMP="/mnt/data/\${LATEST}\${FILE}"
echo "Restore \${DUMP} into \${PGDATABASE}";

pg_isready;

pg_restore \
  --dbname \${PGDATABASE} \
  --clean --if-exists \
  --no-owner \
  --role \${OWNER} \
  --no-acl \
  --verbose \
  \${DUMP};

psql -v ON_ERROR_STOP=1 \${PGDATABASE} -c "ALTER SCHEMA public owner to \${OWNER};"

[ -f "/mnt/scripts/post-restore.sql" ] && psql -v ON_ERROR_STOP=1 -a < /mnt/scripts/post-restore.sql
`;

const getProjectSecretNamespace = (project: string) => `${project}-secret`;

const getAzureProdVolumeSecretName = (project: string) =>
  `azure-${project.replace(/-/g, "")}prod-volume`;

const getAzureBackupShareName = (project: string) =>
  `${project}-backup-restore`;

type ReturnManifest = Job | ConfigMap;

export const restoreDbJob = ({
  project,
  env = [],
  envFrom = [],
  postRestoreScript,
}: RestoreDbJobArgs): ReturnManifest[] => {
  ok(process.env.CI_COMMIT_SHORT_SHA);
  const secretNamespace = getProjectSecretNamespace(project);
  const azureSecretName = getAzureProdVolumeSecretName(project);
  const azureShareName = getAzureBackupShareName(project);

  const manifests = [];

  const jobSpec = {
    containers: [
      {
        command: ["sh", "-c", restoreScript],
        env,
        envFrom: [
          new EnvFromSource({
            secretRef: {
              name: "azure-pg-admin-user-dev",
            },
          }),
          ...envFrom,
        ],
        image: `registry.gitlab.factory.social.gouv.fr/socialgouv/docker/azure-db:${SOCIALGOUV_DOCKER_AZURE_DB}`,
        imagePullPolicy: "IfNotPresent",
        name: "restore-db",
        resources: {
          limits: {
            cpu: "300m",
            memory: "512Mi",
          },
          requests: {
            cpu: "100m",
            memory: "64Mi",
          },
        },
        volumeMounts: [
          {
            mountPath: "/mnt/data",
            name: "backups",
          },
        ],
      },
    ],
    restartPolicy: "OnFailure",
    volumes: [
      {
        azureFile: {
          readOnly: true,
          secretName: azureSecretName,
          shareName: azureShareName,
        },
        name: "backups",
      },
    ],
  };

  if (postRestoreScript) {
    jobSpec.containers[0].volumeMounts.push({
      mountPath: "/mnt/scripts",
      name: "scripts",
    });
    jobSpec.volumes.push({
      //@ts-expect-error
      configMap: {
        name: `post-restore-script-configmap-${process.env.CI_COMMIT_SHORT_SHA}`,
      },

      name: "scripts",
    });
    const configMap = new ConfigMap({
      data: {
        "post-restore.sql": postRestoreScript,
      },
      metadata: {
        name: `post-restore-script-configmap-${process.env.CI_COMMIT_SHORT_SHA}`,
        namespace: secretNamespace,
      },
    });
    manifests.push(configMap);
  }

  const job = new Job({
    metadata: {
      name: `restore-db-${process.env.CI_COMMIT_SHORT_SHA}`,
      namespace: secretNamespace,
    },
    spec: {
      backoffLimit: 0,
      template: {
        metadata: {},
        spec: jobSpec,
      },
    },
  });

  manifests.push(job);

  return manifests;
};