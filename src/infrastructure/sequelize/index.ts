import { Sequelize } from "sequelize";
import config from "./config/sequelize.config";
import { initUserModel } from "./models/User.model";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env as keyof typeof config];

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
  User: initUserModel(sequelize),
  // add other models here
};

// Setup associations
Object.values(models).forEach((model: any) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});
