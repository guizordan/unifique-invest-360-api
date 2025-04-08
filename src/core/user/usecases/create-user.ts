import { sendWelcomeEmail } from "../../../application/services/mailer";
import { UserRepository } from "../../interfaces/user-repository";
import { User } from "../entities/user";

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(data: { name: string; email: string }) {
    const user = new User("generated-id", data.name, data.email);
    if (!user.isValidEmail()) throw new Error("Invalid email");

    const savedUser = this.userRepository.save(user);

    sendWelcomeEmail({ recipient: savedUser.email, firstName: savedUser.name });
  }
}
