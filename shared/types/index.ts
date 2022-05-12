import type {
  Answer,
  GenericAnswer,
  IndexedAgreement,
  Reference as ContributionReference,
  DilaRef,
} from "@socialgouv/contributions-data-types";
import type {
  CodeArticle,
  CodeArticleData,
  CodeSection,
} from "@socialgouv/legi-data-types";
import type {
  AgreementArticle,
  AgreementSection,
} from "@socialgouv/kali-data-types";

export type BaseHasuraDocument = {
  cdtn_id: string;
  initial_id: string;
  is_available: boolean;
  is_searchable: boolean;
  is_published: boolean;
  meta_description: string;
  slug: string;
  title: string;
  text: string;
  created_at: Date;
  updated_at: Date;
};

export type FicheTravailEmploi = BaseHasuraDocument & {
  source: "fiches_ministere_travail";
  document: FicheTravailEmploiDoc;
};

export type ContributionComplete = BaseHasuraDocument & {
  source: "contributions";
  document: ContributionCompleteDoc;
};

export type ContributionFiltered = BaseHasuraDocument & {
  source: "contributions";
  document: ContributionFilteredDoc;
};

export type LaborCodeArticle = BaseHasuraDocument & {
  source: "code_du_travail";
  document: LaborCodeDoc;
};

export type FicheServicePublic = BaseHasuraDocument & {
  source: "fiches_service_public";
  document: FicheServicePublicDoc;
};

export type Agreement = BaseHasuraDocument & {
  source: "conventions_collectives";
  document: AgreementDoc;
};

export type Prequalified = BaseHasuraDocument & {
  source: "prequalified";
  document: PrequalifiedDoc;
};

export type Theme = BaseHasuraDocument & {
  source: "themes";
  document: ThemeDoc;
};

export type MailTemplate = BaseHasuraDocument & {
  source: "modeles_de_courriers";
  document: MailTemplateDoc;
};

export type EditorialContent = BaseHasuraDocument & {
  source: "information";
  document: EditorialContentDoc;
};

export type HasuraDocument =
  | Agreement
  | ContributionComplete
  | ContributionFiltered
  | FicheServicePublic
  | FicheTravailEmploi
  | LaborCodeArticle
  | Prequalified
  | MailTemplate
  | Theme
  | EditorialContent;

/**
 * Document Table's document type
 */
export type ThemeDoc = {
  icon?: string;
  shortTitle?: string;
  description?: string;
};

export type MailTemplateDoc = {
  date: string;
  html: string;
  author: string;
  fileUrl: string;
  filename: string;
  filesize: number;
  description: string;
  references?: {
    url: string;
    title: string;
    type: string;
  }[];
};

export type EditorialContentDoc = {
  date: string;
  intro: string;
  contents: EditorialContentPart[];
  references?: EditoralContentReferenceBloc[];
  description: string;
};

export type EditorialContentPart = GraphicContentPart | MarkdownContentPart;

export interface BaseContentPart {
  name: string;
  title: string;
  markdown: string;
  references: EditoralContentReferenceBloc[];
  type: "markdown" | "graphic";
}

export interface MarkdownContentPart extends BaseContentPart {
  type: "markdown";
}

export interface GraphicContentPart extends BaseContentPart {
  type: "graphic";
  size: string;
  imgUrl: string;
  altText: string;
  fileUrl: string;
}

export interface EditoralContentReferenceBloc {
  label: string;
  links: EditorialContentLink[];
}

export interface EditorialContentLink {
  id: string;
  url: string;
  type: string;
  title: string;
}

export interface FicheTravailEmploiDoc {
  date: string;
  description: string;
  intro: string;
  url: string;
  sections: Section[];
}
export interface Section {
  anchor: string;
  html: string;
  text: string;
  title: string;
  description: string;
  references: TravailEmploiReference[];
}

export interface TravailEmploiReference {
  id: string;
  cid: string;
  slug: string;
  title: string;
  type: "code_du_travail" | "conventions_collectives";
  url: string;
}

export interface ContributionCompleteDoc {
  index: number;
  split: false;
  description: string;
  answers: CCMultipleAnswers;
}

export interface ContributionFilteredDoc {
  index: number;
  split: true;
  description: string;
  answers: CCSingleAnswer;
}

export interface CCMultipleAnswers {
  generic: GenericAnswer;
  conventions: Answer[];
}

export interface CCSingleAnswer {
  generic: GenericAnswer;
  conventionAnswer: Answer;
}

export type LaborCodeDoc = Pick<CodeArticleData, "cid" | "dateDebut" | "id"> & {
  description: string;
  html: string;
  url: string;
  notaHtml?: string;
};

export interface FicheServicePublicDoc {
  raw: string;
  url: string;
  date: string;
  description: string;
  referencedTexts: ServicePublicReference[];
}

export type ServicePublicReference =
  | ServicePublicExternalReference
  | ServicePublicInternalReference;

export interface ServicePublicInternalReference {
  title: string;
  slug: string;
  type: "code_du_travail" | "conventions_collectives";
}

export interface ServicePublicExternalReference {
  title: string;
  url: string;
  type: "external";
}

type AgreementDoc = Pick<
  IndexedAgreement,
  "date_publi" | "effectif" | "mtime" | "num" | "shortTitle" | "url"
> & {
  description: string;
  answers: AgreementContribAnswer[];
  articleByTheme: ArticleTheme[];
};

export interface AgreementContribAnswer {
  slug: string;
  index: string;
  answer: string;
  question: string;
  references: ContributionReference[];
}

export interface ArticleTheme {
  bloc: "string";
  articles: {
    id: string;
    cid: string;
    title: string;
    section: string;
  };
}

export interface KaliArticleHDN {
  idcc: number;
  title: string;
  id: string;
  blocks: Record<string, string[]>;
}

export interface KaliBlock {
  id: string;
  idcc: number;
  title: string;
  blocks: Blocks;
}

export interface Blocks {
  "1"?: string[];
  "2"?: string[];
  "4"?: string[];
  "6": string[];
  "7"?: string[];
  "9"?: string[];
  "10"?: string[];
  "15"?: string[];
  "16"?: string[];
  "3"?: string[];
  "5"?: string[];
  "11"?: string[];
}

type PrequalifiedDoc = {
  variants: string[];
};

/**
 * Alerts
 */

export type HasuraAlert = {
  id: string;
  info: AlertInfo;
  status: string;
  repository: string;
  ref: string;
  changes: AlertChanges;
  created_at: Date;
  updated_at: Date;
};

export type AlertInfo = { id: string };

export type AlertChanges =
  | DilaAlertChanges
  | TravailDataAlertChanges
  | VddAlertChanges;

/** Dila alert changes */
export type DilaAlertChanges = DilaChanges & {
  type: "dila";
  ref: string;
  title: string;
  date: Date;
  id: string;
  file: string;
  num?: number;
};

export type DilaChanges = {
  modified: DilaModifiedNode[];
  added: DilaAddedNode[];
  removed: DilaRemovedNode[];
  documents: DocumentReferences[];
};

export type DilaAddedNode = {
  etat: string;
  parents: string[];
  title: string;
  id: string;
  cid: string;
};

export type DilaRemovedNode = {
  parents: string[];
  title: string;
  id: string;
  cid: string;
};

export type DilaModifiedNode = {
  parents: string[];
  title: string;
  id: string;
  cid: string;
  etat: string;
  diffs: DiffInfo[];
};

export type DilaNode =
  | AgreementArticle
  | AgreementSection
  | CodeArticle
  | CodeSection;

export type DilaArticle = AgreementArticle | CodeArticle;
export type DilaSection = AgreementSection | CodeSection;

export type DiffInfo = {
  type: "etat" | "nota" | "texte";
  currentText: string;
  previousText: string;
};

export type DocumentReferences = {
  document: DocumentInfo;
  references: DocumentReference[];
};

export type DocumentReference = Pick<
  DilaRef,
  "dila_cid" | "dila_container_id" | "dila_id" | "title" | "url"
>;

export type DocumentInfo = Pick<HasuraDocument, "source" | "title"> & {
  id: string;
};
export type DocumentInfoWithCdtnRef = DocumentInfo & {
  ref: Pick<DocumentInfo, "id" | "title">;
};

/** Fiche travail alert changes */
export type TravailDataAlertChanges = TravailDataChanges & {
  type: "travail-data";
  title: string;
  ref: string;
  date: Date;
};

export type TravailDataChanges = {
  added: FicheTravailEmploiInfo[];
  removed: FicheTravailEmploiInfo[];
  modified: FicheTravailEmploiInfoWithDiff[];
  documents: DocumentInfoWithCdtnRef[];
};

export type FicheTravailEmploiInfo = {
  pubId: string;
  title: string;
  url: string;
};

export type FicheTravailEmploiInfoWithDiff = FicheTravailEmploiInfo & {
  removedSections: SectionTextChange[];
  addedSections: SectionTextChange[];
  modifiedSections: SectionTextChange[];
};

export type SectionTextChange = {
  title: string;
  currentText: string;
  previousText: string;
};

/** fiche vdd  alert changes*/
export type VddAlertChanges = VddChanges & {
  type: "vdd";
  title: string;
  ref: string;
  date: Date;
};

export type VddChanges = {
  modified: FicheVddInfoWithDiff[];
  removed: FicheVddInfo[];
  added: FicheVddInfo[];
  documents: DocumentInfoWithCdtnRef[];
};

export type FicheVddInfo = {
  id: string;
  type: string;
  title: string;
};

export type FicheVddInfoWithDiff = FicheVddInfo & {
  currentText: string;
  previousText: string;
};

export enum Status {
  running = "running",
  completed = "completed",
  failed = "failed",
  timeout = "timeout",
}

export enum Environment {
  production = "production",
  preproduction = "preproduction",
}

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export interface ExportEsStatus {
  id: string;
  environment: Environment;
  status: Status;
  user_id: string;
  created_at: Date;
  updated_at: Date;
  user?: User;
}