import { describe, expect, it, vi } from "vitest";
import { revokeGoogleToken } from "./revokeGoogle";

describe("Google token revocation", () => {
  it("posts the token to Google's revocation endpoint", async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 200 }));

    await expect(revokeGoogleToken("secret-token", fetcher)).resolves.toBe(
      true,
    );
    expect(fetcher).toHaveBeenCalledWith(
      "https://oauth2.googleapis.com/revoke",
      expect.objectContaining({
        method: "POST",
        body: new URLSearchParams({ token: "secret-token" }),
      }),
    );
  });

  it("reports a rejected revocation response", async () => {
    const fetcher = vi.fn(async () => new Response(null, { status: 400 }));
    await expect(revokeGoogleToken("expired-token", fetcher)).resolves.toBe(
      false,
    );
  });
});
