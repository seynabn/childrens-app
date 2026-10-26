import type { FastifyInstance } from "fastify";
import * as controllers from "../handlers/words";

async function routes(app: FastifyInstance) {
  app.route({
    method: "GET",
    url: "/",
    handler: controllers.getWords,
  });
}

export default routes;