import type {
  ContributionComplete,
  ContributionFiltered,
  DocumentReferences,
} from "@shared/types";
import { SOURCES } from "@socialgouv/cdtn-sources";

import { getAllDocumentsBySource } from "../../../shared/getAllDocumentsBySource";

export type Contrib = Pick<
  ContributionComplete | ContributionFiltered,
  "document" | "source" | "title"
> & {
  initialId: string;
  cdtnId: string;
};

export function extractContributionsRef(
  questions: Contrib[]
): DocumentReferences[] {
  const refs: DocumentReferences[] = [];

  for (const question of questions) {
    if ("answers" in question.document) {
      refs.push({
        document: {
          id: question.initialId,
          source: SOURCES.CONTRIBUTIONS,
          title: question.title,
        },
        references: question.document.answers.generic.references.flatMap(
          (ref) => {
            if (ref.category === null) {
              return [];
            }
            return [
              {
                dila_cid: ref.dila_cid,
                dila_container_id: ref.dila_container_id,
                dila_id: ref.dila_id,
                title: ref.title,
                url: ref.url,
              },
            ];
          }
        ),
      });
      if ("conventionAnswer" in question.document.answers) {
        continue;
      }
      if (question.document.split) {
        continue;
      }
      question.document.answers.conventions.forEach((answer) =>
        refs.push({
          document: {
            id: answer.id,
            source: SOURCES.CONTRIBUTIONS,
            title: question.title,
          },
          references: answer.references.flatMap((ref) => {
            if (ref.category === null) return [];
            return [
              {
                dila_cid: ref.dila_cid,
                dila_container_id: ref.dila_container_id,
                dila_id: ref.dila_id,
                title: ref.title,
                url: ref.url,
              },
            ];
          }),
        })
      );
    }
  }
  return refs;
}

export async function getOldContribRef() {
  const contributions = (await getAllDocumentsBySource([
    SOURCES.CONTRIBUTIONS,
  ])) as Contrib[];
  return extractContributionsRef(contributions);
}
