import { CombinedError, OperationContext, useQuery } from "urql";
import { format, parseISO } from "date-fns";

import { Information } from "../../type";
import { gql } from "@urql/core";

const informationsQuery = gql`
  query informations($id: uuid) {
    information_informations(where: { id: { _eq: $id } }) {
      description
      id
      intro
      metaDescription
      metaTitle
      referenceLabel
      sectionDisplayMode
      title
      updatedAt
      dismissalProcess
      contents(order_by: { order: asc }) {
        id
        name
        title
        referenceLabel
        order
        blocks(order_by: { order: asc }) {
          id
          content
          order
          type
          file {
            id
            url
            altText
            size
          }
          img {
            id
            url
            altText
            size
          }
          contentDisplayMode
          contents(order_by: { order: asc }) {
            id
            document {
              cdtnId: cdtn_id
              source
              title
              slug
            }
          }
        }
        references(order_by: { order: asc }) {
          id
          url
          type
          title
          order
        }
      }
      references(order_by: { order: asc }) {
        id
        url
        type
        title
        order
      }
    }
  }
`;

export type QueryInformation = Information;

export type QueryResult = {
  information_informations: QueryInformation[];
};

export type InformationsQueryProps = {
  id?: string;
};

export type InformationsResult = Information & {
  updateDate: string;
};

export type InformationsQueryResult = {
  data?: InformationsResult;
  error?: CombinedError;
  fetching: boolean;
  reexecuteQuery: (opts?: Partial<OperationContext> | undefined) => void;
};

export const useInformationsQuery = ({
  id,
}: InformationsQueryProps): InformationsQueryResult => {
  const [{ data, error, fetching }, reexecuteQuery] = useQuery<QueryResult>({
    query: informationsQuery,
    requestPolicy: "cache-and-network",
    variables: {
      id,
    },
  });
  const information = data?.information_informations[0];
  const updateDate = information?.updatedAt
    ? format(parseISO(information.updatedAt), "dd/MM/yyyy")
    : "";
  return {
    data: information
      ? {
          ...information,
          updateDate,
        }
      : undefined,
    error,
    fetching,
    reexecuteQuery,
  };
};
