
import type { FastifyPluginAsync } from "fastify";
import { generateSpeech } from "../services/elevenlabs";
import { requireElevenLabsVoiceId } from "../config";

const voiceRoutes: FastifyPluginAsync = async (app) => {
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
        app.log.error({ err: error }, "Röstgenerering misslyckades");

        return reply.code(502).send({
          error: "VOICE_GENERATION_FAILED",
          message: "Det gick inte att skapa ljud just nu.",
        });
      }
    },
  );
};

export default voiceRoutes;
