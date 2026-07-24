import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { betterAuth } from "better-auth";
import { getDatabase } from "@/db";
import { authSchema } from "@/db/schema";
import { readServerEnvironment } from "@/lib/env/server";
import { revokeGoogleToken } from "./revokeGoogle";

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
    account: {
      encryptOAuthTokens: true,
    },
    emailAndPassword: { enabled: false },
    user: {
      deleteUser: {
        enabled: true,
        async beforeDelete(_user, request) {
          if (!request) return;

          try {
            const { accessToken } = await getAuth().api.getAccessToken({
              body: { providerId: "google" },
              headers: request.headers,
            });
            if (!(await revokeGoogleToken(accessToken))) {
              console.error("Google token revocation was not accepted.");
            }
          } catch (error) {
            const name = error instanceof Error ? error.name : "UnknownError";
            console.error(`Google token revocation failed (${name}).`);
          }
        },
      },
    },
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
