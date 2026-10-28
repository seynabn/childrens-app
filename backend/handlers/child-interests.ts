
import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";
import * as childServices from "../services/children";
import type { ChildInterestInput } from "../repository/child-interests";
import { allowedInterests } from "../repository/child-interests";
import { handleRouteError } from "../errors/error-handler";

type ChildParams = {
  childId: string;
};

type SaveInterestsBody = {
  interests: {
    interest: string;
    otherDescription?: string | null;
  }[];
};

// Kontrollerar inloggning och att barnets ID är giltigt.
async function getOwnedChild(
  request: FastifyRequest<{ Params: ChildParams }>,
  reply: FastifyReply,
) {
  await request.jwtVerify();

  const user = request.user as { sub: string };
  const { childId } = request.params;

  if (!/^[1-9]\d*$/.test(childId)) {
    reply.code(400).send({
      error: "Barnets ID är ogiltigt.",
    });
    return null;
  }

  const child = await childServices.getChildByIdAndUserId(
    childId,
    user.sub,
  );

  if (!child) {
    reply.code(404).send({
      error: "Barnprofilen hittades inte.",
    });
    return null;
  }

  return child;
}

// Hämtar intressen för ett barn som tillhör den inloggade användaren.
export async function getMyChildInterests(
  request: FastifyRequest<{ Params: ChildParams }>,
  reply: FastifyReply,
) {
  try {
    const child = await getOwnedChild(request, reply);

    if (!child) return;

    const interests = await services.getChildInterests(
      request.params.childId,
    );

    return reply.code(200).send({ interests });
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Kunde inte hämta barnets intressen.",
    );
  }
}

// Ersätter barnets intressen med den nya listan.
export async function saveMyChildInterests(
  request: FastifyRequest<{
    Params: ChildParams;
    Body: SaveInterestsBody;
  }>,
  reply: FastifyReply,
) {
  try {
    const child = await getOwnedChild(request, reply);

    if (!child) return;

    const body = request.body;

    if (
      !body ||
      !Array.isArray(body.interests) ||
      body.interests.length > allowedInterests.length
    ) {
      return reply.code(400).send({
        error: "Listan med intressen är ogiltig.",
      });
    }

    const cleanedInterests: ChildInterestInput[] = [];
    const seen = new Set<string>();

    for (const item of body.interests) {
      if (
        !item ||
        typeof item.interest !== "string" ||
        !allowedInterests.includes(
          item.interest as (typeof allowedInterests)[number],
        )
      ) {
        return reply.code(400).send({
          error: "Ett eller flera valda intressen är ogiltiga.",
        });
      }

      if (seen.has(item.interest)) {
        return reply.code(400).send({
          error: "Samma intresse kan inte väljas flera gånger.",
        });
      }

      seen.add(item.interest);

      if (
        item.otherDescription !== undefined &&
        item.otherDescription !== null &&
        typeof item.otherDescription !== "string"
      ) {
        return reply.code(400).send({
          error: "Beskrivningen av intresset måste vara text.",
        });
      }

      const description = item.otherDescription?.trim() ?? null;

      if (
        item.interest === "other" &&
        description !== null &&
        description.length > 100
      ) {
        return reply.code(400).send({
          error: "Beskrivningen får vara högst 100 tecken.",
        });
      }

      cleanedInterests.push({
        interest: item.interest as ChildInterestInput["interest"],
        otherDescription:
          item.interest === "other" ? description : null,
      });
    }

    const interests = await services.saveChildInterests(
      request.params.childId,
      cleanedInterests,
    );

    return reply.code(200).send({ interests });
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Kunde inte spara barnets intressen.",
    );
  }
}
