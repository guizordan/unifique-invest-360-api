import { UserRepository } from "../interfaces/user-repository";
import { User } from "../entities/user";
import { sendWelcomeEmail } from "../services/send-welcome-email";

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(data: { name: string; email: string }) {
    const user = new User("generated-id", data.name, data.email);
    if (!user.isValidEmail()) throw new Error("Invalid email");

    const savedUser = await this.userRepository.save(user);

    sendWelcomeEmail({ recipient: savedUser.email, firstName: savedUser.name });
  }
}
