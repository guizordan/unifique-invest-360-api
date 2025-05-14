// // interfaces/http/controllers/customer.controller.ts
// import { FastifyReply, FastifyRequest } from "fastify";
// import { createCustomer } from "@/app/customer/create-customer";
// import CustomerRepository from "@/infra/database/repositories/customer.repository";

// import CustomerDTO from "@/core/customer/interfaces/customer.dto";

// export class CustomerController {
//   async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
//     try {
//       const customerData = request.body as CustomerDTO;

//       const customerRepository = new CustomerRepository();

//       const newCustomer = await createCustomer(
//         customerRepository,
//         customerData
//       );

//       reply.status(201).send(newCustomer);
//     } catch (error: any) {
//       console.error("Erro ao criar cliente:", error);
//       reply.status(400).send({ error: error.message });
//     }
//   }
// }
