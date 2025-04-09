import bcrypt from "bcrypt";
import { Authenticator } from "@fastify/passport";
import { Strategy as LocalStrategy } from "passport-local";

import { User } from "../models/index.js";

const fastifyPassport = new Authenticator();

const localStrategy = new LocalStrategy(async function (
  username,
  password,
  done
) {
  try {
    if (username && password) {
      const user = await User.findOne({ where: { email: username } });

      if (user) {
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return done(null, user);
        }
      }
    }

    return done(
      {
        statusCode: 401,
        message: "Nome de usuário ou senha incorretos.",
      },
      null
    );
  } catch (err) {
    return done(err);
  }
});

fastifyPassport.use("local", localStrategy);

fastifyPassport.registerUserSerializer(async (user, req) => {
  return user.id;
});

fastifyPassport.registerUserDeserializer(async (id, req) => {
  return await User.findByPk(id);
});

export default fastifyPassport;
