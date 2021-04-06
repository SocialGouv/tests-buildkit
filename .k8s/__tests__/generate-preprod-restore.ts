//

import { getEnvManifests } from "@socialgouv/kosko-charts/testing";
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env";

jest.setTimeout(1000 * 60);
test("kosko generate --preprod jobs/restore", async () => {
  expect(
    await getEnvManifests("preprod", "jobs/restore", {
      ...project("cdtn-admin").preprod,
    })
  ).toMatchSnapshot();
});