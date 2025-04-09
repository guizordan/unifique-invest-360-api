import { passport } from "../../../helpers/index.js";

import {
  login,
  logout,
  updatePassword,
  requestPasswordRecovery,
  getAuthenticatedUser,
} from "../controllers/index.js";

function authRoutes(fastify, options, done) {
  fastify.post(
    "/auth/login",
    {
      preValidation: passport.authenticate("local", { session: true }),
    },
    login
  );
  fastify.post("/auth/check", getAuthenticatedUser);
  fastify.post("/auth/logout", logout);
  fastify.post("/auth/password-recovery", requestPasswordRecovery);
  fastify.put("/auth/password-update", updatePassword);

  done();
}

export default authRoutes;
