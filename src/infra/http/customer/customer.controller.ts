// interfaces/http/controllers/customer.controller.ts
import { FastifyReply, FastifyRequest } from "fastify";
import { createCustomer } from "@/app/customer/create-customer";
import CustomerRepository from "@/infra/database/repositories/customer.repository";

import { initializedDataSource } from "@/index";
import CustomerDTO from "@/core/customer/interfaces/CustomerDTO";
import { listCustomers } from "@/app/customer/list-customers";

export class CustomerController {
  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const customerData = request.body as CustomerDTO;
      const customerRepository = new CustomerRepository(initializedDataSource);

      const newCustomer = await createCustomer(
        customerRepository,
        customerData
      );

      reply.status(201).send(newCustomer);
    } catch (error: any) {
      console.error("Erro ao criar cliente:", error);
      reply.status(400).send({ error: error.message });
    }
  }

  async list(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const customerRepository = new CustomerRepository(initializedDataSource);
      const customers = await listCustomers(customerRepository);

      reply.status(200).send({ data: customers });
    } catch (error: any) {
      console.error("Erro ao buscar clientes:", error);
      reply.status(400).send({ error: error.message });
    }
  }
}
