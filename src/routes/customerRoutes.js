import {
  getAllCustomerOrders,
  getCustomerOrderById,
  createCustomerOrder,
  updateCustomerOrderStatus,
  listProducts,
  listProductTickers,
  listNews,
  getNews,
} from "../controllers/index.js";

function customerRoutes(fastify, { preHandler }, done) {
  /* orders */
  fastify.get("/orders", { preHandler }, getAllCustomerOrders);
  fastify.post("/orders", { preHandler }, createCustomerOrder);
  fastify.get("/orders/:id", { preHandler }, getCustomerOrderById);
  fastify.put("/orders/:id", { preHandler }, updateCustomerOrderStatus);

  /* products */
  fastify.get("/products", { preHandler }, listProducts);
  fastify.get("/tickers/:product", { preHandler }, listProductTickers);

  /* news */
  fastify.get("/news", { preHandler }, listNews);
  fastify.get("/news/:id", { preHandler }, getNews);

  done();
}

export default customerRoutes;
