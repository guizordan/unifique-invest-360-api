import * as msal from "@azure/msal-node";

import { msalConfig } from "@/settings";

const pca = new msal.ConfidentialClientApplication(msalConfig);

const tokenRequest = {
  scopes: ["https://database.windows.net/.default"],
};

export async function getAccessToken(): Promise<string> {
  try {
    const response = await pca.acquireTokenByClientCredential(tokenRequest);
    return response?.accessToken!;
  } catch (error) {
    console.error("Erro ao obter token de acesso:", error);
    return "";
  }
}
