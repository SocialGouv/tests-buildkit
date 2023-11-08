import { ModelEdition } from "src/modules/models";

import { Layout } from "src/components/layout/auth.layout";
import { withCustomUrqlClient } from "src/hoc/CustomUrqlClient";
import { withUserProvider } from "src/hoc/UserProvider";
import { useRouter } from "next/router";

export function ModelEditionPage() {
  const router = useRouter();
  const modelId = router?.query?.modelId as string;

  return (
    <Layout title="Modèles de document">
      <ModelEdition id={modelId} />
    </Layout>
  );
}

export default withCustomUrqlClient(withUserProvider(ModelEditionPage));