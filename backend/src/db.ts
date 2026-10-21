import postgres from "postgres";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL saknas i miljön.");
}

export const sql = postgres(databaseUrl, {
  max: 10,
  connect_timeout: 10,
});