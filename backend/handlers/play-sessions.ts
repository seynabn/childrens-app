
import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";

type CreatePlaySessionBody = {
  childId: number;
};

type EndPlaySessionParams = {
  sessionId: string;
};

type EndPlaySessionBody = {
  engagement: "engaged" | "mixed" | "lost_interest";
};

// Startar en lekstund.
export async function createPlaySession(
  request: FastifyRequest<{ Body: CreatePlaySessionBody }>,
  reply: FastifyReply,
) {
  const { childId } = request.body;

  if (!Number.isInteger(childId) || childId <= 0) {
    return reply.code(400).send({
      error: "childId måste vara ett positivt heltal.",
    });
  }

  const session = await services.createPlaySession(childId);

  return reply.code(201).send({ session });
}

// Avslutar en lekstund och sparar barnets engagemang.
export async function endPlaySession(
  request: FastifyRequest<{
    Params: EndPlaySessionParams;
    Body: EndPlaySessionBody;
  }>,
  reply: FastifyReply,
) {
  const sessionId = Number(request.params.sessionId);
  const { engagement } = request.body ?? {};

  if (!Number.isInteger(sessionId) || sessionId <= 0) {
    return reply.code(400).send({
      error: "sessionId måste vara ett positivt heltal.",
    });
  }

  const validEngagement = [
    "engaged",
    "mixed",
    "lost_interest",
  ].includes(engagement);

  if (!validEngagement) {
    return reply.code(400).send({
      error:
        "engagement måste vara engaged, mixed eller lost_interest.",
    });
  }

  const session = await services.endPlaySession(
    sessionId,
    engagement,
  );

  if (!session) {
    return reply.code(404).send({
      error: "Lekstunden hittades inte eller är redan avslutad.",
    });
  }

  return reply.code(200).send({ session });
}
