import path from "path";
import dotenv from "dotenv";
import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import session from "@fastify/session";
import fastifyStatic from "@fastify/static";
import fastifyMultipart from "@fastify/multipart";

// Import custom modules
import fastifyPassport from "../../../passport";
import routes from "./routes";
import { handleError, handleSend } from "./hooks";
import { cookieSettings } from "../../../settings";
import { fetchPricesForProducts, tokenExpiryCheck } from "../../jobs/cron";

// Load env vars
dotenv.config();

const PORT = parseInt(process.env.PORT || "3000", 10);
const LOG_LEVEL =
  (process.env.LOG_LEVEL as "info" | "warn" | "error" | "debug") || "info";
const NODE_ENV = process.env.NODE_ENV || "test";
const SESSION_SECRET = process.env.SESSION_SECRET;

const ADDRESS = "0.0.0.0";

// Safety check
if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET is not defined in environment variables.");
}

// Create Fastify instance
const app: FastifyInstance = fastify({
  logger: {
    level: LOG_LEVEL,
    transport: NODE_ENV === "dev" ? { target: "pino-pretty" } : undefined,
  },
  disableRequestLogging: true,
});

// Register plugins
app.register(cookie);
app.register(session, {
  cookieName: "session",
  secret: SESSION_SECRET,
  cookie: {
    path: cookieSettings.path,
    sameSite: cookieSettings.sameSite as boolean | "lax" | "strict" | "none",
    secure: cookieSettings.secure,
    maxAge: cookieSettings.maxAge,
  },
});
app.register(fastifyPassport.initialize());
app.register(fastifyPassport.secureSession());
app.register(fastifyMultipart);
app.register(routes, { prefix: "/api" });
app.register(fastifyStatic, {
  root: path.join(process.cwd(), "static"),
  prefix: "/static/",
});

// Hooks
app.addHook("onSend", handleSend);
app.setErrorHandler(handleError);

// CORS
app.register(cors, {
  origin: (origin, callback) => {
    const env = process.env.NODE_ENV;

    if (env === "prod") {
      callback(null, origin === process.env.WEB_URL);
    } else if (env === "local" || env === "test") {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"), false);
    }
  },
  credentials: true,
});

// Background jobs
tokenExpiryCheck.start();
console.log("✅ Token expiry check job is enabled.");

fetchPricesForProducts.start();
console.log("✅ Price fetching job is enabled.");

// Start server
app.listen({ port: PORT, host: ADDRESS }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server listening at ${address}`);
});
