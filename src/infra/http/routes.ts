import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { CustomerController } from "@/infra/http/customer/customer.controller";

function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: (err?: Error) => void
) {
  const customerController = new CustomerController();

  fastify.post("/customers", customerController.create);
  fastify.get("/customers", customerController.list);

  done();
}

export default routes;
