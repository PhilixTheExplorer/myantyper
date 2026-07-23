import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { getDatabase } from "@/db";
import { authSchema } from "@/db/schema";
import { readServerEnvironment } from "@/lib/env/server";

export function createAuth() {
  const environment = readServerEnvironment();
  return betterAuth({
    appName: "MyanTyper",
    baseURL: environment.BETTER_AUTH_URL,
    secret: environment.BETTER_AUTH_SECRET,
    database: drizzleAdapter(getDatabase(), {
      provider: "pg",
      schema: authSchema,
    }),
    emailAndPassword: { enabled: false },
    socialProviders: {
      google: {
        clientId: environment.GOOGLE_CLIENT_ID,
        clientSecret: environment.GOOGLE_CLIENT_SECRET,
      },
    },
    trustedOrigins: [environment.BETTER_AUTH_URL],
  });
}

let auth: ReturnType<typeof createAuth> | null = null;

export function getAuth() {
  auth ??= createAuth();
  return auth;
}
