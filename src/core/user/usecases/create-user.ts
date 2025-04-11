import { UserRepository } from "../interfaces/user-repository";
import { User } from "../entities/user";
import { sendWelcomeEmail } from "../services/send-welcome-email";

export async function createUser(
  userRepo: UserRepository,
  data: User
): Promise<User> {
  const existing = await userRepo.findByEmail(data.email);
  if (existing) throw new Error("User already exists");

  const savedUser = await userRepo.save(data);

  sendWelcomeEmail({
    recipient: savedUser.email,
    firstName: savedUser.fullName,
  });

  return savedUser;
}

export async function updateUser(
  userRepo: UserRepository,
  data: User
): Promise<User | null> {
  await userRepo.update(data);
  const updatedUser = await userRepo.findByPk(data.id);
  return updatedUser;
}

export async function destroyUser(
  userRepo: UserRepository,
  userId: string
): Promise<undefined> {
  await userRepo.destroy(userId);
}
