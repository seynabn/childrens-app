
import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";
import * as childServices from "../services/children";

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

  // 1. Kontrollera att användaren är inloggad.
  await request.jwtVerify();
  const user = request.user as { sub: string };

  // 2. Kontrollera att användaren äger barnprofilen.
  const child = await childServices.getChildByIdAndUserId(
    String(childId),
    user.sub,
  );

  if (!child) {
    return reply.code(404).send({
      error: "Barnprofilen hittades inte.",
    });
  }

  // 3. Skapa lekstunden först efter kontrollerna.
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

  // 1. Kontrollera att användaren är inloggad.
  await request.jwtVerify();
  const user = request.user as { sub: string };

  // 2. Hämta lekstunden innan vi försöker avsluta den.
  const existingSession = await services.getPlaySessionById(sessionId);

  if (!existingSession) {
    return reply.code(404).send({
      error: "Lekstunden hittades inte eller är redan avslutad.",
    });
  }

  // 3. Kontrollera att användaren äger barnprofilen.
  const child = await childServices.getChildByIdAndUserId(
    String(existingSession.child_id),
    user.sub,
  );

  if (!child) {
    return reply.code(404).send({
      error: "Lekstunden hittades inte eller är redan avslutad.",
    });
  }

  // 4. Avsluta lekstunden först efter kontrollerna.
  const session = await services.endPlaySession(
    sessionId,
    engagement as EndPlaySessionBody["engagement"],
  );

  if (!session) {
    return reply.code(404).send({
      error: "Lekstunden hittades inte eller är redan avslutad.",
    });
  }

  return reply.code(200).send({ session });
}
