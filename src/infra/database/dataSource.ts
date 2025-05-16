import { DataSource } from "typeorm";
import { getAccessToken } from "../../infra/msal.ts";
import { azureDBConfig } from "../../settings.ts";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

import Customer from "@/core/customer/customer.entity.ts";
import { CustomerController } from "../http/customer/customer.controller.ts";

export async function createDataSource(): Promise<DataSource> {
  const token = await getAccessToken();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  const dataSource = new DataSource({
    type: "mssql",
    host: azureDBConfig.host,
    port: azureDBConfig.port,
    database: azureDBConfig.database,
    authentication: {
      type: "azure-active-directory-access-token",
      options: {
        token,
      },
    },
    synchronize: false,
    entities: [Customer],
    migrations: [join(__dirname, "/migrations/**/*{.ts,.js}")],
    subscribers: [join(__dirname, "/../subscribers/**/*{.ts,.js}")],
  });

  return dataSource;
}

const dataSource = await createDataSource();
export default dataSource;
