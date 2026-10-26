
import type { FastifyInstance } from "fastify";
import * as handlers from "../handlers/play-sessions";

async function playSessionsRoutes(app: FastifyInstance) {
  // Starta en lekstund.
  app.route({
    method: "POST",
    url: "/",
    handler: handlers.createPlaySession,
  });

  // Avsluta en lekstund.
  app.route({
    method: "POST",
    url: "/:sessionId/end",
    handler: handlers.endPlaySession,
  });
}

export default playSessionsRoutes;
