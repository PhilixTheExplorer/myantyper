import { describe, expect, it } from "vitest";
import { readServerEnvironment } from "./server";

const validEnvironment = {
  DATABASE_URL: "postgresql://user:password@example.com/myantyper",
  BETTER_AUTH_SECRET: "a-secure-test-secret-with-32-characters",
  BETTER_AUTH_URL: "https://myantyper.com/path-is-ignored",
  GOOGLE_CLIENT_ID: "google-client-id",
  GOOGLE_CLIENT_SECRET: "google-client-secret",
};

describe("readServerEnvironment", () => {
  it("returns validated account configuration", () => {
    expect(readServerEnvironment(validEnvironment)).toEqual({
      ...validEnvironment,
      BETTER_AUTH_URL: "https://myantyper.com",
    });
  });

  it("reports a missing variable without exposing other values", () => {
    expect(() =>
      readServerEnvironment({
        ...validEnvironment,
        GOOGLE_CLIENT_SECRET: "",
      }),
    ).toThrow("Missing required environment variable: GOOGLE_CLIENT_SECRET");
  });

  it("requires a sufficiently long auth secret", () => {
    expect(() =>
      readServerEnvironment({
        ...validEnvironment,
        BETTER_AUTH_SECRET: "too-short",
      }),
    ).toThrow("at least 32 characters");
  });

  it("rejects non-Postgres database URLs", () => {
    expect(() =>
      readServerEnvironment({
        ...validEnvironment,
        DATABASE_URL: "https://example.com/database",
      }),
    ).toThrow("postgres or postgresql scheme");
  });
});
