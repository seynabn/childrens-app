import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";
import { handleRouteError } from "../errors/error-handler";

// Hämtar barnprofiler för den inloggade användaren.
export async function getMyChildren(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();

    const user = request.user as { sub: string };
    const children = await services.getChildrenByUserId(user.sub);

    return reply.code(200).send(children);
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Kunde inte hämta barnprofilerna.",
    );
  }
}

type CreateChildBody = {
  nickname?: string | null;
  birthMonth: number;
  birthYear: number;
};

export async function createMyChild(
  request: FastifyRequest<{ Body: CreateChildBody }>,
  reply: FastifyReply,
) {
  try {
    // Kontrollera att föräldern är inloggad.
    await request.jwtVerify();

    const payload = request.user as { sub: string };
    const { nickname, birthMonth, birthYear } = request.body;

    // Kontrollera födelsemånad.
    if (!Number.isInteger(birthMonth) || birthMonth < 1 || birthMonth > 12) {
      return reply.code(400).send({
        error: "Födelsemånaden måste vara ett tal mellan 1 och 12.",
      });
    }

    // Kontrollera födelseår.
    if (
      !Number.isInteger(birthYear) ||
      birthYear < 1900 ||
      birthYear > new Date().getFullYear()
    ) {
      return reply.code(400).send({
        error: "Födelseåret är ogiltigt.",
      });
    }

    // Smeknamnet är frivilligt.
    let cleanNickname: string | null = null;

    if (nickname !== undefined && nickname !== null) {
      if (typeof nickname !== "string") {
        return reply.code(400).send({
          error: "Namnet måste vara text.",
        });
      }

      cleanNickname = nickname.trim();

      if (cleanNickname.length > 50) {
        return reply.code(400).send({
          error: "Namnet får vara högst 50 tecken.",
        });
      }

      if (cleanNickname === "") {
        cleanNickname = null;
      }
    }

    // Skapa barnprofilen.
    const child = await services.createChild(
      payload.sub,
      cleanNickname,
      birthMonth,
      birthYear,
    );

    return reply.code(201).send({ child });
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Kunde inte skapa barnprofilen.",
    );
  }
}

export async function getMyChild(
  request: FastifyRequest<{ Params: { childId: string } }>,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();

    const payload = request.user as { sub: string };
    const { childId } = request.params;

    if (!/^[1-9]\d*$/.test(childId)) {
      return reply.code(400).send({
        error: "Barnets ID är ogiltigt.",
      });
    }

    const child = await services.getChildByIdAndUserId(childId, payload.sub);

    if (!child) {
      return reply.code(404).send({
        error: "Barnprofilen hittades inte.",
      });
    }

    return reply.code(200).send({ child });
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Kunde inte hämta barnprofilen.",
    );
  }
}

type UpdateChildBody = {
  nickname: string | null;
};

export async function updateMyChild(
  request: FastifyRequest<{
    Params: { childId: string };
    Body: UpdateChildBody;
  }>,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();

    const payload = request.user as { sub: string };
    const { childId } = request.params;
    const { nickname } = request.body;

    if (!/^[1-9]\d*$/.test(childId)) {
      return reply.code(400).send({
        error: "Barnets ID är ogiltigt.",
      });
    }

    if (nickname !== null && typeof nickname !== "string") {
      return reply.code(400).send({
        error: "Namnet måste vara text eller null.",
      });
    }

    const cleanNickname = typeof nickname === "string" ? nickname.trim() : null;

    if (cleanNickname !== null && cleanNickname.length > 50) {
      return reply.code(400).send({
        error: "Namnet får vara högst 50 tecken.",
      });
    }

    const child = await services.updateChildByIdAndUserId(
      childId,
      payload.sub,
      cleanNickname === "" ? null : cleanNickname,
    );

    if (!child) {
      return reply.code(404).send({
        error: "Barnprofilen hittades inte.",
      });
    }

    return reply.code(200).send({ child });
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Kunde inte uppdatera barnprofilen.",
    );
  }
}

export async function deleteMyChild(
  request: FastifyRequest<{ Params: { childId: string } }>,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();

    const payload = request.user as { sub: string };
    const { childId } = request.params;

    if (!/^[1-9]\d*$/.test(childId)) {
      return reply.code(400).send({
        error: "Barnets ID är ogiltigt.",
      });
    }

    const child = await services.deleteChildByIdAndUserId(childId, payload.sub);

    if (!child) {
      return reply.code(404).send({
        error: "Barnprofilen hittades inte.",
      });
    }

    return reply.code(200).send({
      message: "Barnprofilen har tagits bort.",
      child,
    });
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Kunde inte ta bort barnprofilen.",
    );
  }
}
