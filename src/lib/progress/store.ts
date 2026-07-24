import type { HistoryEntry, HistoryOverview, HistoryPage } from "./types";

/** Async so callers survive a store that cannot be synchronous. */
export interface ProgressStore {
  /** Reads a bounded newest-first window without materializing the full log. */
  listHistoryPage(offset: number, limit: number): Promise<HistoryPage>;
  /** Constant-size all-time rollups plus a bounded recent window. */
  getHistoryOverview(): Promise<HistoryOverview>;
  /** Idempotent by entry id. */
  appendHistory(entry: HistoryEntry): Promise<void>;
  /** Fires on changes from another browser context. Returns an unsubscribe. */
  subscribe(onChange: () => void): () => void;
}

export function progressErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Typing history could not be loaded.";
}
