import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";

type CreateSpeechAttemptBody = {
  childId: number;
  wordId: number;
  sessionId: number;
  attemptedText: string | null;
  recognitionStatus: "unprocessed" | "matched" | "uncertain" | "not_matched";
};

const validStatuses = ["unprocessed", "matched", "uncertain", "not_matched"];

// Tar emot ett talförsök från appen.
export async function createSpeechAttempt(
  request: FastifyRequest<{ Body: CreateSpeechAttemptBody }>,
  reply: FastifyReply,
) {
  const { childId, wordId, sessionId, attemptedText, recognitionStatus } =
    request.body ?? {};

  if (
    !Number.isInteger(childId) ||
    childId <= 0 ||
    !Number.isInteger(wordId) ||
    wordId <= 0 ||
    !Number.isInteger(sessionId) ||
    sessionId <= 0
  ) {
    return reply.code(400).send({
      error: "childId, wordId och sessionId måste vara positiva heltal.",
    });
  }

  if (attemptedText !== null && typeof attemptedText !== "string") {
    return reply.code(400).send({
      error: "attemptedText måste vara text eller null.",
    });
  }

  if (
    typeof recognitionStatus !== "string" ||
    !validStatuses.includes(recognitionStatus)
  ) {
    return reply.code(400).send({
      error: "Ogiltig recognitionStatus.",
    });
  }

  const attempt = await services.createSpeechAttempt(
    childId,
    wordId,
    sessionId,
    attemptedText,
    recognitionStatus,
  );

  return reply.code(201).send({ attempt });
}

type GetSpeechAttemptsParams = {
  sessionId: string;
};

export async function getSpeechAttemptsBySession(
  request: FastifyRequest<{ Params: GetSpeechAttemptsParams }>,
  reply: FastifyReply,
) {
  const sessionId = Number(request.params.sessionId);

  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return reply.code(400).send({
      error: "sessionId måste vara ett positivt heltal.",
    });
  }

  const attempts = await services.getSpeechAttemptsBySession(sessionId);

  return reply.code(200).send({ attempts });
}
