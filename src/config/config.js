import dotenv from "dotenv";
dotenv.config();

const DB_USERNAME = process.env.DB_USERNAME || "ferticred";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_DIALECT = process.env.DB_DIALECT || "mysql";
const DB_PASSWORD = process.env.DB_PASSWORD;

let DB_DATABASE = process.env.DB_DATABASE;

if (!DB_DATABASE) {
  DB_DATABASE = process.env.NODE_ENV
    ? `ferticred-${process.env.NODE_ENV}`
    : "ferticred";
}

console.info({
  host: DB_HOST,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD ? "yes" : "no",
});

export default {
  host: DB_HOST,
  dialect: DB_DIALECT,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,
};
