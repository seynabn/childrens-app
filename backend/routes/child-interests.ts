import type { FastifyInstance } from "fastify";
import * as handlers from "../handlers/child-interests";

async function childInterestsRoutes(app: FastifyInstance) {
  // Hämta intressen för ett barn.
  app.route({
    method: "GET",
    url: "/:childId/interests",
    handler: handlers.getMyChildInterests,
  });

  // Ersätt barnets valda intressen.
  app.route({
    method: "PUT",
    url: "/:childId/interests",
    handler: handlers.saveMyChildInterests,
  });
}

export default childInterestsRoutes;
