import { User } from "../entities/user";

export interface UserRepository {
  save(user: User): Promise<User>;
  update(user: User): Promise<User | null>;
  destroy(userId: string): Promise<undefined>;
  findByEmail(email: string): Promise<User | null>;
  findByPk(id: string | undefined): Promise<User | null>;
}
