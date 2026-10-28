
import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";
import { handleRouteError } from "../errors/error-handler";

type RegisterBody = {
  email: string;
  password: string;
};

// Tar emot och validerar registreringen.
export async function registerUser(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body ?? ({} as RegisterBody);

  if (typeof email !== "string" || typeof password !== "string") {
    return reply.code(400).send({
      error: "E-post och lösenord måste anges.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
  ) {
    return reply.code(400).send({
      error: "Ange en giltig e-postadress.",
    });
  }

  if (password.length < 12 || password.length > 128) {
    return reply.code(400).send({
      error: "Lösenordet måste vara mellan 12 och 128 tecken.",
    });
  }

  try {
    const user = await services.createUser(normalizedEmail, password);
    return reply.code(201).send({ user });
  } catch (error: unknown) {
    // PostgreSQL-felkod 23505 betyder att ett unikt värde redan finns.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return reply.code(409).send({
        error: "E-postadressen används redan.",
      });
    }

    return handleRouteError(
      request,
      reply,
      error,
      "Registreringen kunde inte genomföras.",
    );
  }
}

type LoginBody = {
  email: string;
  password: string;
};

// Tar emot och validerar en inloggningsförfrågan.
export async function loginUser(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply,
) {
  const { email, password } = request.body ?? ({} as LoginBody);

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return reply.code(400).send({
      error: "E-post och lösenord måste anges.",
    });
  }

  try {
    const user = await services.loginUser(
      email.trim().toLowerCase(),
      password,
    );

    if (!user) {
      return reply.code(401).send({
        error: "Fel e-postadress eller lösenord.",
      });
    }

    const token = await reply.jwtSign(
      {
        sub: String(user.user_id),
      },
      {
        expiresIn: "15m",
      },
    );

    return reply.code(200).send({
      user,
      token,
    });
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Inloggningen kunde inte genomföras.",
    );
  }
}

// Returnerar information om den inloggade användaren.
export async function getCurrentUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    // Kontrollerar att JWT-token är giltig.
    await request.jwtVerify();

    // Hämtar användarens ID från token.
    const payload = request.user as { sub: string };
    const user = await services.getUserById(payload.sub);

    if (!user) {
      return reply.code(404).send({
        error: "Användaren hittades inte.",
      });
    }

    return reply.code(200).send({ user });
  } catch (error: unknown) {
    return handleRouteError(
      request,
      reply,
      error,
      "Kunde inte hämta användaren.",
    );
  }
}
