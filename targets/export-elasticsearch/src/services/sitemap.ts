import { inject, injectable } from "inversify";

import { AzureRepository } from "../repositories";
import { getName, name } from "../utils";

@injectable()
@name("SitemapService")
export class SitemapService {
  constructor(
    @inject(getName(AzureRepository))
    private readonly repo: AzureRepository
  ) {}

  async getSitemap(
    destinationContainer = process.env.SITEMAP_DESTINATION_CONTAINER ?? "",
    destinationName = process.env.SITEMAP_DESTINATION_NAME ?? ""
  ): Promise<string> {
    const data = await this.repo.getFile(destinationContainer, destinationName);
    return data;
  }

  async uploadSitemap(
    sitemapEndpoint = process.env.SITEMAP_ENDPOINT ?? "",
    destinationContainer = process.env.SITEMAP_DESTINATION_CONTAINER ?? "",
    destinationName = process.env.SITEMAP_DESTINATION_NAME ?? ""
  ): Promise<void> {
    await this.repo.uploadSitemap(
      sitemapEndpoint,
      destinationContainer,
      destinationName
    );
  }
}
