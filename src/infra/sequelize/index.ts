import { Sequelize } from "sequelize";

import { NODE_ENV } from "@/settings";
import config from "@/infra/sequelize/config/sequelize.config";

import { initCustomerModel } from "@/infra/sequelize/models/customer.model";

const dbConfig = config[NODE_ENV as keyof typeof config];

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: dbConfig.logging,
  }
);

// Init all models
export const models = {
  Customer: initCustomerModel(sequelize),
  // add other models here
};

// Setup associations
Object.values(models).forEach((model: any) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});
