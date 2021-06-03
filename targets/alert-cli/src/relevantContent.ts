import type { DilaChanges } from "./diff/dila-data";
import getContribReferences from "./extractDilaReferences/contribution";
import getTravailEmploiReferences from "./extractDilaReferences/ficheTravailEmploi";
import type { DocumentReferences } from "./extractDilaReferences/types";

export async function getRelevantDocuments({
  modified,
  removed,
}: Pick<DilaChanges, "modified" | "removed">): Promise<DocumentReferences[]> {
  const contribReferences = await getContribReferences();
  const travailEmploiReferences = await getTravailEmploiReferences();

  const docsReferences = contribReferences.concat(travailEmploiReferences);
  const documents = docsReferences.flatMap((item) => {
    const references = item.references.filter(
      (ref) =>
        modified.find(
          (node) => node.id === ref.dila_id || node.cid === ref.dila_cid
        ) ??
        removed.find(
          (node) => node.id === ref.dila_id || node.cid === ref.dila_cid
        )
    );

    if (references.length) {
      return { document: item.document, references };
    }
    return [];
  });
  return documents;
}