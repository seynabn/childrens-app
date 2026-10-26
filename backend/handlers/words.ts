import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";

export async function getWords(
  _req: FastifyRequest,
  res: FastifyReply,
) {
  const words = await services.getWords();

  return res.status(200).send({ words });
}