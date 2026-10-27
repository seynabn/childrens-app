
import type { FastifyInstance } from "fastify";
import * as handlers from "../handlers/children";

async function childrenRoutes(app: FastifyInstance) {
  // Hämta barnprofiler för den inloggade användaren.
  app.route({
    method: "GET",
    url: "/",
    handler: handlers.getMyChildren,
  });

  // Skapa en ny barnprofil.
  app.route({
    method: "POST",
    url: "/",
    handler: handlers.createMyChild,
  });

  // Hämta en specifik barnprofil.
  app.route({
    method: "GET",
    url: "/:childId",
    handler: handlers.getMyChild,
  });

  // Uppdatera smeknamnet på en barnprofil.
  app.route({
    method: "PATCH",
    url: "/:childId",
    handler: handlers.updateMyChild,
  });


  // Ta bort en barnprofil.
  app.route({
    method: "DELETE",
    url: "/:childId",
    handler: handlers.deleteMyChild,
  });


}
export default childrenRoutes;
