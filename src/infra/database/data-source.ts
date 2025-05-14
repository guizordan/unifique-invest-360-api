import { DataSource, DataSourceOptions } from "typeorm";
import { azureDBConfig } from "@/settings";
import { getAccessToken } from "../../azure.config";

const accessToken = await getAccessToken();

const dataSource = new DataSource({
  type: "mssql",
  host: azureDBConfig.host,
  port: azureDBConfig.port,
  database: azureDBConfig.database,
  authentication: {
    type: "azure-active-directory-access-token",
    options: {
      token: accessToken,
    },
  },
  synchronize: false,
  entities: [__dirname + "/../**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../migrations/**/*{.ts,.js}"],
  subscribers: [__dirname + "/../subscribers/**/*{.ts,.js}"],
});

export default dataSource;
