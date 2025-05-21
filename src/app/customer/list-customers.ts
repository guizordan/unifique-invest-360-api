import ICustomerRepository from "@/core/customer/interfaces/ICustomerRepository";
import Customer from "@/core/customer/customer.entity";

export async function listCustomers(
  customerRepository: ICustomerRepository
): Promise<Customer[]> {
  return await customerRepository.getCustomers();
}
