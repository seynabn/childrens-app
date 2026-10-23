import Fastify from "fastify";
import rootRoutes from "../routes/root";
import healthRoutes from "../routes/health";
import voiceRoutes from "../routes/voice";
import storiesRoutes from "../routes/stories";
import wordsRoutes from "../routes/words";
import dbCheckRoutes from "../routes/db-check";
import type { Database } from "./db/client";
import type { VoiceProvider } from "../services/elevenlabs";

export interface AppDependencies { database: Database; voice: VoiceProvider; voiceId: string }

export function buildApp(dependencies: AppDependencies) {
  const app = Fastify({ logger: true });
  app.register(rootRoutes);
  app.register(healthRoutes);
  app.register(voiceRoutes, { prefix: "/api/voice", voice: dependencies.voice, voiceId: dependencies.voiceId });
  app.register(storiesRoutes, { prefix: "/api/stories", database: dependencies.database });
  app.register(wordsRoutes, { prefix: "/api/words", database: dependencies.database });
  app.register(dbCheckRoutes, { database: dependencies.database });
  return app;
}
