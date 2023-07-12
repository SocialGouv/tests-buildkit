import { DuplicateContent } from "src/components/home/DuplicateItems";
import { GhostLinkedDocuments } from "src/components/home/InvisibleLinkedDocument";
import { UnThemedContent } from "src/components/home/UnThemedContent";
import { Layout } from "src/components/layout/auth.layout";
import { Stack } from "src/components/layout/Stack";
import { withCustomUrqlClient } from "src/hoc/CustomUrqlClient";
import { withUserProvider } from "src/hoc/UserProvider";
import { Flex, Heading } from "theme-ui";

export function IndexPage() {
  return (
    <Layout title="Administration des contenus et gestion des alertes">
      <Stack>
        <Heading as="h2" sx={{ fontSize: "large" }}>
          Tableau de bord
        </Heading>
        <Flex sx={{ flexWrap: "wrap", gap: "2rem" }}>
          <UnThemedContent />
          <DuplicateContent />
          <GhostLinkedDocuments />
        </Flex>
      </Stack>
    </Layout>
  );
}

export default withCustomUrqlClient(withUserProvider(IndexPage));