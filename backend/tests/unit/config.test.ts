import { describe, expect, test } from "bun:test";
import { parseEnv } from "../../src/config/env";

describe("configuration", () => {
  test("fails before startup when required configuration is missing", () => {
    expect(() => parseEnv({})).toThrow(
      "Missing required environment variable: POSTGRES_DB",
    );
  });
});
