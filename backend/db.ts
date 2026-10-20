
import postgres from "postgres";

const database = process.env.POSTGRES_DB;
const username = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;

if (!database || !username || !password) {
  throw new Error("Databasens miljövariabler saknas.");
}

const sql = postgres({
  host: "localhost",
  port: 5432,
  database,
  username,
  password,
});

export default sql;
