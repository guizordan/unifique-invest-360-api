import { models } from "@/infra/sequelize";
import Customer from "@/core/customer/entities/Customer";
const toDomain = (model)=>{
    return new Customer({
        id: model.id,
        email: model.email,
        phone: model.phone,
        firstName: model.firstName,
        lastName: model.lastName,
        cpf: model.cpf
    });
};
class SequelizeCustomerRepository {
    async create(customer) {
        const createdModel = await models.Customer.create(customer);
        return toDomain(createdModel);
    }
    async findByEmail(email) {
        const customerModel = await models.Customer.findOne({
            where: {
                email
            }
        });
        return customerModel ? toDomain(customerModel) : null;
    }
    async update(customer) {
        if (!customer.id) {
            throw new Error("Customer ID is required for update");
        }
        const [updatedRows] = await models.Customer.update(customer, {
            where: {
                id: customer.id
            }
        });
        if (updatedRows === 0) {
            // Você pode optar por lançar uma exceção aqui se a atualização falhar
            // throw new Error(`Customer with ID ${customer.id} not found`);
            return; // Indica que nenhuma linha foi atualizada
        }
    }
    async findById(userId) {
        const customerModel = await models.Customer.findByPk(userId, {
            attributes: {
                exclude: [
                    "password"
                ]
            }
        });
        return customerModel ? toDomain(customerModel) : null;
    }
    async destroy(userId) {
        await models.Customer.destroy({
            where: {
                id: userId
            }
        });
    }
}
export { SequelizeCustomerRepository as default };

//# sourceMappingURL=customer.repository.js.map