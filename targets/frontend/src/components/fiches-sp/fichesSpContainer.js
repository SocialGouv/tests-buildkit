import { useRouter } from "next/router";
import { useCallback, useContext, useMemo } from "react";
import { SelectionContext } from "src/pages/contenus/fiches-sp";
import { Message, Spinner } from "theme-ui";
import { useMutation, useQuery } from "urql";

import { Stack } from "../layout/Stack";
import { Pagination } from "../pagination";
import { AddFiches } from "./addFiche";
import { ServicPublicList } from "./list";
import { Actions } from "./selectActions";

export function FichesServicePublicContainer() {
  const router = useRouter();
  const context = useMemo(
    () => ({ additionalTypenames: ["service_public_contents"] }),
    []
  );

  const [, setSelectedItems] = useContext(SelectionContext);

  const itemsPerPage = 25;

  const page = parseInt(router.query?.page) || 0;

  const [result] = useQuery({
    context,
    query: getFicheServicePublicId,
    variables: {
      limit: itemsPerPage,
      offset: page * itemsPerPage,
    },
  });

  const [, deleteFicheMutation] = useMutation(deleteFicheServicePublicId);
  const deleteFicheSp = useCallback(
    (ids) => {
      deleteFicheMutation({ ids });
      setSelectedItems([]);
    },
    [deleteFicheMutation]
  );

  const { fetching, error, data } = result;

  if (error) {
    return <Message variant="primary">{error.message}</Message>;
  }
  if (fetching) {
    return <Spinner />;
  }
  return (
    <Stack>
      <AddFiches />
      {data.ficheIds.length > 0 ? (
        <Stack>
          <ServicPublicList items={data.ficheIds} />
          <Actions onDelete={deleteFicheSp} />
          <Pagination
            count={data.aggs.aggregate.count}
            currentPage={page}
            pageSize={itemsPerPage}
          />
        </Stack>
      ) : (
        "Pas de résultat"
      )}
    </Stack>
  );
}

const getFicheServicePublicId = `
query getServicePublicId($offset: Int = 0, $limit: Int = 50) {
  ficheIds: service_public_contents( offset: $offset, limit: $limit, order_by: [{status: desc, id: asc}]) {
   id, status
  }
  aggs:service_public_contents_aggregate {
    aggregate{
      count
    }
  }
}
`;

const deleteFicheServicePublicId = `
mutation deleteServicePublicIds($ids: [String!] = []) {
  delete_service_public_contents(where: {
    id: {_in: $ids}
  }) {
    affected_rows
    returning {
      id
    }
  }
}
`;
