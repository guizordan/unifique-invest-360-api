import dotenv from "dotenv";
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || "prod";
const secure = NODE_ENV === "local" ? false : true;

export const WEB_URL = process.env.WEB_URL || "https://test.unifique.com.br/";

export const DB_TEST_NAME = process.env.DB_TEST_NAME || "my_db_test";
export const LOG_LEVEL =
  (process.env.LOG_LEVEL as "info" | "warn" | "error" | "debug") || "info";
export const PORT = parseInt(process.env.PORT || "3000", 10);
export const MAILER_KEY = process.env.MAILER_KEY || "";

export const SESSION_SECRET = process.env.SESSION_SECRET;

export const ADMIN_SENDER =
  process.env.NODE_ENV === "prod"
    ? "admin@unifique.com.br"
    : "admin@test.unifique.com.br";

const sameSite = {
  prod: "Strict",
  test: "None",
  local: "Lax",
}[NODE_ENV] as "lax" | "none" | "strict" | undefined;

export const cookieSettings = {
  path: "/",
  httpOnly: true,
  maxAge: 7200000,
  sameSite,
  secure,
};

export const databaseConfig = {
  database: process.env.AZURE_SQL_DATABASE || "unifique",
  host: process.env.AZURE_SQL_SERVER!,
  port: Number(process.env.AZURE_SQL_PORT) || 1433,
  dialect: "mssql",
  logging: false,
};
