import type { FastifyPluginAsync } from "fastify";
import { generateSpeech, VoiceGenerationError } from "../services/elevenlabs";
import { requireElevenLabsVoiceId } from "../config";

const voiceRoutes: FastifyPluginAsync = async (app) => {
  // Kontrollera att röst-API:t finns.
  app.get("/", async () => {
    return {
      status: "ok",
      message: "Babbel röst-API fungerar!",
      endpoints: {
        speak: "POST /api/voice/speak",
      },
    };
  });

  app.post<{ Body: { text: string } }>(
    "/speak",
    {
      schema: {
        body: {
          type: "object",
          required: ["text"],
          additionalProperties: false,
          properties: {
            text: { type: "string", minLength: 1, maxLength: 1000 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const audio = await generateSpeech(
          request.body.text,
          requireElevenLabsVoiceId(),
        );

        return reply
          .header("Content-Type", "audio/mpeg")
          .header("Cache-Control", "no-store")
          .send(Buffer.from(audio));
      } catch (error) {
        // Logga felkoden utan hela felobjektet.
        app.log.error(
          {
            errorCode:
              error instanceof VoiceGenerationError
                ? error.code
                : "UNEXPECTED_ERROR",
          },
          "Röstgenerering misslyckades",
        );

        // Kända fel får tydliga koder. Okända fel hålls generella.
        if (error instanceof VoiceGenerationError) {
          const messages: Record<string, string> = {
            VOICE_CONFIGURATION_ERROR:
              "Röstfunktionen är inte korrekt konfigurerad.",
            VOICE_PROVIDER_PAYMENT_REQUIRED:
              "Röstfunktionen är tillfälligt otillgänglig.",
            VOICE_PROVIDER_AUTH_FAILED: "Röstfunktionen kunde inte ansluta.",
            VOICE_PROVIDER_RATE_LIMITED:
              "För många försök. Vänta en stund och försök igen.",
            VOICE_PROVIDER_UNAVAILABLE: "Rösten är tillfälligt otillgänglig.",
            VOICE_PROVIDER_REJECTED_REQUEST:
              "Texten kunde inte omvandlas till ljud.",
            VOICE_GENERATION_TIMEOUT: "Det tog för lång tid att skapa ljudet.",
            VOICE_GENERATION_FAILED: "Det gick inte att skapa ljud just nu.",
          };

          return reply.code(error.statusCode).send({
            error: error.code,
            message:
              messages[error.code] ?? "Det gick inte att skapa ljud just nu.",
          });
        }

        return reply.code(500).send({
          error: "VOICE_GENERATION_FAILED",
          message: "Det gick inte att skapa ljud just nu.",
        });
      }
    },
  );
};

export default voiceRoutes;
