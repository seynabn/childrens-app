import { buildApp } from "./app";
import { parseEnv } from "./config/env";
import { createDatabase } from "./db/client";
import { createElevenLabsVoiceProvider } from "../services/elevenlabs";

export async function startServer(env: Record<string, string | undefined> = process.env) {
  const config = parseEnv(env);
  const database = createDatabase(config.postgres);
  const app = buildApp({ database, voice: createElevenLabsVoiceProvider(config.elevenLabs.apiKey), voiceId: config.elevenLabs.voiceId });
  let shuttingDown = false;
  const shutdown = async () => {
    if (shuttingDown) return;
    shuttingDown = true;
    await app.close();
    await database.close();
  };
  process.once("SIGINT", shutdown);
  process.once("SIGTERM", shutdown);
  try {
    await app.listen({ port: config.port, host: "0.0.0.0" });
  } catch (error) {
    await shutdown();
    throw error;
  }
  return { app, database, shutdown };
}
