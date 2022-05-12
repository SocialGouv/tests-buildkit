import type { ExportEsStatus } from "@shared/types";
import { Environment, Status } from "@shared/types";
import { injectable } from "inversify";

import { wait } from "../../../utils";

@injectable()
export class FakeExportService {
  async runExport(
    userId: string,
    environment: Environment
  ): Promise<ExportEsStatus> {
    await wait(100);
    return {
      created_at: new Date("2022-03-24T10:09:10Z"),
      environment,
      id: "1",
      status: Status.running,
      updated_at: new Date("2022-03-24T10:09:10Z"),
      user_id: userId,
    };
  }

  async getAll(
    environment?: Environment
  ): Promise<ExportEsStatus[] | undefined> {
    await wait(100);
    if (environment) {
      return [
        {
          created_at: new Date("2022-03-24T10:09:10Z"),
          environment,
          id: "1",
          status: Status.running,
          updated_at: new Date("2022-03-24T10:09:10Z"),
          user_id: "userId-env",
        },
      ];
    }
    return [
      {
        created_at: new Date("2022-03-24T10:09:10Z"),
        environment: Environment.preproduction,
        id: "1",
        status: Status.running,
        updated_at: new Date("2022-03-24T10:09:10Z"),
        user_id: "userId-all",
      },
    ];
  }
}