// interfaces/http/controllers/customer.controller.ts
import { createCustomer } from "@/app/customer/create-customer";
import CustomerRepository from "@/infra/sequelize/repositories/customer.repository";
export class CustomerController {
    async create(request, reply) {
        try {
            const customerData = request.body;
            const customerRepository = new CustomerRepository();
            const newCustomer = await createCustomer(customerRepository, customerData);
            reply.status(201).send(newCustomer);
        } catch (error) {
            console.error("Erro ao criar cliente:", error);
            reply.status(400).send({
                error: error.message
            });
        }
    }
}

//# sourceMappingURL=customer.controller.js.map