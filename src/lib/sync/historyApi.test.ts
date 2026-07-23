import { describe, expect, it, vi } from "vitest";
import type { HistoryEntry } from "@/lib/progress/types";
import { createHistorySyncHandlers, type HistorySyncRow } from "./historyApi";

function entry(overrides: Partial<HistoryEntry> = {}): HistoryEntry {
  return {
    id: "session-1",
    schemaVersion: 1,
    completedAt: Date.UTC(2026, 0, 1),
    lessonId: "foundation-u01-key-r-ma",
    title: "Test lesson",
    wpm: 32,
    accuracy: 98,
    seconds: 45,
    keystrokes: 120,
    ...overrides,
  };
}

function setup(userId: string | null = "user-a") {
  const upload = vi.fn(
    async (_owner: string, _entries: readonly HistoryEntry[]) => {},
  );
  const pull = vi.fn(
    async (
      _owner: string,
      _cursor: number,
      _limit: number,
    ): Promise<readonly HistorySyncRow[]> => [],
  );
  const reportError = vi.fn();
  const handlers = createHistorySyncHandlers({
    authenticatedUserId: vi.fn(async () => userId),
    repository: { upload, pull },
    reportError,
  });
  return { ...handlers, upload, pull, reportError };
}

function uploadRequest(body: unknown, contentType = "application/json") {
  return new Request("http://localhost/api/sync/history", {
    method: "POST",
    headers: { "content-type": contentType },
    body: JSON.stringify(body),
  });
}

describe("history sync API", () => {
  it("rejects signed-out requests before accessing history", async () => {
    const { GET, pull } = setup(null);
    const response = await GET(
      new Request("http://localhost/api/sync/history?cursor=0"),
    );

    expect(response.status).toBe(401);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(pull).not.toHaveBeenCalled();
  });

  it("uploads validated entries under the authenticated owner", async () => {
    const { POST, upload } = setup("owner-1");
    const submitted = { ...entry(), userId: "another-user", seq: 999 };
    const response = await POST(uploadRequest({ entries: [submitted] }));

    expect(response.status).toBe(200);
    expect(upload).toHaveBeenCalledWith("owner-1", [entry()]);
    expect(await response.json()).toEqual({
      acknowledgedIds: ["session-1"],
    });
  });

  it("rejects invalid or duplicate upload entries", async () => {
    const { POST, upload } = setup();
    const response = await POST(uploadRequest({ entries: [entry(), entry()] }));

    expect(response.status).toBe(400);
    expect(upload).not.toHaveBeenCalled();
  });

  it("bounds upload count and encoded body size", async () => {
    const { POST } = setup();
    const tooMany = Array.from({ length: 101 }, (_, index) =>
      entry({ id: `session-${index}` }),
    );

    expect((await POST(uploadRequest({ entries: tooMany }))).status).toBe(413);
    expect(
      (
        await POST(
          uploadRequest({ entries: [], padding: "x".repeat(128 * 1024) }),
        )
      ).status,
    ).toBe(413);
  });

  it("cancels an oversized stream without a content-length header", async () => {
    const { POST } = setup();
    let cancelled = false;
    let pulls = 0;
    const body = new ReadableStream<Uint8Array>({
      pull(controller) {
        pulls += 1;
        controller.enqueue(new Uint8Array(70 * 1024));
      },
      cancel() {
        cancelled = true;
      },
    });
    const request = new Request("http://localhost/api/sync/history", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      duplex: "half",
    } as RequestInit & { duplex: "half" });

    const response = await POST(request);

    expect(response.status).toBe(413);
    expect(cancelled).toBe(true);
    expect(pulls).toBeLessThanOrEqual(3);
  });

  it.each(["-1", "1.2", "abc", "9007199254740992", ""])(
    "rejects the invalid cursor %j",
    async (cursor) => {
      const { GET, pull } = setup();
      const response = await GET(
        new Request(`http://localhost/api/sync/history?cursor=${cursor}`),
      );

      expect(response.status).toBe(400);
      expect(pull).not.toHaveBeenCalled();
    },
  );

  it("returns a bounded page without server ownership fields", async () => {
    const { GET, pull } = setup("owner-2");
    pull.mockResolvedValue(
      Array.from({ length: 101 }, (_, index) => ({
        ...entry({ id: `session-${index}` }),
        seq: index + 1,
      })),
    );

    const response = await GET(
      new Request("http://localhost/api/sync/history?cursor=0"),
    );
    const body = (await response.json()) as {
      entries: Array<HistoryEntry & { seq?: number; userId?: string }>;
      nextCursor: string;
      hasMore: boolean;
    };

    expect(pull).toHaveBeenCalledWith("owner-2", 0, 101);
    expect(body.entries).toHaveLength(100);
    expect(body.entries[0]).not.toHaveProperty("seq");
    expect(body.entries[0]).not.toHaveProperty("userId");
    expect(body.nextCursor).toBe("100");
    expect(body.hasMore).toBe(true);
  });

  it("preserves the cursor when a pull has no new entries", async () => {
    const { GET } = setup();
    const response = await GET(
      new Request("http://localhost/api/sync/history?cursor=42"),
    );

    expect(await response.json()).toEqual({
      entries: [],
      nextCursor: "42",
      hasMore: false,
    });
  });

  it("returns a generic error when storage fails", async () => {
    const { GET, pull, reportError } = setup();
    pull.mockRejectedValue(new Error("database details"));
    const response = await GET(
      new Request("http://localhost/api/sync/history"),
    );

    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({
      error: "History sync is currently unavailable.",
    });
    expect(reportError).toHaveBeenCalledOnce();
  });
});
