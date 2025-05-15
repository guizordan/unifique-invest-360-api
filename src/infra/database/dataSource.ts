import { DataSource } from "typeorm";
import { getAccessToken } from "../../infra/msal";
import { azureDBConfig } from "../../settings";

export async function createDataSource(): Promise<DataSource> {
  const token = await getAccessToken();

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
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    migrations: [__dirname + "/../migrations/**/*{.ts,.js}"],
    subscribers: [__dirname + "/../subscribers/**/*{.ts,.js}"],
  });

  return dataSource;
}

export default createDataSource();
