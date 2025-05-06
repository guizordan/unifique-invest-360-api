// interfaces/http/controllers/customer.controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { createCustomer } from "@/app/customer/create-customer";
import CustomerRepository from "@/infra/sequelize/repositories/customer.repository";
import Customer from "@/core/customer/entities/Customer";

export class CustomerController {
  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const { id, fullName, email } = request.body as any; // Adapte a tipagem conforme sua necessidade

      // Instancia a implementação do repositório DENTRO do controller
      const customerRepository = new CustomerRepository();

      // Chama a função pura createCustomer, passando as dependências
      const newCustomer = await createCustomer(customerRepository, {
        id,
        fullName,
        email,
      });

      reply.status(201).send(newCustomer);
    } catch (error: any) {
      console.error("Erro ao criar cliente:", error);
      reply.status(400).send({ error: error.message });
    }
  }
}
