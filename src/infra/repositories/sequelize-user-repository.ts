import { UserRepository } from "../../core/interfaces/user-repository";
import { UserModel } from "../database/models/user.model";
import { User } from "../../core/user/entities/user";

export class SequelizeUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    await UserModel.create(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ where: { email } });
    return user ? new User(user.id, user.name, user.email) : null;
  }
}
