import { Op } from "sequelize";
import { User } from "../../../core/user/entities/user";

import { FastifyRequest, FastifyReply, FastifyError } from "fastify";
import {
  createUser,
  updateUser,
} from "../../../core/user/usecases/create-user";
import { SequelizeUserRepository } from "../../../infrastructure/repositories/sequelize-user-repository";

const userRepo = new SequelizeUserRepository();

export async function handleCreateUser(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { email, phone, firstName, lastName, password, role } = req.body as any;

  const newUser = new User(
    undefined,
    email,
    phone,
    firstName,
    lastName,
    password,
    role
  );

  try {
    const user = await createUser(userRepo, newUser);
    return reply.send({ success: true, data: user });
  } catch (err) {
    const error = err as FastifyError;

    return reply.status(error.statusCode ?? 500).send({
      success: false,
      error: error.message || "Erro interno do servidor",
    });
  }
}

export async function handleUpdateUser(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string };
  const { email, phone, firstName, lastName, password, role } = req.body as any;

  const user = new User(id, email, phone, firstName, lastName, password, role);

  try {
    const updatedUser = await updateUser(userRepo, user);

    return reply.code(200).send({
      data: {
        user: updatedUser,
        message: `${updatedUser.fullName} atualizado com sucesso.`,
      },
    });
  } catch (err) {
    const error = err as FastifyError;

    return reply.status(error.statusCode ?? 500).send({
      success: false,
      error: error.message || "Erro interno do servidor",
    });
  }
}

export async function deleteUser(req, reply) {
  const userId = req.params.id;
  const result = await destroyUser({ where: { id: userId } });

  if (result === 0) {
    reply.code(404).send({ message: "Usuário não encontrado." });
  } else {
    reply.code(200).send({ data: { message: "Usuário deletado." } });
  }
}

export async function updateUserPassword(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { password, passwordConfirm } = req.body;
  const userId = req.params.id;

  if (password !== passwordConfirm) {
    throw new Error("As senhas não coincidem.");
  }

  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  user.password = password;
  await user.save();

  const updatedUser = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  reply.code(200).send({
    data: {
      user: updatedUser,
      message: `Senha de ${updatedUser.fullName} alterada com sucesso.`,
    },
  });
}

export async function listUsers(req, reply) {
  const { limit = 10, page = 1, search = "" } = req.query;

  const limitInt = parseInt(limit, 10);
  const pageInt = parseInt(page, 10);

  if (isNaN(limitInt) || isNaN(pageInt) || limitInt <= 0 || pageInt <= 0) {
    reply.code(400).send({ error: "Paginação inválida." });
    return;
  }

  const offsetInt = (pageInt - 1) * limitInt;

  const whereCondition = search
    ? {
        [Op.or]: [
          { firstName: { [Op.like]: `%${search}%` } },
          { lastName: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ],
      }
    : {};

  const total = await User.count({ where: whereCondition });

  const users = await User.findAll({
    where: whereCondition,
    limit: limitInt,
    offset: offsetInt,
    attributes: { exclude: ["password"] },
  });

  const totalPages = Math.ceil(total / limitInt);

  reply.code(200).send({
    data: { list: users, totalPages, currentPage: pageInt, total },
  });
}

export async function getUser(req, reply) {
  const { id } = req.params;

  const user = await User.findByPk(id);

  if (!user) {
    reply.code(404).send({ message: "Usuário não encontrado." });
    return;
  }

  reply.code(200).send({ data: { user } });
}
