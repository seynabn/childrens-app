import type { FastifyPluginAsync } from "fastify";

const rootRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", async () => {
    return {
      message: "Babbel backend fungerar!",
    };
  });
};

export default rootRoutes;
