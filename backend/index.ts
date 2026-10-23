import sql from "./db";
import Fastify from "fastify";
import rootRoutes from "./routes/root";
import healthRoutes from "./routes/health";
import voiceRoutes from "./routes/voice";
import storiesRoutes from "./routes/stories";
import wordsRoutes from "./routes/words";
const app = Fastify({
  logger: true,
});

app.register(wordsRoutes, { prefix: "/api/words" });
app.register(rootRoutes);
app.register(healthRoutes);
app.register(voiceRoutes, { prefix: "/api/voice" });
app.register(storiesRoutes, { prefix: "/api/stories" });

app.get("/db-check", async (request, reply) => {
  const result = await sql`SELECT 1 AS connected`;
  const firstRow = result[0];

  if (!firstRow) {
    return reply.code(500).send({
      status: "error",
      message: "Databasen returnerade inget resultat.",
    });
  }

  return {
    status: "ok",
    database: firstRow.connected,
  };
});

const start = async () => {
  try {
    await app.listen({
      port: 3000,
      host: "0.0.0.0",
    });
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

start();
