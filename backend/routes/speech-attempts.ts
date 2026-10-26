import type { FastifyInstance } from "fastify";
import * as handlers from "../handlers/speech-attempts";

async function speechAttemptsRoutes(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/",
    handler: handlers.createSpeechAttempt,
  });

  app.route({
    method: "GET",
    url: "/session/:sessionId",
    handler: handlers.getSpeechAttemptsBySession,
  });
}

export default speechAttemptsRoutes;
