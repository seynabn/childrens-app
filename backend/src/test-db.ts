import { parseEnv } from "./config/env";
import { createDatabase } from "./db/client";

const database = createDatabase(parseEnv(process.env).postgres);

try {
  const result = await database.query`SELECT 1 AS connected`;
  console.log("Databasanslutningen fungerar:", result);
} catch (error) {
  console.error("Databasanslutningen misslyckades:", error);
  process.exitCode = 1;
} finally {
  await database.close();
}
