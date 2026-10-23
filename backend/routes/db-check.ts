import type { FastifyPluginAsync } from "fastify";
import type { Database } from "../src/db/client";

const dbCheckRoutes: FastifyPluginAsync<{ database: Database }> = async (app, { database }) => {
  app.get("/db-check", async (_request, reply) => {
    try {
      const result = await database.query<{ connected: number }>`SELECT 1 AS connected`;
      const firstRow = result[0];
      if (!firstRow) return reply.code(500).send({ status: "error", message: "Databasen returnerade inget resultat." });
      return { status: "ok", database: firstRow.connected };
    } catch (error) {
      app.log.error({ err: error }, "Databaskontrollen misslyckades");
      return reply.code(503).send({ status: "error", message: "Databasen är inte tillgänglig just nu." });
    }
  });
};

export default dbCheckRoutes;
