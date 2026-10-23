import postgres from "postgres";
import type { AppConfig } from "../config/env";

export interface Database {
  query<T extends Record<string, unknown> = Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: any[]
  ): Promise<T[]>;
  close(): Promise<void>;
}

export function createDatabase(config: AppConfig["postgres"]): Database {
  const sql = postgres({ host: config.host, port: config.port, database: config.database, username: config.username, password: config.password });
  return {
    query: (strings, ...values) => sql(strings, ...values) as unknown as Promise<Record<string, unknown>[]>,
    close: () => sql.end(),
  } as Database;
}
