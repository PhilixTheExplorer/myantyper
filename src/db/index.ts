import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { readServerEnvironment } from "@/lib/env/server";
import { schema } from "./schema";

export function createDatabase(connectionString: string) {
  const client = neon(connectionString);
  return drizzle({ client, schema });
}

let database: ReturnType<typeof createDatabase> | null = null;

export function getDatabase() {
  database ??= createDatabase(readServerEnvironment().DATABASE_URL);
  return database;
}
