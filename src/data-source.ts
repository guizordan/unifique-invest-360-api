// src/infra/database/data-source.ts
import { DataSource, DataSourceOptions } from "typeorm";
import * as msal from "@azure/msal-node";

export const ensureEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`A variável de ambiente ${key} é obrigatória.`);
  }
  return value;
};

interface MsalConfig {
  auth: {
    clientId: string;
    clientSecret: string;
    authority: string;
  };
}

const msalConfig: MsalConfig = {
  auth: {
    clientId: ensureEnv("AZURE_AD_CLIENT_ID"),
    clientSecret: ensureEnv("AZURE_AD_CLIENT_SECRET"),
    authority: `https://login.microsoftonline.com/${ensureEnv("AZURE_AD_TENANT_ID")}`,
  },
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

const tokenRequest = {
  scopes: ["https://database.windows.net/.default"],
};

export async function getAccessToken(): Promise<string> {
  try {
    const response = await pca.acquireTokenByClientCredential(tokenRequest);
    console.log("Azure authentication successful");
    return response?.accessToken!;
  } catch (error) {
    console.error("Azure authentication failure: ", error);
    return "";
  }
}

interface TypeORMConfig {
  database: string;
  host: string;
  port: number;
  clientId: string;
  clientSecret: string;
  authority: string;
  logging: boolean | ((sql: string) => void);
}

export const azureDBConfig: TypeORMConfig = {
  database: ensureEnv("AZURE_SQL_DATABASE"),
  host: ensureEnv("AZURE_SQL_SERVER"),
  port: Number(process.env.AZURE_SQL_PORT) || 1433,
  clientId: ensureEnv("AZURE_AD_CLIENT_ID"),
  clientSecret: ensureEnv("AZURE_AD_CLIENT_SECRET"),
  authority: `https://login.microsoftonline.com/${ensureEnv("AZURE_AD_TENANT_ID")}`,
  logging: false,
};

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

  // console.log(dataSource);

  return dataSource;
}

export default createDataSource();
