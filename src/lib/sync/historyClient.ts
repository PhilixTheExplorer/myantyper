import type { AccountProgressStore } from "@/lib/progress";
import { type HistoryEntry, isHistoryEntry } from "@/lib/progress/types";

const HISTORY_SYNC_BATCH_SIZE = 100;
const HISTORY_SYNC_PATH = "/api/sync/history";

interface UploadResponse {
  acknowledgedIds: string[];
}

interface PullResponse {
  entries: HistoryEntry[];
  nextCursor: string;
  hasMore: boolean;
}

export interface HistorySyncResult {
  uploaded: number;
  downloaded: number;
}

function isStringArray(value: unknown): value is string[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "string")
  );
}

function isCursor(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return false;
  return Number.isSafeInteger(Number(value));
}

function parseUploadResponse(value: unknown): UploadResponse {
  if (typeof value !== "object" || value === null) {
    throw new Error("The history sync server returned an invalid response.");
  }
  const acknowledgedIds = (value as Record<string, unknown>).acknowledgedIds;
  if (!isStringArray(acknowledgedIds)) {
    throw new Error("The history sync server returned an invalid response.");
  }
  return { acknowledgedIds };
}

function parsePullResponse(value: unknown): PullResponse {
  if (typeof value !== "object" || value === null) {
    throw new Error("The history sync server returned an invalid response.");
  }
  const response = value as Record<string, unknown>;
  if (
    !Array.isArray(response.entries) ||
    !response.entries.every(isHistoryEntry) ||
    !isCursor(response.nextCursor) ||
    typeof response.hasMore !== "boolean"
  ) {
    throw new Error("The history sync server returned an invalid response.");
  }
  return {
    entries: response.entries,
    nextCursor: response.nextCursor,
    hasMore: response.hasMore,
  };
}

async function responseJson(response: Response): Promise<unknown> {
  if (!response.ok) {
    throw new Error(`History sync failed with status ${response.status}.`);
  }
  return response.json();
}

export async function syncHistory(
  store: AccountProgressStore,
  fetcher: typeof fetch = fetch,
): Promise<HistorySyncResult> {
  let uploaded = 0;
  let downloaded = 0;

  while (true) {
    const pending = await store.listPendingUploads(HISTORY_SYNC_BATCH_SIZE);
    if (pending.length === 0) break;

    const response = await fetcher(HISTORY_SYNC_PATH, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ entries: pending }),
    });
    const { acknowledgedIds } = parseUploadResponse(
      await responseJson(response),
    );
    const pendingIds = new Set(pending.map((entry) => entry.id));
    const acknowledged = [...new Set(acknowledgedIds)].filter((id) =>
      pendingIds.has(id),
    );
    if (acknowledged.length === 0) {
      throw new Error("The history sync upload made no progress.");
    }
    await store.acknowledgeUploads(acknowledged);
    uploaded += acknowledged.length;
  }

  let cursor = await store.getPullCursor();
  while (true) {
    const response = await fetcher(
      `${HISTORY_SYNC_PATH}?cursor=${encodeURIComponent(cursor)}`,
      { method: "GET" },
    );
    const page = parsePullResponse(await responseJson(response));
    if (page.hasMore && BigInt(page.nextCursor) <= BigInt(cursor)) {
      throw new Error("The history sync pull made no progress.");
    }
    await store.mergeRemoteHistory(page.entries, page.nextCursor);
    downloaded += page.entries.length;
    cursor = page.nextCursor;
    if (!page.hasMore) break;
  }

  return { uploaded, downloaded };
}

export function createHistorySyncController(
  store: AccountProgressStore,
  fetcher: typeof fetch = fetch,
) {
  let current: Promise<HistorySyncResult> | null = null;
  let rerunRequested = false;
  return {
    synchronize(): Promise<HistorySyncResult> {
      if (current) {
        rerunRequested = true;
        return current;
      }

      current = (async () => {
        const total: HistorySyncResult = { uploaded: 0, downloaded: 0 };
        do {
          rerunRequested = false;
          const result = await syncHistory(store, fetcher);
          total.uploaded += result.uploaded;
          total.downloaded += result.downloaded;
        } while (rerunRequested);
        return total;
      })().finally(() => {
        current = null;
      });
      return current;
    },
  };
}
