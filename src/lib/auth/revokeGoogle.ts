const GOOGLE_REVOKE_URL = "https://oauth2.googleapis.com/revoke";

export async function revokeGoogleToken(
  token: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  if (!token) return false;

  const response = await fetcher(GOOGLE_REVOKE_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token }),
  });
  return response.ok;
}
