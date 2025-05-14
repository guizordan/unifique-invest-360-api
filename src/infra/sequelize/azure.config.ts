import * as msal from "@azure/msal-node";

// import { Sequelize } from "sequelize";
import { azureDBConfig } from "@/settings";
import { MsSqlDialect } from "@sequelize/mssql";
import Sequelize from "@sequelize/core";

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

const accessToken = await getAccessToken();

if (!accessToken) {
  console.error("Não foi possível obter o token de acesso.");
}

const sequelize = new Sequelize({
  dialect: "mssql",
  server: azureDBConfig.host,
  port: azureDBConfig.port,
  authentication: {
    type: "azure-active-directory-default",
    options: {
      token: accessToken,
    },
  },
  dialectOptions: {
    server: azureDBConfig.host,
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  },
  // logging: azureDBConfig.logging,
});

try {
  await sequelize.authenticate();
  console.log(sequelize.getDialect());

  console.log(
    "Conexão com o SQL Server via Sequelize e Entra ID estabelecida com sucesso!"
  );
} catch (error: any) {
  console.error("Erro ao conectar com Sequelize:", error);
  if (error.original) {
    console.error("Erro original:", error.original);
  }
}

export default sequelize;
