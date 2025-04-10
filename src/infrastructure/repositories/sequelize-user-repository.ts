import { User } from "../../core/user/entities/user";
import { UserRepository } from "../../core/user/interfaces/user-repository";
import { models } from "../sequelize";

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
}
