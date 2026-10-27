
import type { FastifyReply, FastifyRequest } from "fastify";

export function handleUnexpectedError(
  request: FastifyRequest,
  reply: FastifyReply,
  error: unknown,
  message: string,
  statusCode: number = 500,
) {
  request.log.error(error);

  return reply.code(statusCode).send({
    error: message,
  });
}

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
