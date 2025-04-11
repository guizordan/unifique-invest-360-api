import { models } from "../sequelize";

import { User } from "../../core/user/entities/user";
import { UserRepository } from "../../core/user/interfaces/user-repository";

export class SequelizeUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    await models.User.create(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await models.User.findOne({ where: { email } });
    if (user) {
      return new User(
        user.id,
        user.email,
        user.phone,
        user.firstName,
        user.lastName,
        user.password,
        user.role
      );
    }

    return null;
  }

  async update(data: User): Promise<User | null> {
    await models.User.update(data, { where: { id: data.id } });

    const user = await models.User.findByPk(data.id, {
      attributes: { exclude: ["password"] },
    });

    if (user) {
      return new User(
        user.id,
        user.email,
        user.phone,
        user.firstName,
        user.lastName,
        user.password,
        user.role
      );
    }

    return null;
  }

  async findByPk(userId: string): Promise<User | null> {
    if (userId) {
      const user = await models.User.findByPk(userId, {
        attributes: { exclude: ["password"] },
      });

      if (user) {
        return new User(
          user.id,
          user.email,
          user.phone,
          user.firstName,
          user.lastName,
          user.password,
          user.role
        );
      }
    }

    return null;
  }

  async destroy(userId: string): Promise<undefined> {
    await models.User.destroy({ where: { id: userId } });
  }
}
