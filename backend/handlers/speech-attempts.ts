import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";
import { handleUnexpectedError } from "../errors/error-handler";
import * as childServices from "../services/children";
import { isJwtError } from "../errors/jwt-errors";

// Vilka uppgifter appen måste skicka för ett talförsök.
type CreateSpeechAttemptBody = {
  childId: number;
  wordId: number;
  sessionId: number;
  attemptedText: string | null;
  recognitionStatus: "unprocessed" | "matched" | "uncertain" | "not_matched";
};

const validStatuses = ["unprocessed", "matched", "uncertain", "not_matched"];

// Tar emot och sparar ett talförsök.
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

  try {
    // 1. Kontrollera att användaren är inloggad.
    await request.jwtVerify();
    const user = request.user as { sub: string };

    // 2. Kontrollera att leksessionen finns och hör till rätt barn.
    const session = await services.getPlaySessionById(sessionId);

    if (!session || Number(session.child_id) !== childId) {
      return reply.code(404).send({
        error: "Lekstunden hittades inte.",
      });
    }

    // 3. Kontrollera att barnet tillhör den inloggade användaren.
    const child = await childServices.getChildByIdAndUserId(
      String(childId),
      user.sub,
    );

    if (!child) {
      return reply.code(404).send({
        error: "Barnprofilen hittades inte.",
      });
    }

    // 4. Spara först när kontrollerna har godkänts.
    const attempt = await services.createSpeechAttempt(
      childId,
      wordId,
      sessionId,
      attemptedText,
      recognitionStatus,
    );

    if (!attempt) {
      return reply.code(409).send({
        error: "Lekstunden är avslutad. Ett nytt talförsök kan inte sparas.",
      });
    }

    return reply.code(201).send({ attempt });
  } catch (error: unknown) {
    if (isJwtError(error)) {
      return reply.code(401).send({
        error: "Du måste vara inloggad.",
      });
    }

    return handleUnexpectedError(
      request,
      reply,
      error,
      "Talförsöket kunde inte sparas. Kontrollera att barn, ord och lekstund finns och hör ihop.",
      400,
    );
  }
}

// Parametern som kommer från URL:en.
type GetSpeechAttemptsParams = {
  sessionId: string;
};

// Hämtar talförsöken för en lekstund.
export async function getSpeechAttemptsBySession(
  request: FastifyRequest<{ Params: GetSpeechAttemptsParams }>,
  reply: FastifyReply,
) {
  try {
    // 1. Kontrollera att användaren är inloggad.
    await request.jwtVerify();

    const user = request.user as { sub: string };
    const sessionId = Number(request.params.sessionId);

    if (!Number.isInteger(sessionId) || sessionId <= 0) {
      return reply.code(400).send({
        error: "sessionId måste vara ett positivt heltal.",
      });
    }

    // 2. Hämta leksessionen.
    const session = await services.getPlaySessionById(sessionId);

    if (!session) {
      return reply.code(404).send({
        error: "Lekstunden hittades inte.",
      });
    }

    // 3. Kontrollera att barnet tillhör användaren.
    const child = await childServices.getChildByIdAndUserId(
      String(session.child_id),
      user.sub,
    );

    if (!child) {
      return reply.code(404).send({
        error: "Lekstunden hittades inte.",
      });
    }

    // 4. Hämta talförsöken först efter kontrollen.
    const attempts = await services.getSpeechAttemptsBySession(sessionId);

    return reply.code(200).send({ attempts });
  } catch (error: unknown) {
    if (isJwtError(error)) {
      return reply.code(401).send({
        error: "Du måste vara inloggad.",
      });
    }

    return handleUnexpectedError(
      request,
      reply,
      error,
      "Kunde inte hämta talförsöken.",
    );
  }
}
