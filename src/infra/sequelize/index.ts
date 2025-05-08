import { Sequelize } from "sequelize";
import { NODE_ENV } from "@/settings";
import config from "@/infra/sequelize/config/sequelize.config";
import { initCustomerModel } from "@/infra/sequelize/models/customer.model";
import * as msal from "@azure/msal-node";

const msalConfig = {
  auth: {
    clientId: process.env.AZURE_AD_CLIENT_ID!,
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
    authority: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}`,
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

async function initializeSequelize() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    console.error("Não foi possível obter o token de acesso.");
    return null;
  }

  const dbConfig = config[NODE_ENV as keyof typeof config];

  const sequelize = new Sequelize(dbConfig.database, "", "", {
    dialect: "mssql",
    host: dbConfig.host,
    port: dbConfig.port,
    dialectOptions: {
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
    logging: dbConfig.logging,
  });

  try {
    await sequelize.authenticate();
    console.log(
      "Conexão com o SQL Server via Sequelize e Entra ID estabelecida com sucesso!"
    );
  } catch (error) {
    console.error("Erro ao conectar com Sequelize:", error);
  }

  return sequelize;
}

const sequelize = await initializeSequelize();

if (!sequelize) {
  throw new Error("Falha ao inicializar o Sequelize.");
}

export const models = {
  Customer: initCustomerModel(sequelize),
};

Object.values(models).forEach((model: any) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});
