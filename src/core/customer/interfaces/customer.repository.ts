import Customer from "../customer.entity";

export default interface CustomerRepository {
  create(entity: Customer): Promise<Customer>;
  update(customer: Customer): Promise<void>;
  destroy(customerId: string): Promise<undefined>;
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: string | undefined): Promise<Customer | null>;
}
