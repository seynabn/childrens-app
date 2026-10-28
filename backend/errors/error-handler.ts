import type {
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { AppError } from "./app-error";

export function isJwtError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if (!("code" in error)) {
    return false;
  }

  return (
    typeof error.code === "string" &&
    error.code.startsWith("FST_JWT")
  );
}

export function handleUnexpectedError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: unknown,
  message: string,
  statusCode = 500,
) {
  request.log.error(error);

  return reply.code(statusCode).send({
    error: message,
  });
}

export function handleRouteError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: unknown,
  unexpectedMessage: string,
  unexpectedStatusCode = 500,
) {
  if (isJwtError(error)) {
    return reply.code(401).send({
      error: "Du måste vara inloggad.",
    });
  }

  if (error instanceof AppError) {
    return reply.code(error.statusCode).send({
      error: error.message,
    });
  }

  return handleUnexpectedError(
    request,
    reply,
    error,
    unexpectedMessage,
    unexpectedStatusCode,
  );
}