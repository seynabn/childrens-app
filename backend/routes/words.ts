import type { FastifyPluginAsync } from "fastify";
import sql from "../db";

const wordsRoutes: FastifyPluginAsync = async (app) => {
  // GET: Hämta alla ord från databasen
  app.get("/", async () => {
    const words = await sql`
      SELECT word_id, word, image, level, created_at
      FROM words
      ORDER BY level ASC, word ASC
    `;

    return { words };
  });
};

export default wordsRoutes;
