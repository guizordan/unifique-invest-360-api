// import fastifyMulter from "fastify-multer";

import {
  createUser,
  upsertProduct,
  listProducts,
  listUsers,
  getProduct,
  getUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  deleteProduct,
  listOrders,
  deleteOrder,
  createOrder,
  updateOrderStatus,
  getOrder,
  updateOrder,
  listNews,
  getNews,
  deleteNews,
  updateNews,
  createNews,
} from "../controllers/index.js";

function backofficeRoutes(fastify, { preHandler }, done) {
  /* users */
  fastify.get("/users", { preHandler }, listUsers);
  fastify.get("/users/:id", { preHandler }, getUser);
  fastify.post("/users", { preHandler }, createUser);
  fastify.put("/users/:id", { preHandler }, updateUser);
  fastify.put("/users/update-password/:id", { preHandler }, updateUserPassword);
  fastify.delete("/users/:id", { preHandler }, deleteUser);

  /* products */
  fastify.get("/products", { preHandler }, listProducts);
  fastify.get("/products/:id", { preHandler }, getProduct);
  fastify.put("/products/:id", { preHandler }, upsertProduct);
  fastify.delete("/products/:id", { preHandler }, deleteProduct);

  /* orders */
  fastify.post("/orders", { preHandler }, createOrder);
  fastify.get("/orders", { preHandler }, listOrders);
  fastify.get("/orders/:id", { preHandler }, getOrder);
  fastify.put("/orders/:id", { preHandler }, updateOrder);
  fastify.delete("/orders/:id", { preHandler }, deleteOrder);

  /* order status */
  fastify.post(
    "/update-order-status/:orderId",
    { preHandler },
    updateOrderStatus
  );

  /* news */
  fastify.post("/news", { preHandler }, createNews);
  fastify.put("/news/:id", { preHandler }, updateNews);
  fastify.delete("/news/:id", { preHandler }, deleteNews);

  done();
}

export default backofficeRoutes;
