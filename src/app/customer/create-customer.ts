import CustomerRepository from "@/core/customer/interfaces/customer.repository";
import Customer from "@/core/customer/entities/Customer";
import { sendWelcomeEmail } from "./send-welcome-email";
import { v4 as uuidv4 } from "uuid";

interface CreateCustomerData {
  fullName: string;
  email: string;
}

export async function createCustomer(
  customerRepository: CustomerRepository,
  data: CreateCustomerData
): Promise<Customer> {
  const existing = await customerRepository.findByEmail(data.email);
  if (existing) {
    throw new Error("Customer already exists");
  }

  const customerId = uuidv4();
  const newCustomer = new Customer(customerId, data.fullName, data.email);

  const savedCustomer = await customerRepository.create(newCustomer);

  sendWelcomeEmail({
    recipient: savedCustomer.email,
    firstName: savedCustomer.fullName,
  });

  return savedCustomer;
}
