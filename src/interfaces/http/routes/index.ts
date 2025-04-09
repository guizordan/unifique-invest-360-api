import authRoutes from "./auth.routes.js";
import customerRoutes from "../../../routes/customerRoutes.js";
import backofficeRoutes from "../../../routes/backofficeRoutes.js";
import {
  isAuthenticated,
  isAdminOrBackoffice,
} from "../../../middlewares/index.js";
import { getLatestCommitHash } from "../../../helpers/index.js";

function routes(fastify, options, done) {
  fastify.register(authRoutes);

  fastify.register(backofficeRoutes, {
    prefix: "backoffice",
    preHandler: isAdminOrBackoffice,
  });

  fastify.register(customerRoutes, {
    prefix: "customer",
    preHandler: isAuthenticated,
  });

  fastify.get("/version", async (req, reply) => {
    try {
      const version = await getLatestCommitHash();
      reply.send({ data: version });
    } catch (error) {
      reply.status(500).send({ error: "Failed to retrieve commit hash" });
    }
  });

  done();
}

export default routes;
