import type { FastifyPluginAsync } from "fastify";
import type { Database } from "../src/db/client";

const wordsRoutes: FastifyPluginAsync<{ database: Database }> = async (
  app,
  { database },
) => {
  // GET: Hämta alla ord från databasen
  app.get("/", async () => {
    const words = await database.query`
      SELECT word_id, word, image, level, created_at
      FROM words
      ORDER BY level ASC, word ASC
    `;

    return { words };
  });
};

export default wordsRoutes;
