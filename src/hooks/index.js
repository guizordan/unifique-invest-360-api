import { isHttpErrorCode } from "../helpers/index.js";

export function handleSend(req, reply, payload, done) {
  let parsedPayload;

  try {
    parsedPayload = JSON.parse(payload);
  } catch (error) {
    return done(null, payload);
  }

  const { success = true, message, error, data } = parsedPayload;
  const statusCode = reply.statusCode;

  const formattedResponse = {
    success: Boolean(success),
    data,
    messages: [],
  };

  if (typeof message === "string" && message) {
    const messages = message
      .replace(",\n", "")
      .split("Validation error: ")
      .filter((item) => item.trim() !== "");

    formattedResponse.messages = [...formattedResponse.messages, ...messages];
  }

  if (!success || isHttpErrorCode(statusCode)) {
    if (typeof error === "string" && error) {
      formattedResponse.messages.push(error);
    }

    const errorResponse = {
      ...formattedResponse,
      success: false,
    };

    return done(null, JSON.stringify(errorResponse));
  }

  return done(null, JSON.stringify(formattedResponse));
}

export function handleError(ex, req, reply) {
  const { statusCode, message, errors = [] } = ex;

  const errorResponse = {
    message:
      errors[0]?.message ||
      message ||
      "Ocorreu um erro inesperado. Por favor, tente novamente.",
  };

  reply.code(statusCode || 500).send(errorResponse);
}
