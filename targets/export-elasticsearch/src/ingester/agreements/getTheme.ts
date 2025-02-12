import { ContributionElasticDocument } from "@shared/types";

export function getTheme(
  data: ContributionElasticDocument
): string | undefined {
  return data.breadcrumbs.length > 0 ? data.breadcrumbs[0].label : undefined;
}
