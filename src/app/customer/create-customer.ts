import CustomerRepository from "@/core/customer/interfaces/ICustomerRepository";
import Customer from "@/core/customer/customer.entity";
import { sendWelcomeEmail } from "./send-welcome-email";
import { v4 as uuidv4 } from "uuid";
import CustomerDTO from "@/core/customer/interfaces/CustomerDTO";

export async function createCustomer(
  customerRepository: CustomerRepository,
  customerData: CustomerDTO
): Promise<Customer> {
  const existing = await customerRepository.findByEmail(customerData.email);
  if (existing) {
    throw new Error("Customer already exists");
  }

  const id = uuidv4();
  const newCustomer = new Customer({
    id,
    ...customerData,
  });

  const savedCustomer = await customerRepository.create(newCustomer);

  return savedCustomer;
}
