import { FastifyReply, FastifyRequest } from "fastify";

function isHttpErrorCode(httpCode: number): boolean {
  return httpCode >= 400 && httpCode < 600;
}

interface ParsedPayload {
  success?: boolean;
  message?: string | string[];
  error?: string;
  data?: any;
}

export function handleSend(
  req: FastifyRequest,
  reply: FastifyReply,
  payload: string,
  done: (err: Error | null, payload?: string) => void
): void {
  let parsedPayload: ParsedPayload | string;

  try {
    parsedPayload = JSON.parse(payload);
  } catch (error) {
    return done(null, payload);
  }

  const {
    success = true,
    message,
    error,
    data,
  } = parsedPayload as ParsedPayload;
  const statusCode = reply.statusCode;

  const formattedResponse: { success: boolean; data: any; messages: string[] } =
    {
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

interface CustomError extends Error {
  statusCode?: number;
  errors?: { message: string }[];
}

export function handleError(
  ex: CustomError,
  req: FastifyRequest,
  reply: FastifyReply
): void {
  const { statusCode, message, errors = [] } = ex;

  const errorResponse = {
    message:
      errors[0]?.message ||
      message ||
      "Ocorreu um erro inesperado. Por favor, tente novamente.",
  };

  reply.code(statusCode || 500).send(errorResponse);
}
