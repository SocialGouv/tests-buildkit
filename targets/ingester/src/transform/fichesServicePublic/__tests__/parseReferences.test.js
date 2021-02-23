import { describe, expect, test } from "@jest/globals";
import { SOURCES } from "@socialgouv/cdtn-sources";

import { extractNewReference, extractOldReference } from "../parseReference";

/** @type{import("@socialgouv/kali-data-types").IndexedAgreement[]} */
const agreements = [
  {
    active: true,
    date_publi: "2019-02-15T00:00:00.000Z",
    etat: "VIGUEUR_NON_ETEN",
    id: "KALICONT123",
    mtime: 1561146467,
    nature: "IDCC",
    num: 123,
    shortTitle: "convention 123",
    texte_de_base: "KALITEXT123",
    title: "Convention collective nationale des 123",
    url:
      "https://www.legifrance.gouv.fr/affichIDCC.do?idConvention=KALICONT123",
  },
];
const referenceResolver = jest.fn().mockImplementation((id) => {
  if (id === "LEGISCTA42")
    return [
      {
        children: [
          {
            data: {
              id: "LEGIARTI42",
              num: "L42-1",
            },
            type: "article",
          },
          {
            data: {
              id: "LEGIARTI43",
              num: "L43-1",
            },
            type: "article",
          },
        ],
        data: {
          id: "LEGISCTA42",
          num: "L42",
        },
        type: "section",
      },
    ];
  if (id === "LEGIARTI42")
    return [
      {
        data: {
          id: "LEGIARTI42",
          num: "L42-1",
        },
        type: "article",
      },
    ];
  return [];
});

const external = {
  title: "external",
  type: SOURCES.EXTERNALS,
  url: "https://legi.url/affichJuriJudi.do?idTexte=JURITEXT000007023096",
};
const external2 = {
  title: "external",
  type: SOURCES.EXTERNALS,
  url: "https://legi.url/circulaire/id/39848",
};

const article42 = {
  slug: "l42-1",
  title: "L42-1",
  type: SOURCES.CDT,
};
const article43 = {
  slug: "l43-1",
  title: "L43-1",
  type: SOURCES.CDT,
};
const kali = {
  slug: "123-convention-123",
  title: "convention 123",
  type: SOURCES.CCN,
};
const section42 = [article42, article43];

describe("extractNewReference", () => {
  test.each([
    ["https://legi.url/codes/id/LEGISCTA42", "L42", section42],
    ["/codes/section_lc/LEGITEXT000006072050/LEGISCTA42", "L42", section42],
    ["https://legi.url/codes/article_lc/LEGIARTI42/", "L42-1", [article42]],
    ["https://legi.url/codes/id/LEGIARTI42/", "L42-1", [article42]],
    ["https://legi.url/conv_coll/id/KALICONT123", "convention 123", [kali]],
    ["https://legi.url/circulaire/id/39848", "external", [external2]],
  ])(`it should extract new reference from %p`, (url, label, reference) => {
    expect(
      extractNewReference(url, label, referenceResolver, agreements)
    ).toEqual(reference);
  });
});

describe("extractOldReference", () => {
  test.each([
    [
      "https://legi.url/affichCode.do?cidTexte=LEGITEXT000006072050&idSectionTA=LEGISCTA42",
      "L42",
      section42,
    ],

    [
      "https://legi.url/affichCode.do?idArticle=LEGIARTI42&idSectionTA=LEGISCTA42&cidTexte=LEGITEXT000006072050",
      "L42-1",
      [article42],
    ],
    [
      "https://legi.url/affichCodeArticle.do;?cidTexte=LEGITEXT000006072050&idArticle=LEGIARTI42",
      "L42-1",
      [article42],
    ],
    [
      "https://legi.url/affichIDCC.do?cidTexte=KALITEXT000005670044&idSectionTA=KALISCTA000005747382&idConvention=KALICONT123",
      "convention 123",
      [kali],
    ],
    [
      "https://legi.url/affichJuriJudi.do?idTexte=JURITEXT000007023096",
      "external",
      [external],
    ],
  ])(`it should extract old reference for %s %s`, (url, label, reference) => {
    expect(
      extractOldReference(url, label, referenceResolver, agreements)
    ).toEqual(reference);
  });
});
