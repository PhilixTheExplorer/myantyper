export const HISTORY_SCHEMA_VERSION = 1;

const MAX_TEXT_FIELD_LENGTH = 200;
const LESSON_ID_PATTERN = /^(?:free|[a-z0-9]+(?:-[a-z0-9]+)*)$/;
const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;
const MIN_COMPLETED_AT = Date.UTC(2020, 0, 1);
const MAX_COMPLETED_AT = Date.UTC(2100, 0, 1);

/**
 * Append-only and immutable, so `id` makes merging two devices a union by id.
 * `schemaVersion` is per entry because a synced log mixes client versions.
 */
export interface HistoryEntry {
  id: string;
  schemaVersion: number;
  /** Epoch milliseconds, UTC. */
  completedAt: number;
  lessonId: string;
  title: string;
  wpm: number;
  accuracy: number;
  seconds: number;
  keystrokes: number;
}

export type HistoryDraft = Omit<HistoryEntry, "schemaVersion">;

function isFiniteNumberInRange(
  value: unknown,
  minimum: number,
  maximum: number,
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
  );
}

export function isHistoryEntry(v: unknown): v is HistoryEntry {
  if (typeof v !== "object" || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.id === "string" &&
    ID_PATTERN.test(e.id) &&
    isFiniteNumberInRange(e.schemaVersion, 1, HISTORY_SCHEMA_VERSION) &&
    isFiniteNumberInRange(e.completedAt, MIN_COMPLETED_AT, MAX_COMPLETED_AT) &&
    typeof e.lessonId === "string" &&
    e.lessonId.length <= MAX_TEXT_FIELD_LENGTH &&
    LESSON_ID_PATTERN.test(e.lessonId) &&
    typeof e.title === "string" &&
    e.title.length <= MAX_TEXT_FIELD_LENGTH &&
    isFiniteNumberInRange(e.wpm, 0, 1_000) &&
    isFiniteNumberInRange(e.accuracy, 0, 100) &&
    isFiniteNumberInRange(e.seconds, 0, 86_400) &&
    isFiniteNumberInRange(e.keystrokes, 0, 1_000_000)
  );
}

export function stampEntry(draft: HistoryDraft): HistoryEntry {
  return { ...draft, schemaVersion: HISTORY_SCHEMA_VERSION };
}

export function newEntryId(): string {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    if (typeof crypto.getRandomValues === "function") {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    }
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
}

export interface HistorySummary {
  sessions: number;
  bestWPM: number;
  avgWPM: number;
  avgAccuracy: number;
  totalMinutes: number;
}

export interface LessonHistoryStat {
  best: number;
  bestAcc: number;
  attempts: number;
}

export interface HistoryOverview {
  summary: HistorySummary;
  lessonStats: Map<string, LessonHistoryStat>;
  /** Newest first, bounded by the store. */
  recent: HistoryEntry[];
}

export interface HistoryPage {
  entries: HistoryEntry[];
  total: number;
}

export function emptyHistoryOverview(): HistoryOverview {
  return {
    summary: {
      sessions: 0,
      bestWPM: 0,
      avgWPM: 0,
      avgAccuracy: 0,
      totalMinutes: 0,
    },
    lessonStats: new Map(),
    recent: [],
  };
}
