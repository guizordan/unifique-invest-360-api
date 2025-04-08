import { Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

interface SequelizeConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  logging: boolean | ((sql: string) => void);
}

const baseConfig: SequelizeConfig = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "my_db",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  dialect: "mysql",
  logging: false,
};

export default {
  development: {
    ...baseConfig,
    logging: console.log,
  },
  test: {
    ...baseConfig,
    database: process.env.DB_TEST_NAME || "my_db_test",
    logging: false,
  },
  production: {
    ...baseConfig,
    logging: false,
  },
};
