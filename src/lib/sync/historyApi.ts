import { type HistoryEntry, isHistoryEntry } from "@/lib/progress/types";

export const HISTORY_SYNC_PAGE_SIZE = 100;
export const HISTORY_SYNC_BATCH_SIZE = 100;
export const MAX_HISTORY_SYNC_BODY_BYTES = 128 * 1024;

export interface HistorySyncRow extends HistoryEntry {
  seq: number;
}

export interface HistorySyncRepository {
  upload(userId: string, entries: readonly HistoryEntry[]): Promise<void>;
  pull(
    userId: string,
    cursor: number,
    limit: number,
  ): Promise<readonly HistorySyncRow[]>;
}

interface HistorySyncDependencies {
  authenticatedUserId(headers: Headers): Promise<string | null>;
  repository: HistorySyncRepository;
  reportError?(operation: "pull" | "upload", error: unknown): void;
}

class HistorySyncRequestError extends Error {
  constructor(
    readonly status: 400 | 413 | 415,
    message: string,
  ) {
    super(message);
  }
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function parseCursor(request: Request): number {
  const cursor = new URL(request.url).searchParams.get("cursor") ?? "0";
  if (!/^\d+$/.test(cursor)) {
    throw new HistorySyncRequestError(400, "Invalid history cursor.");
  }

  const parsed = Number(cursor);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new HistorySyncRequestError(400, "Invalid history cursor.");
  }
  return parsed;
}

function copyHistoryEntry(entry: HistoryEntry): HistoryEntry {
  return {
    id: entry.id,
    schemaVersion: entry.schemaVersion,
    completedAt: entry.completedAt,
    lessonId: entry.lessonId,
    title: entry.title,
    wpm: entry.wpm,
    accuracy: entry.accuracy,
    seconds: entry.seconds,
    keystrokes: entry.keystrokes,
  };
}

async function readBoundedBody(request: Request): Promise<Uint8Array> {
  const reader = request.body?.getReader();
  if (!reader) return new Uint8Array();

  const chunks: Uint8Array[] = [];
  let byteLength = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      byteLength += value.byteLength;
      if (byteLength > MAX_HISTORY_SYNC_BODY_BYTES) {
        await reader.cancel().catch(() => {});
        throw new HistorySyncRequestError(413, "History upload is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const body = new Uint8Array(byteLength);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return body;
}

async function parseUpload(request: Request): Promise<HistoryEntry[]> {
  const contentType = request.headers.get("content-type") ?? "";
  const mediaType = contentType.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    throw new HistorySyncRequestError(415, "Expected a JSON request body.");
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (
    Number.isFinite(declaredLength) &&
    declaredLength > MAX_HISTORY_SYNC_BODY_BYTES
  ) {
    throw new HistorySyncRequestError(413, "History upload is too large.");
  }

  const encoded = await readBoundedBody(request);

  let body: unknown;
  try {
    body = JSON.parse(new TextDecoder().decode(encoded));
  } catch {
    throw new HistorySyncRequestError(400, "Invalid JSON request body.");
  }

  if (typeof body !== "object" || body === null) {
    throw new HistorySyncRequestError(400, "Invalid history upload.");
  }

  const entries = (body as Record<string, unknown>).entries;
  if (!Array.isArray(entries)) {
    throw new HistorySyncRequestError(400, "Invalid history upload.");
  }
  if (entries.length > HISTORY_SYNC_BATCH_SIZE) {
    throw new HistorySyncRequestError(413, "History upload is too large.");
  }

  const seenIds = new Set<string>();
  return entries.map((entry) => {
    if (!isHistoryEntry(entry) || seenIds.has(entry.id)) {
      throw new HistorySyncRequestError(400, "Invalid history entry.");
    }
    seenIds.add(entry.id);
    return copyHistoryEntry(entry);
  });
}

function requestError(error: unknown): Response | null {
  if (!(error instanceof HistorySyncRequestError)) return null;
  return json({ error: error.message }, error.status);
}

export function createHistorySyncHandlers({
  authenticatedUserId,
  repository,
  reportError,
}: HistorySyncDependencies) {
  return {
    async GET(request: Request): Promise<Response> {
      try {
        const userId = await authenticatedUserId(request.headers);
        if (!userId) return json({ error: "Unauthorized." }, 401);

        const cursor = parseCursor(request);
        const rows = await repository.pull(
          userId,
          cursor,
          HISTORY_SYNC_PAGE_SIZE + 1,
        );
        const hasMore = rows.length > HISTORY_SYNC_PAGE_SIZE;
        const page = rows.slice(0, HISTORY_SYNC_PAGE_SIZE);
        const nextCursor = page.length
          ? String(page[page.length - 1].seq)
          : String(cursor);
        const entries = page.map(({ seq: _seq, ...entry }) => entry);

        return json({ entries, nextCursor, hasMore });
      } catch (error) {
        const response = requestError(error);
        if (response) return response;
        reportError?.("pull", error);
        return json({ error: "History sync is currently unavailable." }, 500);
      }
    },

    async POST(request: Request): Promise<Response> {
      try {
        const userId = await authenticatedUserId(request.headers);
        if (!userId) return json({ error: "Unauthorized." }, 401);

        const entries = await parseUpload(request);
        await repository.upload(userId, entries);
        return json({ acknowledgedIds: entries.map((entry) => entry.id) });
      } catch (error) {
        const response = requestError(error);
        if (response) return response;
        reportError?.("upload", error);
        return json({ error: "History sync is currently unavailable." }, 500);
      }
    },
  };
}
