import { describe, expect, it, vi } from "vitest";
import type { AccountProgressStore } from "@/lib/progress";
import { emptyHistoryOverview, type HistoryEntry } from "@/lib/progress/types";
import { createHistorySyncController, syncHistory } from "./historyClient";

function entry(id: string): HistoryEntry {
  return {
    id,
    schemaVersion: 1,
    completedAt: Date.UTC(2026, 6, 23),
    lessonId: "foundation-u01-key-r-ma",
    title: "Test lesson",
    wpm: 32,
    accuracy: 98,
    seconds: 45,
    keystrokes: 120,
  };
}

function createStore(overrides: Partial<AccountProgressStore> = {}) {
  return {
    listHistoryPage: vi.fn(async () => ({ entries: [], total: 0 })),
    getHistoryOverview: vi.fn(async () => emptyHistoryOverview()),
    appendHistory: vi.fn(async () => {}),
    subscribe: vi.fn(() => () => {}),
    close: vi.fn(async () => {}),
    importAnonymousHistory: vi.fn(async () => 0),
    listPendingUploads: vi.fn(async () => []),
    acknowledgeUploads: vi.fn(async () => {}),
    getPullCursor: vi.fn(async () => "0"),
    mergeRemoteHistory: vi.fn(async () => {}),
    ...overrides,
  } satisfies AccountProgressStore;
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

describe("history client sync", () => {
  it("uploads pending entries before pulling remote history", async () => {
    const local = entry("local");
    const remote = entry("remote");
    const store = createStore({
      listPendingUploads: vi
        .fn()
        .mockResolvedValueOnce([local])
        .mockResolvedValueOnce([]),
    });
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(json({ acknowledgedIds: ["local"] }))
      .mockResolvedValueOnce(
        json({ entries: [remote], nextCursor: "4", hasMore: false }),
      );

    await expect(syncHistory(store, fetcher)).resolves.toEqual({
      uploaded: 1,
      downloaded: 1,
    });
    expect(store.acknowledgeUploads).toHaveBeenCalledWith(["local"]);
    expect(store.mergeRemoteHistory).toHaveBeenCalledWith([remote], "4");
    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      "/api/sync/history",
      "/api/sync/history?cursor=0",
    ]);
  });

  it("pulls every page and continues from the stored cursor", async () => {
    const first = entry("first");
    const second = entry("second");
    const store = createStore({ getPullCursor: vi.fn(async () => "8") });
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        json({ entries: [first], nextCursor: "9", hasMore: true }),
      )
      .mockResolvedValueOnce(
        json({ entries: [second], nextCursor: "10", hasMore: false }),
      );

    await syncHistory(store, fetcher);

    expect(fetcher.mock.calls.map(([url]) => url)).toEqual([
      "/api/sync/history?cursor=8",
      "/api/sync/history?cursor=9",
    ]);
    expect(store.mergeRemoteHistory).toHaveBeenNthCalledWith(1, [first], "9");
    expect(store.mergeRemoteHistory).toHaveBeenNthCalledWith(2, [second], "10");
  });

  it("leaves an upload pending when the network fails", async () => {
    const store = createStore({
      listPendingUploads: vi.fn(async () => [entry("local")]),
    });
    const fetcher = vi
      .fn<typeof fetch>()
      .mockRejectedValue(new TypeError("offline"));

    await expect(syncHistory(store, fetcher)).rejects.toThrow("offline");
    expect(store.acknowledgeUploads).not.toHaveBeenCalled();
  });

  it("rejects a response that cannot advance upload or pull progress", async () => {
    const uploadStore = createStore({
      listPendingUploads: vi.fn(async () => [entry("local")]),
    });
    const emptyAcknowledgement = vi
      .fn<typeof fetch>()
      .mockResolvedValue(json({ acknowledgedIds: [] }));

    await expect(
      syncHistory(uploadStore, emptyAcknowledgement),
    ).rejects.toThrow("upload made no progress");

    const pullStore = createStore({ getPullCursor: vi.fn(async () => "5") });
    const stalledPage = vi
      .fn<typeof fetch>()
      .mockResolvedValue(json({ entries: [], nextCursor: "5", hasMore: true }));
    await expect(syncHistory(pullStore, stalledPage)).rejects.toThrow(
      "pull made no progress",
    );
  });

  it("coalesces concurrent triggers and reruns after in-flight work", async () => {
    const store = createStore();
    const releases: Array<(response: Response) => void> = [];
    const fetcher = vi.fn<typeof fetch>(
      () =>
        new Promise<Response>((resolve) => {
          releases.push(resolve);
        }),
    );
    const controller = createHistorySyncController(store, fetcher);

    const first = controller.synchronize();
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledOnce());
    const second = controller.synchronize();
    expect(first).toBe(second);

    releases.shift()?.(json({ entries: [], nextCursor: "0", hasMore: false }));
    await vi.waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
    releases.shift()?.(json({ entries: [], nextCursor: "0", hasMore: false }));
    await first;
  });
});
