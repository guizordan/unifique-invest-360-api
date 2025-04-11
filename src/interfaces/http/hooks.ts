import { FastifyReply, FastifyRequest } from "fastify";

export function isHttpErrorCode(code: number): boolean {
  return code >= 400 && code <= 599;
}

interface AppError extends Error {
  statusCode?: number;
  errors?: Array<{ message: string }>;
}

export function handleSend(
  req: FastifyRequest,
  reply: FastifyReply,
  payload: unknown
): unknown {
  if (typeof payload !== "string") {
    return payload as string;
  }

  let parsedPayload: any;

  try {
    parsedPayload = JSON.parse(payload);
  } catch {
    return payload;
  }

  const { success = true, message, error, data } = parsedPayload;
  const statusCode = reply.statusCode;

  const formattedResponse: {
    success: boolean;
    data?: unknown;
    messages: string[];
  } = {
    success: Boolean(success),
    data,
    messages: [],
  };

  if (typeof message === "string" && message) {
    const messages = message
      .replace(",\n", "")
      .split("Validation error: ")
      .filter((item) => item.trim() !== "");

    formattedResponse.messages.push(...messages);
  }

  if (!success || isHttpErrorCode(statusCode)) {
    if (typeof error === "string" && error) {
      formattedResponse.messages.push(error);
    }

    const errorResponse = {
      ...formattedResponse,
      success: false,
    };

    return JSON.stringify(errorResponse);
  }

  return JSON.stringify(formattedResponse);
}

export function handleError(
  err: AppError,
  req: FastifyRequest,
  reply: FastifyReply
): void {
  const { statusCode, message, errors = [] } = err;

  const errorResponse = {
    message:
      errors[0]?.message ||
      message ||
      "Ocorreu um erro inesperado. Por favor, tente novamente.",
  };

  reply.code(statusCode || 500).send(errorResponse);
}
