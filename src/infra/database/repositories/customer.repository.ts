import { DataSource, Repository } from "typeorm";
import Customer from "@/core/customer/customer.entity";
import CustomerRepository from "@/core/customer/interfaces/customer.repository";
import CustomerEntity from "@/core/customer/customer.entity";

export default class TypeormCustomerRepository implements CustomerRepository {
  private readonly customerRepository: Repository<CustomerEntity>;

  constructor(dataSource: DataSource) {
    this.customerRepository = dataSource.getRepository(CustomerEntity);
  }

  private toDomain(customerEntity: CustomerEntity): Customer {
    return new Customer({
      id: customerEntity.id,
      email: customerEntity.email,
      phone: customerEntity.phone,
      firstName: customerEntity.firstName,
      lastName: customerEntity.lastName,
      cpf: customerEntity.cpf,
    });
  }

  private toEntity(customer: Customer): CustomerEntity {
    const customerEntity = new CustomerEntity({
      id: customer.id,
      email: customer.email,
      phone: customer.phone,
      firstName: customer.firstName,
      lastName: customer.lastName,
      cpf: customer.cpf,
    });
    return customerEntity;
  }

  async create(customer: Customer): Promise<Customer> {
    const customerEntity = this.toEntity(customer);
    const savedCustomerEntity =
      await this.customerRepository.save(customerEntity);
    return this.toDomain(savedCustomerEntity);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customerEntity = await this.customerRepository.findOne({
      where: { email },
    });
    return customerEntity ? this.toDomain(customerEntity) : null;
  }

  async update(customer: Customer): Promise<void> {
    const customerEntity = await this.customerRepository.preload(
      this.toEntity(customer)
    );

    if (!customerEntity) {
      return;
    }
    await this.customerRepository.save(customerEntity);
  }

  async findById(id: string): Promise<Customer | null> {
    const customerEntity = await this.customerRepository.findOneBy({ id });
    return customerEntity ? this.toDomain(customerEntity) : null;
  }

  async destroy(id: string): Promise<undefined> {
    await this.customerRepository.delete(id);
    return undefined;
  }
}
