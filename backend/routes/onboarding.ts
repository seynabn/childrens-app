
import type { FastifyInstance } from "fastify";
import * as handlers from "../handlers/onboarding";

async function onboardingRoutes(app: FastifyInstance) {
  // Hämta onboarding-svaren för ett barn.
  app.route({
    method: "GET",
    url: "/:childId",
    handler: handlers.getMyOnboarding,
  });

  // Spara eller uppdatera onboarding-svaren för ett barn.
  app.route({
    method: "PUT",
    url: "/:childId",
    handler: handlers.saveMyOnboarding,
  });
}

export default onboardingRoutes;
