import { Dialect } from "sequelize";
import dotenv from "dotenv";
import { databaseConfig, DB_TEST_NAME } from "../../settings";

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
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  host: databaseConfig.host,
  port: databaseConfig.port,
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
    database: DB_TEST_NAME,
    logging: false,
  },
  production: {
    ...baseConfig,
    logging: false,
  },
};
