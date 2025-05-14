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
