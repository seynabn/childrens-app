import type { FastifyInstance } from "fastify";
import * as controllers from "../handlers/words";

async function routes(app: FastifyInstance) {
  app.route({
  method: "GET",
  url: "/:wordId/choices",
  handler: controllers.getWordChoices,
});
}

export default routes;