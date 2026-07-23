export interface ServerEnvironment {
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

type EnvironmentSource = Record<string, string | undefined>;

function required(source: EnvironmentSource, key: keyof ServerEnvironment) {
  const value = source[key]?.trim();
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

function requireUrl(value: string, key: keyof ServerEnvironment): URL {
  try {
    return new URL(value);
  } catch {
    throw new Error(`${key} must be a valid URL.`);
  }
}

export function readServerEnvironment(
  source: EnvironmentSource = process.env,
): ServerEnvironment {
  const databaseUrl = required(source, "DATABASE_URL");
  const authSecret = required(source, "BETTER_AUTH_SECRET");
  const authUrl = required(source, "BETTER_AUTH_URL");

  const parsedDatabaseUrl = requireUrl(databaseUrl, "DATABASE_URL");
  if (!["postgres:", "postgresql:"].includes(parsedDatabaseUrl.protocol)) {
    throw new Error("DATABASE_URL must use the postgres or postgresql scheme.");
  }

  const parsedAuthUrl = requireUrl(authUrl, "BETTER_AUTH_URL");
  if (!["http:", "https:"].includes(parsedAuthUrl.protocol)) {
    throw new Error("BETTER_AUTH_URL must use the http or https scheme.");
  }

  if (authSecret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters.");
  }

  return {
    DATABASE_URL: databaseUrl,
    BETTER_AUTH_SECRET: authSecret,
    BETTER_AUTH_URL: parsedAuthUrl.origin,
    GOOGLE_CLIENT_ID: required(source, "GOOGLE_CLIENT_ID"),
    GOOGLE_CLIENT_SECRET: required(source, "GOOGLE_CLIENT_SECRET"),
  };
}
