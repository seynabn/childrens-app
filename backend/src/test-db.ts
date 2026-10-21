import { sql } from "./db";

try {
  const result = await sql`SELECT 1 AS connected`;
  console.log("Databasanslutningen fungerar:", result);
} catch (error) {
  console.error("Databasanslutningen misslyckades:", error);
  process.exitCode = 1;
} finally {
  await sql.end();
}
