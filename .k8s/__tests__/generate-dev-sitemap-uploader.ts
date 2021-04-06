//

import { getEnvManifests } from "@socialgouv/kosko-charts/testing";
import { project } from "@socialgouv/kosko-charts/testing/fake/gitlab-ci.env";

jest.setTimeout(1000 * 60);
test("kosko generate --dev jobs/sitemap-uploader", async () => {
  expect(
    await getEnvManifests("dev", "jobs/sitemap-uploader", {
      ...project("cdtn-admin").dev,
      BASE_URL: "https://12345689-code-travail.dev2.fabrique.social.gouv.fr/",
    })
  ).toMatchSnapshot();
});