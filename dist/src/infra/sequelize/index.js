import { initCustomerModel } from "@/infra/sequelize/models/customer.model";
import sequelize from "@/infra/sequelize/azure.config";
if (!sequelize) {
    throw new Error("Falha ao inicializar o Sequelize.");
}
export const models = {
    Customer: initCustomerModel(sequelize)
};
Object.values(models).forEach((model)=>{
    if (typeof model.associate === "function") {
        model.associate(models);
    }
});

//# sourceMappingURL=index.js.map