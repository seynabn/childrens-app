import { describe, expect, test } from "bun:test";
import { withTestApp } from "../helpers/build-test-app";

describe("HTTP basics", () => {
  test("GET / returns the backend message", async () => {
    await withTestApp(async (app) => {
      const response = await app.inject({ method: "GET", url: "/" });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ message: "Babbel backend fungerar!" });
    });
  });

  test("GET /health reports a healthy service", async () => {
    await withTestApp(async (app) => {
      const response = await app.inject({ method: "GET", url: "/health" });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({
        status: "ok",
        service: "babbel-backend",
      });
    });
  });
});
