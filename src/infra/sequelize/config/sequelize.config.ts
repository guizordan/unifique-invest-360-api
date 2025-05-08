import { Dialect } from "sequelize";

import { databaseConfig, DB_TEST_NAME } from "@/settings";

interface SequelizeConfig {
  database: string;
  host: string;
  port: number;
  dialect: Dialect;
  logging: boolean | ((sql: string) => void);
}

const baseConfig: SequelizeConfig = {
  database: databaseConfig.database,
  host: databaseConfig.host,
  port: databaseConfig.port,
  dialect: "mssql",
  logging: false,
};

export default {
  local: {
    ...baseConfig,
    logging: console.log,
  },
  dev: {
    ...baseConfig,
    logging: console.log,
  },
  test: {
    ...baseConfig,
    database: DB_TEST_NAME,
    logging: false,
  },
  prod: {
    ...baseConfig,
    logging: false,
  },
};
