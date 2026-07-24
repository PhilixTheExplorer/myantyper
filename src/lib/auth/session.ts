import { getAuth } from "./server";

/** The signed-in user's id from request headers, or null when signed out. */
export async function authenticatedUserId(
  headers: Headers,
): Promise<string | null> {
  const session = await getAuth().api.getSession({ headers });
  return session?.user.id ?? null;
}
