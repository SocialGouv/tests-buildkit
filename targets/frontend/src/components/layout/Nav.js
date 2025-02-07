import { SOURCES } from "@socialgouv/cdtn-sources";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useUser } from "src/hooks/useUser";
import { slugifyRepository } from "src/models";
import { Badge, Box } from "@mui/material";
import { useQuery } from "urql";

import { Li, List } from "../list";
import { theme } from "../../theme";

const getSourcesQuery = `
query getAlerts{
  sources(order_by:{label:asc}) {
    repository,
    label,
    alerts: alerts_aggregate(where: {status: {_eq: "todo"}}) {
      aggregate {
      	count
      }
    }
  }
}
`;

export function Nav() {
  const { isAdmin } = useUser();
  // https://formidable.com/open-source/urql/docs/basics/document-caching/#adding-typenames
  const [result] = useQuery({ query: getSourcesQuery });
  const { fetching, data } = result;

  return (
    <Box
      as="nav"
      bg="highlight"
      padding="large"
      sx={{ flexShrink: 0, width: "17rem" }}
    >
      <ActiveLink href="/">Accueil</ActiveLink>
      <Box sx={{ paddingTop: "medium" }}>
        {isAdmin && (
          <>
            <p sx={TitleStyles}>Utilisateurs</p>
            <List>
              <Li>
                <ActiveLink href="/users">Gestion des utilisateurs</ActiveLink>
              </Li>
            </List>
          </>
        )}
      </Box>
      <Box sx={{ paddingTop: "medium" }}>
        <p sx={TitleStyles}>Alertes</p>
        {!fetching && (
          <List>
            {data?.sources?.map((source) => {
              return (
                <Li key={source.repository}>
                  <ActiveLink
                    href={`/alerts/${slugifyRepository(source.repository)}`}
                  >
                    {source.label}
                  </ActiveLink>

                  {"  "}
                  {source.alerts.aggregate.count > 0 && (
                    <Badge variant="circle">
                      {source.alerts.aggregate.count}
                    </Badge>
                  )}
                </Li>
              );
            })}
          </List>
        )}
      </Box>
      <Box sx={{ paddingTop: "medium" }}>
        <p sx={TitleStyles}>Administration</p>
        <List>
          <Li>
            <ActiveLink href="/contenus" passHref>
              Contenus
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/contenus?source=information" passHref>
              Contenus éditoriaux
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/models" passHref>
              Modèles de document
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/contenus?source=highlights" passHref>
              À la une
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/contenus?source=prequalified" passHref>
              Requetes pré-qualifiées
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/glossary" passHref>
              Glossaire
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/themes" passHref>
              Thèmes
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/kali/blocks" passHref>
              Blocs KALI
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href={`/fichiers`} passHref>
              Fichiers
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/unthemed" passHref>
              Contenus sans thème
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/contenus/fiches-sp" passHref>
              Fiches service-public
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/duplicates" passHref>
              Élements en Doublons
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/ghost-documents" passHref>
              Références inaccessibles
            </ActiveLink>
          </Li>
          <Li>
            <ActiveLink href="/mises-a-jour" passHref>
              Mises à jour
            </ActiveLink>
          </Li>
        </List>
      </Box>
      <Box sx={{ paddingTop: "medium" }}>
        <p sx={TitleStyles}>Contributions</p>
        <List>
          <Li>
            <ActiveLink href="/contributions" passHref>
              Questions
            </ActiveLink>
          </Li>
        </List>
      </Box>
    </Box>
  );
}

// used to make sure two links are not highlighted at the same time
const subRouteSources = [
  SOURCES.EDITORIAL_CONTENT,
  SOURCES.HIGHLIGHTS,
  SOURCES.PREQUALIFIED,
];

function ActiveLink({ children, href }) {
  const router = useRouter();
  const [pathname, query = ""] = href.split("?");
  let isCurrentRoute = router.pathname === pathname;
  if (isCurrentRoute) {
    if (query) {
      isCurrentRoute =
        query.includes(router.query?.source) && router.query?.source;
    } else {
      /** when href is "/contenus" and current url is
       * "/contenus?source=editorial_content" we don't want to highlight
       * this generic link since there is a more specific link that match the
       * current url`. We ensure that source param is not included in the
       * specific sources.
       * url | href | highlighted
       * - | - | -
       * /contenus?source=editorial_content` | /contenus | :cross:
       * /contenus?source=contributions` | /contenus | :check:
       **/

      isCurrentRoute = !subRouteSources.includes(router.query?.source);
    }
  }

  return (
    <Link
      shallow
      href={href}
      passHref
      style={{
        color: isCurrentRoute ? "red" : "inherit",
        textDecoration: "none",
      }}
      {...(isCurrentRoute && { "aria-current": "page" })}
    >
      {children}
    </Link>
  );
}

ActiveLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
};

const TitleStyles = {
  fontWeight: theme.fontWeights.light,
  textTransform: "uppercase",
};
