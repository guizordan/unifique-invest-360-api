import { DataSourceOptions } from "typeorm";
import { azureDBConfig } from "@/settings";
import { getAccessToken } from "./src/azure.config";

console.log("starting");

const accessToken = await getAccessToken();

const config: DataSourceOptions = {
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
  // cli: {
  //   entitiesDir: "src/domain/entities",
  //   migrationsDir: "src/infrastructure/database/migrations",
  //   subscribersDir: "src/infrastructure/database/subscribers",
  // },
};

export default config;
