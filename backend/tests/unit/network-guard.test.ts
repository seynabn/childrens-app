import { expect, test } from "bun:test";

test("default tests cannot use fetch", async () => {
  await expect(fetch("https://api.elevenlabs.io/v1/voices")).rejects.toThrow(
    "Network access is disabled in deterministic automated tests",
  );
});
