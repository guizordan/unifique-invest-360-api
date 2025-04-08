import { OrderStatusEnum } from "../helpers/index.js";
import { Order, OrderStatus } from "../models/index.js";

export async function createOrder(req, reply) {
  const { user } = req;
  const {
    product,
    quantity,
    executionPrice,
    closurePrice,
    operationType,
    ticker,
    userId,
  } = req.body;

  const order = await Order.create({
    product,
    quantity,
    executionPrice,
    closurePrice,
    operationType,
    ticker,
    userId,
  });

  await OrderStatus.create({
    orderId: order.id,
    status: OrderStatusEnum.CREATED,
    createdBy: user.id,
  });

  await order.getStatuses();

  reply
    .code(201)
    .send({ data: { order, message: "Ordem criada com sucesso." } });
}

export async function updateOrder(req, reply) {
  const orderId = req.params.id;
  const {
    product,
    quantity,
    executionPrice,
    closurePrice,
    operationType,
    ticker,
    userId,
  } = req.body;

  const order = await Order.update(
    {
      product,
      quantity,
      executionPrice,
      closurePrice,
      operationType,
      ticker,
      userId,
    },
    { where: { id: orderId } }
  );

  reply
    .code(201)
    .send({ data: { order, message: "Ordem atualizada com sucesso." } });
}

export async function listOrders(req, reply) {
  const { limit = 10, page = 1, userId } = req.query;

  const limitInt = parseInt(limit, 10);
  const pageInt = parseInt(page, 10);

  if (isNaN(limitInt) || isNaN(pageInt) || limitInt <= 0 || pageInt <= 0) {
    reply.code(400).send({ error: "Paginação inválida." });
    return;
  }

  const offsetInt = (pageInt - 1) * limitInt;

  const whereCondition = userId
    ? { userId, deletedAt: null }
    : { deletedAt: null };

  const orders = await Order.findAll({
    where: whereCondition,
    limit: limitInt,
    offset: offsetInt,
    order: [["createdAt", "DESC"]],
  });

  const total = await Order.count({ where: whereCondition });

  for (const order of orders) {
    await order.getStatuses();
    await order.getUser();
  }

  const totalPages = Math.ceil(total / limitInt);

  reply.code(200).send({
    data: { list: orders, totalPages, currentPage: pageInt, total },
  });
}

export async function getOrder(req, reply) {
  const { id } = req.params;

  const order = await Order.findByPk(id);

  if (!order) {
    reply.code(404).send({ message: "Ordem não encontrada" });
    return;
  }

  await order.getStatuses();

  reply.code(200).send({
    data: { order },
  });
}

export async function deleteOrder(req, reply) {
  const orderId = req.params.id;

  await Order.update(
    {
      deletedAt: new Date(),
    },
    { where: { id: orderId } }
  );

  reply.code(200).send({ data: { message: "Ordem movida para lixeira." } });
}

export async function updateOrderStatus(req, reply) {
  const { user } = req;
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findOne({
    where: { id: orderId },
  });

  if (!order) {
    return reply.code(404).send({ message: "Ordem não encontrada." });
  }

  await OrderStatus.create({
    orderId: order.id,
    status,
    createdBy: user.id,
  });

  await order.getStatuses();
  await order.getUser();

  reply.send({
    data: { order, message: "Status da ordem atualizado com sucesso." },
  });
}
