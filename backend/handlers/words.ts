import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";

export async function getWords(
  _req: FastifyRequest,
  res: FastifyReply,
) {
  const words = await services.getWords();

  return res.status(200).send({ words });
}

type WordParams = {
  wordId: string;
};

// Hämtar alternativa ord för ett visst ord.
export async function getWordChoices(
  request: FastifyRequest<{ Params: WordParams }>,
  reply: FastifyReply,
) {
  const { wordId } = request.params;

  // Kontrollera att ID är ett positivt heltal.
  if (!/^[1-9]\d*$/.test(wordId)) {
    return reply.code(400).send({
      error: "Ordets ID är ogiltigt.",
    });
  }

  const choices = await services.getWordChoices(wordId);

  // null betyder att grundordet inte finns.
  if (choices === null) {
    return reply.code(404).send({
      error: "Ordet hittades inte.",
    });
  }

  return reply.code(200).send({ choices });
}