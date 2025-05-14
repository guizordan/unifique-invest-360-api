import Customer from "@/core/customer/entities/Customer";
import { sendWelcomeEmail } from "./send-welcome-email";
import { v4 as uuidv4 } from "uuid";
export async function createCustomer(customerRepository, customerData) {
    const existing = await customerRepository.findByEmail(customerData.email);
    if (existing) {
        throw new Error("Customer already exists");
    }
    const id = uuidv4();
    const newCustomer = new Customer({
        id,
        ...customerData
    });
    const savedCustomer = await customerRepository.create(newCustomer);
    sendWelcomeEmail({
        recipient: savedCustomer.email,
        firstName: savedCustomer.fullName
    });
    return savedCustomer;
}

//# sourceMappingURL=create-customer.js.map