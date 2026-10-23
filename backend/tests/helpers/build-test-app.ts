import type { Database } from "../../src/db/client";
import type { VoiceProvider } from "../../services/elevenlabs";
import { buildApp } from "../../src/app";

export function createFakeVoiceProvider(): VoiceProvider {
  return {
    async generateSpeech() {
      return new ArrayBuffer(0);
    },
  };
}

export function createFakeDatabase(): Database {
  return {
    async query() {
      return [];
    },
    async close() {},
  };
}

export async function withTestApp(
  run: (app: ReturnType<typeof buildApp>) => Promise<void>,
): Promise<void> {
  const app = buildApp({
    database: createFakeDatabase(),
    voice: createFakeVoiceProvider(),
    voiceId: "test-voice-id",
  });

  try {
    await app.ready();
    await run(app);
  } finally {
    await app.close();
  }
}
