export interface AppConfig {
  port: number;
  postgres: { host: string; port: number; database: string; username: string; password: string };
  elevenLabs: { apiKey: string; voiceId: string };
}

type Environment = Record<string, string | undefined>;

function required(env: Environment, name: string): string {
  const value = env[name]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function parsePort(env: Environment, name: string, fallback: number): number {
  const raw = env[name]?.trim();
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 65_535) {
    throw new Error(`Invalid environment variable: ${name} must be a valid port`);
  }
  return value;
}

export function parseEnv(env: Environment): AppConfig {
  return {
    port: parsePort(env, "PORT", 3000),
    postgres: {
      host: env.POSTGRES_HOST?.trim() || "localhost",
      port: parsePort(env, "POSTGRES_PORT", 5432),
      database: required(env, "POSTGRES_DB"),
      username: required(env, "POSTGRES_USER"),
      password: required(env, "POSTGRES_PASSWORD"),
    },
    elevenLabs: {
      apiKey: required(env, "ELEVENLABS_API_KEY"),
      voiceId: required(env, "ELEVENLABS_VOICE_ID"),
    },
  };
}
