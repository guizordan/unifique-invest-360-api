import { models } from "@/infra/sequelize";
import Customer from "@/core/customer/entities/Customer";
import CustomerRepository from "@/core/customer/interfaces/customer.repository";

const toDomain = (model: any): Customer => {
  return new Customer({
    id: model.id,
    email: model.email,
    phone: model.phone,
    firstName: model.firstName,
    lastName: model.lastName,
    cpf: model.cpf,
  });
};

export default class SequelizeCustomerRepository implements CustomerRepository {
  async create(customer: Customer): Promise<Customer> {
    const createdModel = await models.Customer.create(customer);
    return toDomain(createdModel);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customerModel = await models.Customer.findOne({ where: { email } });
    return customerModel ? toDomain(customerModel) : null;
  }

  async update(customer: Customer): Promise<void> {
    if (!customer.id) {
      throw new Error("Customer ID is required for update");
    }

    const [updatedRows] = await models.Customer.update(customer, {
      where: { id: customer.id },
    });

    if (updatedRows === 0) {
      // Você pode optar por lançar uma exceção aqui se a atualização falhar
      // throw new Error(`Customer with ID ${customer.id} not found`);
      return; // Indica que nenhuma linha foi atualizada
    }
  }

  async findById(userId: string): Promise<Customer | null> {
    const customerModel = await models.Customer.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });
    return customerModel ? toDomain(customerModel) : null;
  }

  async destroy(userId: string): Promise<undefined> {
    await models.Customer.destroy({ where: { id: userId } });
  }
}
