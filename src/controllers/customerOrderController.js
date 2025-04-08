import { OrderStatusEnum } from "../helpers/index.js";
import { Order, OrderStatus } from "../models/index.js";

export async function getAllCustomerOrders(req, reply) {
  const { user } = req;
  const { limit = 10, page = 1 } = req.query;

  const limitInt = parseInt(limit, 10);
  const pageInt = parseInt(page, 10);

  if (isNaN(limitInt) || isNaN(pageInt) || limitInt <= 0 || pageInt <= 0) {
    reply.code(400).send({ error: "Paginação inválida." });
    return;
  }

  const offsetInt = (pageInt - 1) * limitInt;

  const orders = await Order.findAll({
    where: { userId: user.id, deletedAt: null },
    limit: limitInt,
    offset: offsetInt,
    order: [["createdAt", "DESC"]],
  });

  const total = await Order.count({ where: { userId: user.id } });

  for (const order of orders) {
    await order.getStatuses();
  }

  const totalPages = Math.ceil(total / limitInt);

  reply.code(200).send({
    data: { list: orders, totalPages, currentPage: pageInt, total },
  });
}

export async function createCustomerOrder(req, reply) {
  const { user } = req;
  const { product, quantity, ticker, operationType } = req.body;

  const order = await Order.create({
    product,
    quantity,
    ticker,
    operationType,
    userId: user.id,
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

export async function getCustomerOrderById(req, reply) {
  const { user } = req;
  const { id } = req.params;

  const order = await Order.findOne({ where: { userId: user.id, id } });

  if (!order) {
    return reply.code(404).send({ message: "Ordem não encontrada." });
  }

  await order.getStatuses();
  reply.send({ data: order });
}

export async function updateCustomerOrderStatus(req, reply) {
  const { user } = req;
  const { id } = req.params;
  const { status } = req.body;

  if (
    status !== OrderStatusEnum.APPROVED &&
    status !== OrderStatusEnum.CANCELLED
  ) {
    return reply.code(401).send({ message: "Operação não permitida." });
  }

  const order = await Order.findOne({ where: { userId: user.id, id } });

  if (!order) {
    return reply.code(404).send({ message: "Ordem não encontrada." });
  }

  await order.getStatuses();

  if (order.dataValues.currentStatus !== OrderStatusEnum.CREATED) {
    return reply.code(401).send({ message: "Operação não permitida." });
  }

  if (
    order.dataValues.currentStatus === OrderStatusEnum.CREATED &&
    status === OrderStatusEnum.APPROVED
  ) {
    return reply.code(401).send({ message: "Operação não permitida." });
  }

  await OrderStatus.create({
    orderId: order.id,
    status,
    createdBy: user.id,
  });

  await order.getStatuses();
  reply.send({ data: { order } });
}

export async function deleteCustomerOrder(req, reply) {
  const orderId = req.params.id;

  const result = await Order.destroy({ where: { id: orderId } });

  if (result === 0) {
    reply.code(404).send({ message: "Ordem não encontrada." });
  } else {
    reply.code(200).send({ data: { message: "Ordem deletada." } });
  }
}
