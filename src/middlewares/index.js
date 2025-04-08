const unauthenticatedMessage = "Você saiu.";

const unauthorizedMessage =
  "Você não tem permissão para utilizar este recurso.";

export function isAuthenticated(req, reply, done) {
  if (req.isAuthenticated()) {
    return done();
  }

  reply.code(403).send({ message: unauthenticatedMessage });
}

export function isAdmin(req, reply, done) {
  if (!req.isAuthenticated()) {
    reply.code(403).send({ message: unauthenticatedMessage });
  }

  if (req.user?.role === "admin") {
    return done();
  }

  reply.code(401).send({ message: unauthorizedMessage });
}

export function isAdminOrBackoffice(req, reply, done) {
  if (!req.isAuthenticated()) {
    return reply.code(403).send({ message: unauthenticatedMessage });
  }

  if (req.user?.role === "admin" || req.user?.role === "backoffice") {
    return done();
  }

  reply.code(401).send({ message: unauthorizedMessage });
}
