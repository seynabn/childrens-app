import sql from "./db";
import Fastify from "fastify";
import rootRoutes from "./routes/root";
import healthRoutes from "./routes/health";
import voiceRoutes from "./routes/voice";

const app = Fastify({
  logger: true,
});

app.register(rootRoutes);
app.register(healthRoutes);
app.register(voiceRoutes, { prefix: "/api/voice" });


app.get("/db-check", async () => {
  const result = await sql`SELECT 1 AS connected`;

  return {
    status: "ok",
    database: result[0].connected,
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

