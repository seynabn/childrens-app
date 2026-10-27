import type { FastifyInstance } from "fastify";
import * as handlers from "../handlers/users";

async function usersRoutes(app: FastifyInstance) {
  app.route({
    method: "POST",
    url: "/register",
    handler: handlers.registerUser,
  });
  app.route({
  method: "POST",
  url: "/login",
  handler: handlers.loginUser,
});
  app.route({
  method: "GET",
  url: "/me",
  handler: handlers.getCurrentUser,
});

}

export default usersRoutes;