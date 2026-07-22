import type { HistoryEntry } from "./types";

/** Async so callers survive a store that cannot be synchronous. */
export interface ProgressStore {
  /** Newest first. */
  listHistory(): Promise<HistoryEntry[]>;
  /** Idempotent by entry id. Resolves to the resulting log, newest first. */
  appendHistory(entry: HistoryEntry): Promise<HistoryEntry[]>;
  /** Fires on changes from other tabs. Returns an unsubscribe. */
  subscribe(onChange: () => void): () => void;
}

export function progressErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Typing history could not be loaded.";
}
