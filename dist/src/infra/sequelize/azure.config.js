import * as msal from "@azure/msal-node";
import * as tedious from "tedious";
import { Sequelize } from "sequelize";
import { azureDBConfig } from "@/settings";
const msalConfig = {
    auth: {
        clientId: azureDBConfig.clientId,
        clientSecret: azureDBConfig.clientSecret,
        authority: azureDBConfig.authority
    }
};
const pca = new msal.ConfidentialClientApplication(msalConfig);
const tokenRequest = {
    scopes: [
        "https://database.windows.net/.default"
    ]
};
async function getAccessToken() {
    try {
        const response = await pca.acquireTokenByClientCredential(tokenRequest);
        return response?.accessToken;
    } catch (error) {
        console.error("Erro ao obter token de acesso:", error);
        return "";
    }
}
const accessToken = await getAccessToken();
if (!accessToken) {
    console.error("Não foi possível obter o token de acesso.");
}
console.log("Type of tedious:", typeof tedious);
const sequelize = new Sequelize(azureDBConfig.database, "", "", {
    dialect: azureDBConfig.dialect,
    host: azureDBConfig.host,
    port: azureDBConfig.port,
    dialectModule: tedious,
    dialectOptions: {
        server: azureDBConfig.host,
        options: {
            encrypt: true,
            trustServerCertificate: false
        },
        authentication: {
            type: "azure-active-directory-default",
            options: {
                token: accessToken
            }
        }
    },
    logging: azureDBConfig.logging
});
try {
    await sequelize.authenticate();
    console.log(sequelize.getDialect());
    console.log("Conexão com o SQL Server via Sequelize e Entra ID estabelecida com sucesso!");
} catch (error) {
    console.error("Erro ao conectar com Sequelize:", error);
    if (error.original) {
        console.error("Erro original:", error.original);
    }
}
export default sequelize;

//# sourceMappingURL=azure.config.js.map