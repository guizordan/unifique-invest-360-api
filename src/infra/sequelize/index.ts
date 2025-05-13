import { initCustomerModel } from "@/infra/sequelize/models/customer.model";
import { initializeSequelize } from "@/infra/sequelize/azure.config";

const sequelize = await initializeSequelize();

if (!sequelize) {
  throw new Error("Falha ao inicializar o Sequelize.");
}

export const models = {
  Customer: initCustomerModel(sequelize),
};

Object.values(models).forEach((model: any) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});
