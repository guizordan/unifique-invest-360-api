import * as msal from "@azure/msal-node";

import { azureDBConfig } from "@/settings";
import { Dialect, Sequelize } from "sequelize";

interface SequelizeConfig {
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  logging: boolean | ((sql: string) => void);
}

const sequelizeConfig: SequelizeConfig = {
  database: azureDBConfig.database,
  host: azureDBConfig.host,
  port: azureDBConfig.port,
  dialect: "mssql",
  logging: false,
};

const msalConfig = {
  auth: {
    clientId: azureDBConfig.clientId,
    clientSecret: azureDBConfig.clientSecret,
    authority: azureDBConfig.authority,
  },
};

const pca = new msal.ConfidentialClientApplication(msalConfig);

const tokenRequest = {
  scopes: ["https://database.windows.net/.default"],
};

async function getAccessToken(): Promise<string> {
  try {
    const response = await pca.acquireTokenByClientCredential(tokenRequest);
    return response?.accessToken!;
  } catch (error) {
    console.error("Erro ao obter token de acesso:", error);
    return "";
  }
}

export async function initializeSequelize() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.error("Não foi possível obter o token de acesso.");
    return null;
  }

  const sequelize = new Sequelize(sequelizeConfig.database, "", "", {
    dialect: "mssql",
    host: sequelizeConfig.host,
    port: sequelizeConfig.port,
    dialectOptions: {
      server: sequelizeConfig.host,
      options: {
        encrypt: true,
        trustServerCertificate: false,
      },
      authentication: {
        type: "azure-active-directory-default",
        options: {
          token: accessToken,
        },
      },
    },
    logging: sequelizeConfig.logging,
  });

  try {
    await sequelize.authenticate();
    console.log(
      "Conexão com o SQL Server via Sequelize e Entra ID estabelecida com sucesso!"
    );
  } catch (error: any) {
    console.error("Erro ao conectar com Sequelize:", error);
    if (error.original) {
      console.error("Erro original:", error.original);
    }
  }

  return sequelize;
}
