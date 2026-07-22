import type { ProgressStore } from "./store";
import {
  HISTORY_SCHEMA_VERSION,
  type HistoryEntry,
  isHistoryEntry,
} from "./types";

export const HISTORY_STORAGE_KEY = "myantyper.history";
const MAX_STORAGE_CHARACTERS = 1_000_000;

interface HistoryEnvelope {
  version: number;
  entries: HistoryEntry[];
}

function newestFirst(entries: HistoryEntry[]): HistoryEntry[] {
  return entries
    .slice()
    .sort((a, b) => b.completedAt - a.completedAt || a.id.localeCompare(b.id));
}

function dedupeById(entries: HistoryEntry[]): HistoryEntry[] {
  const byId = new Map<string, HistoryEntry>();
  for (const entry of entries) {
    if (!byId.has(entry.id)) byId.set(entry.id, entry);
  }
  return [...byId.values()];
}

function normalize(entries: HistoryEntry[]): HistoryEntry[] {
  return dedupeById(newestFirst(entries));
}

function inspectStoredHistory(raw: string): HistoryEntry[] {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return [];
  }

  const envelope = parsed as Partial<HistoryEnvelope>;
  if (envelope.version !== HISTORY_SCHEMA_VERSION) return [];
  if (!Array.isArray(envelope.entries)) return [];
  return normalize(envelope.entries.filter(isHistoryEntry));
}

/** Invalid or unsupported stored values read as empty. */
export function parseStoredHistory(raw: string): HistoryEntry[] {
  return inspectStoredHistory(raw);
}

function readRaw(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
  if (!raw) return [];
  if (raw.length > MAX_STORAGE_CHARACTERS) {
    throw new Error(
      "Typing history is too large for this app version. It was left unchanged.",
    );
  }
  return inspectStoredHistory(raw);
}

function writeRaw(entries: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  const envelope: HistoryEnvelope = {
    version: HISTORY_SCHEMA_VERSION,
    entries,
  };
  const raw = JSON.stringify(envelope);
  if (raw.length > MAX_STORAGE_CHARACTERS) {
    throw new Error(
      "Typing history has reached this app version's local storage limit. Existing history was left unchanged.",
    );
  }
  localStorage.setItem(HISTORY_STORAGE_KEY, raw);
}

/** Serializes read-modify-write against other tabs where Web Locks exist. */
function withLock<T>(run: () => T): Promise<T> {
  if (typeof navigator !== "undefined" && "locks" in navigator) {
    return navigator.locks.request(HISTORY_STORAGE_KEY, async () => run());
  }
  return Promise.resolve().then(run);
}

export const localProgressStore: ProgressStore = {
  listHistory() {
    return withLock(readRaw);
  },

  appendHistory(entry: HistoryEntry) {
    return withLock(() => {
      if (!isHistoryEntry(entry)) {
        throw new TypeError("Refusing to store an invalid history entry.");
      }
      const next = normalize([entry, ...readRaw()]);
      writeRaw(next);
      return next;
    });
  },

  subscribe(onChange: () => void) {
    if (typeof window === "undefined") return () => {};
    const handle = (event: StorageEvent) => {
      if (event.key === HISTORY_STORAGE_KEY) onChange();
    };
    window.addEventListener("storage", handle);
    return () => window.removeEventListener("storage", handle);
  },
};
