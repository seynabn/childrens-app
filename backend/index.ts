import cors from "@fastify/cors";
import sql from "./db";
import Fastify from "fastify";
import rootRoutes from "./routes/root";
import healthRoutes from "./routes/health";
import voiceRoutes from "./routes/voice";
import storiesRoutes from "./routes/stories";
import wordsRoutes from "./routes/words";
import playSessionsRoutes from "./routes/play-sessions";
import speechAttemptsRoutes from "./routes/speech-attempts";
import usersRoutes from "./routes/users";
import jwt from "@fastify/jwt";
import childrenRoutes from "./routes/children";
import onboardingRoutes from "./routes/onboarding";

const app = Fastify({
  logger: true,
});
app.register(cors, {
  origin: [
    "http://localhost:8081",
    "http://127.0.0.1:8081",
    "http://localhost:19006",
    "http://127.0.0.1:19006",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error(
    "JWT_SECRET saknas eller är för kort. Kontrollera projektets .env-fil.",
  );
}

app.register(jwt, {
  secret: jwtSecret,
});


app.register(usersRoutes, { prefix: "/api/users" });
app.register(speechAttemptsRoutes, {
  prefix: "/api/speech-attempts",
});
app.register(playSessionsRoutes, { prefix: "/api/play-sessions" });
app.register(wordsRoutes, { prefix: "/api/words" });
app.register(rootRoutes);
app.register(healthRoutes);
app.register(voiceRoutes, { prefix: "/api/voice" });
app.register(storiesRoutes, { prefix: "/api/stories" });
app.register(childrenRoutes, { prefix: "/api/children" });
app.register(onboardingRoutes, { prefix: "/api/onboarding" });

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
