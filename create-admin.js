import prompt from "prompt-sync";
import { User } from "./src/models/index.js";

const password = prompt()("Enter admin password: ");

const email = "mesa@unifiqueinvest.com.br";

try {
  await User.create({
    email: email,
    phone: "5436984205",
    firstName: "Mesa",
    lastName: "Unifique Invest",
    password: password,
    role: "admin",
  });

  console.log("Admin user created successfully.");
  console.log(email);
  console.log(password);
} catch (error) {
  console.error("Error creating admin user:", error);
}
