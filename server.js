import path from "path";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const NODE_ENV = process.env.NODE_ENV || "test";

const ADDRESS = "0.0.0.0";

import fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import session from "@fastify/session";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";

import fastifyPassport from "./src/helpers/passport.js";
import routes from "./src/routes/index.js";
import { handleError, handleSend } from "./src/hooks/index.js";
import { cookieSettings } from "./src/consts/index.js";
import { fetchPricesForProducts, tokenExpiryCheck } from "./jobs/index.js";

const fastifyApp = fastify({
  logger: {
    level: LOG_LEVEL,
    prettyPrint: NODE_ENV === "dev",
  },
  disableRequestLogging: true,
});

fastifyApp.register(cookie);
fastifyApp.register(session, {
  cookieName: "session",
  secret: process.env.SESSION_SECRET,
  cookie: {
    path: cookieSettings.path,
    sameSite: cookieSettings.sameSite,
    secure: cookieSettings.secure,
    maxAge: cookieSettings.maxAge,
  },
});

fastifyApp.register(fastifyPassport.initialize());
fastifyApp.register(fastifyPassport.secureSession());
fastifyApp.register(fastifyMultipart);
fastifyApp.register(routes, { prefix: "/api" });

fastifyApp.register(fastifyStatic, {
  root: path.join(process.cwd(), "static"),
  prefix: "/static/",
});

fastifyApp.addHook("onSend", handleSend);
fastifyApp.setErrorHandler(handleError);

fastifyApp.register(cors, {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === "prod") {
      callback(null, origin === process.env.WEB_URL);
    }

    if (process.env.NODE_ENV === "local") {
      callback(null, true);
    }

    if (process.env.NODE_ENV === "test") {
      callback(null, true);
    }
  },
  credentials: true,
});

tokenExpiryCheck.start();
console.log("Token expiry check job is enabled.");

fetchPricesForProducts.start();
console.log("Price fetching job is enabled.");

fastifyApp.listen({ port: PORT, host: ADDRESS }, (err, address) => {
  if (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }
});
