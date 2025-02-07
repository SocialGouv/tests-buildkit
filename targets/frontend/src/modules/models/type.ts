import { z } from "zod";
import {
  legiReferenceSchema,
  otherReferenceSchema,
} from "../../components/contributions";
import { fileSchema } from "../common/type";

export const modelSchema = z.object({
  id: z.string().uuid(),
  title: z
    .string({ required_error: "Un titre doit être renseigné" })
    .min(1, "Un titre doit être renseigné"),
  metaTitle: z
    .string({ required_error: "Un titre meta doit être renseigné" })
    .min(1, "Un titre meta doit être renseigné"),
  description: z
    .string({
      required_error: "Une description doit être renseignée",
    })
    .min(1, "Une description doit être renseignée"),
  metaDescription: z
    .string({
      required_error: "Une description meta doit être renseignée",
    })
    .min(1, "Une description meta doit être renseignée"),
  type: z.enum(["fichier", "document", "lettre"], {
    required_error: "Une type de document doit être sélectionné",
  }),
  updatedAt: z.string(),
  createdAt: z.string(),
  previewHTML: z.string(),
  file: fileSchema,
  legiReferences: z.array(legiReferenceSchema),
  otherReferences: z.array(otherReferenceSchema),
});

export type Model = z.infer<typeof modelSchema>;
