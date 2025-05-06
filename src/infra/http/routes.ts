import { FastifyInstance, FastifyPluginOptions } from "fastify";

// Importe suas rotas e middlewares aqui
// import authRoutes from './authRoutes';
// import backofficeRoutes from './backofficeRoutes';
// import customerRoutes from './customerRoutes';
// import { isAdminOrBackoffice, isAuthenticated } from '../middlewares/auth'; // Ajuste o caminho conforme necessário

function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions,
  done: (err?: Error) => void
) {
  // fastify.register(authRoutes);

  // fastify.register(backofficeRoutes, {
  //   prefix: "backoffice",
  //   preHandler: isAdminOrBackoffice,
  // });

  // fastify.register(customerRoutes, {
  //   prefix: "customer",
  //   preHandler: isAuthenticated,
  // });

  fastify.get("/", async (req, reply) => {
    reply.send("hi");
  });

  done();
}

export default routes;
