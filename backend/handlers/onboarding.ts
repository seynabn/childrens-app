import type { FastifyReply, FastifyRequest } from "fastify";
import * as services from "../services";
import * as childServices from "../services/children";
import { isJwtError } from "../errors/jwt-errors";
import { handleUnexpectedError } from "../errors/error-handler";

type ChildParams = {
  childId: string;
};

type SaveOnboardingBody = {
  canYourChildSpeak: "not_yet" | "some" | "many";
  combinesWords: "not_yet" | "sometimes" | "often" | null;
  swedishExposure:
    | "mostly_swedish"
    | "several_languages"
    | "some_swedish"
    | "little_swedish"
    | null;
  otherLanguages: string[];
  communicationModes: string[];
};

const allowedInterests = [
  "animals",
  "vehicles",
  "music",
  "books_stories",
  "food",
  "water_bathing",
  "nature",
  "other",
];


export async function getMyOnboarding(
  request: FastifyRequest<{ Params: ChildParams }>,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();

    const user = request.user as { sub: string };
    const { childId } = request.params;

    if (!/^[1-9]\d*$/.test(childId)) {
      return reply.code(400).send({
        error: "Barnets ID är ogiltigt.",
      });
    }

    const child = await childServices.getChildByIdAndUserId(
      childId,
      user.sub,
    );

    if (!child) {
      return reply.code(404).send({
        error: "Barnprofilen hittades inte.",
      });
    }

    const onboarding = await services.getOnboardingByChildId(childId);

    return reply.code(200).send({ onboarding });
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
      "Kunde inte hämta onboarding-svaren.",
    );
  }
}



export async function saveMyOnboarding(
  request: FastifyRequest<{
    Params: ChildParams;
    Body: SaveOnboardingBody;
  }>,
  reply: FastifyReply,
) {
  try {
    await request.jwtVerify();

    const user = request.user as { sub: string };
    const { childId } = request.params;
    const body = request.body;

    if (!/^[1-9]\d*$/.test(childId)) {
      return reply.code(400).send({
        error: "Barnets ID är ogiltigt.",
      });
    }

    const child = await childServices.getChildByIdAndUserId(
      childId,
      user.sub,
    );

    if (!child) {
      return reply.code(404).send({
        error: "Barnprofilen hittades inte.",
      });
    }

    const speakOptions = ["not_yet", "some", "many"];
    const combineOptions = ["not_yet", "sometimes", "often"];
    const exposureOptions = [
      "mostly_swedish",
      "several_languages",
      "some_swedish",
      "little_swedish",
    ];

    if (!speakOptions.includes(body.canYourChildSpeak)) {
      return reply.code(400).send({
        error: "Ogiltigt svar för barnets tal.",
      });
    }

    if (
      body.canYourChildSpeak === "not_yet" &&
      body.combinesWords !== null
    ) {
      return reply.code(400).send({
        error: "Kombinerar ord ska vara null om barnet ännu inte pratar.",
      });
    }

    if (
      body.canYourChildSpeak !== "not_yet" &&
      !combineOptions.includes(body.combinesWords ?? "")
    ) {
      return reply.code(400).send({
        error: "Ogiltigt svar för kombination av ord.",
      });
    }

    if (
      body.swedishExposure !== null &&
      !exposureOptions.includes(body.swedishExposure)
    ) {
      return reply.code(400).send({
        error: "Ogiltigt svar för svensk exponering.",
      });
    }

    if (
      !Array.isArray(body.otherLanguages) ||
      !body.otherLanguages.every(
        (language) =>
          typeof language === "string" &&
          language.trim().length > 0 &&
          language.length <= 50,
      )
    ) {
      return reply.code(400).send({
        error: "Språklistan är ogiltig.",
      });
    }

    if (
      !Array.isArray(body.communicationModes) ||
      !body.communicationModes.every(
        (mode) =>
          typeof mode === "string" && mode.trim().length > 0,
      )
    ) {
      return reply.code(400).send({
        error: "Kommunikationssätten är ogiltiga.",
      });
    }

    if (body.communicationModes.length > 20) {
      return reply.code(400).send({
        error: "För många kommunikationssätt har valts.",
      });
    }

    // Rensa textvärden innan de sparas.
    const answers = {
      canYourChildSpeak: body.canYourChildSpeak,
      combinesWords:
        body.canYourChildSpeak === "not_yet"
          ? null
          : body.combinesWords,
      swedishExposure: body.swedishExposure,
      otherLanguages: body.otherLanguages.map((language) =>
        language.trim(),
      ),
      communicationModes: body.communicationModes.map((mode) =>
        mode.trim(),
      ),
    };

    const onboarding = await services.saveOnboardingByChildId(
      childId,
      answers,
    );

    return reply.code(200).send({ onboarding });
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
      "Kunde inte spara onboarding-svaren.",
    );
  }
}
