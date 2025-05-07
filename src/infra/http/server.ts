import path from "path";
import dotenv from "dotenv";
dotenv.config();

const LOG_LEVEL =
  (process.env.LOG_LEVEL as
    | "fatal"
    | "error"
    | "warn"
    | "info"
    | "debug"
    | "trace") || "info";
const NODE_ENV =
  (process.env.NODE_ENV as "development" | "production" | "test" | "local") ||
  "test";

import fastify, { FastifyInstance, RawServerDefault } from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import session from "@fastify/session";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";

import routes from "@/infra/http/routes";
import { handleError, handleSend } from "@/infra/http/hooks";
import { cookieSettings } from "@/settings";

const fastifyApp: FastifyInstance = fastify<RawServerDefault>({
  logger: {
    level: LOG_LEVEL,
  },
  disableRequestLogging: true,
});

fastifyApp.register(cookie);
fastifyApp.register(session, {
  cookieName: "session",
  secret: process.env.SESSION_SECRET!,
  cookie: {
    path: cookieSettings.path,
    httpOnly: cookieSettings.httpOnly,
    sameSite: cookieSettings.sameSite,
    secure: cookieSettings.secure,
    maxAge: cookieSettings.maxAge,
  },
});

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
    if (NODE_ENV === "production") {
      callback(null, origin === process.env.WEB_URL);
    }

    if (NODE_ENV === "local") {
      callback(null, true);
    }

    if (NODE_ENV === "test") {
      callback(null, true);
    }
  },
  credentials: true,
});

export default fastifyApp;
