//

import { getEnvManifests } from "@socialgouv/kosko-charts/testing";
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env";

jest.setTimeout(1000 * 60);
test("kosko generate --dev jobs/restore", async () => {
  process.env.HARBOR_PROJECT = "cdtn";
  process.env.CI_JOB_ID = "123456789";
  expect(
    await getEnvManifests("dev", "jobs/restore", {
      ...project("cdtn-admin").dev,
    })
  ).toMatchSnapshot();
});
