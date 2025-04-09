import { Op } from "sequelize";
import { User } from "../../models/index.js";

export async function createUser(req, reply) {
  const { email, phone, firstName, lastName, password, bankAccount, role } =
    req.body;

  const newUser = await User.create({
    email,
    phone,
    firstName,
    lastName,
    password,
    bankAccount,
    role,
  });

  reply.code(201).send({
    data: { user: newUser, message: "Usuário cadastrado com sucesso." },
  });
}

export async function updateUser(req, reply) {
  const {
    email,
    phone,
    firstName,
    lastName,
    bankAccount = "",
    role,
  } = req.body;
  const userId = req.params.id;

  await User.update(
    {
      email,
      phone,
      firstName,
      lastName,
      bankAccount,
      role,
    },
    { where: { id: userId } }
  );

  const updatedUser = await User.findByPk(userId, {
    attributes: { exclude: ["password"] },
  });

  reply.code(200).send({
    data: {
      user: updatedUser,
      message: `${updatedUser.fullName} atualizado com sucesso.`,
    },
  });
}

export async function updateUserPassword(req, reply) {
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

export async function deleteUser(req, reply) {
  const userId = req.params.id;
  const result = await User.destroy({ where: { id: userId } });

  if (result === 0) {
    reply.code(404).send({ message: "Usuário não encontrado." });
  } else {
    reply.code(200).send({ data: { message: "Usuário deletado." } });
  }
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
