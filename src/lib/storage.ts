import {
  MYANMAR_FONTS,
  type MyanmarFontId,
  THEMES,
  type ThemeId,
} from "./themes";

export const HISTORY_STORAGE_KEY = "myantyper.history";
const TWEAKS_KEY = "myantyper.tweaks";
const FREE_TYPE_DRAFT_KEY = "myantyper.free-type-draft";

export const MAX_HISTORY_ENTRIES = 200;
const MAX_STORAGE_CHARACTERS = 1_000_000;
const MAX_TEXT_FIELD_LENGTH = 200;
export const MAX_FREE_TYPE_CHARACTERS = 5_000;
const LESSON_ID_PATTERN = /^(?:free|[a-z0-9]+(?:-[a-z0-9]+)*)$/;

export interface HistoryEntry {
  date: string;
  lessonId: string;
  title: string;
  wpm: number;
  accuracy: number;
  seconds: number;
  keystrokes: number;
}

function isHistoryEntry(v: unknown): v is HistoryEntry {
  if (typeof v !== "object" || v === null) return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.date === "string" &&
    e.date.length <= MAX_TEXT_FIELD_LENGTH &&
    !Number.isNaN(Date.parse(e.date)) &&
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

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    if (raw.length > MAX_STORAGE_CHARACTERS) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter(isHistoryEntry).slice(0, MAX_HISTORY_ENTRIES)
      : [];
  } catch {
    return [];
  }
}

export function saveHistory(rows: HistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(rows.slice(0, MAX_HISTORY_ENTRIES)),
    );
  } catch {}
}

export interface HistorySummary {
  sessions: number;
  bestWPM: number;
  avgWPM: number;
  avgAccuracy: number;
  totalMinutes: number;
}

export function summarizeHistory(history: HistoryEntry[]): HistorySummary {
  const n = history.length;
  if (n === 0) {
    return {
      sessions: 0,
      bestWPM: 0,
      avgWPM: 0,
      avgAccuracy: 0,
      totalMinutes: 0,
    };
  }
  const sum = (pick: (h: HistoryEntry) => number) =>
    history.reduce((acc, h) => acc + pick(h), 0);
  return {
    sessions: n,
    bestWPM: Math.max(...history.map((h) => h.wpm)),
    avgWPM: Math.round(sum((h) => h.wpm) / n),
    avgAccuracy: Math.round((sum((h) => h.accuracy) / n) * 10) / 10,
    totalMinutes: Math.round(sum((h) => h.seconds) / 60),
  };
}

export interface Tweaks {
  theme: ThemeId;
  myanmarFont: MyanmarFontId;
  accentIndex: number;
  sound: boolean;
}

export const DEFAULT_TWEAKS: Tweaks = {
  theme: "paper",
  myanmarFont: "masterpiece",
  accentIndex: 0,
  sound: true,
};

export function normalizeTweaks(v: unknown): Tweaks {
  if (typeof v !== "object" || v === null) return DEFAULT_TWEAKS;
  const raw = v as Record<string, unknown>;
  const theme =
    typeof raw.theme === "string" && raw.theme in THEMES
      ? (raw.theme as ThemeId)
      : DEFAULT_TWEAKS.theme;
  const myanmarFont =
    typeof raw.myanmarFont === "string" &&
    MYANMAR_FONTS.some((font) => font.id === raw.myanmarFont)
      ? (raw.myanmarFont as MyanmarFontId)
      : DEFAULT_TWEAKS.myanmarFont;
  const maxAccentIndex = THEMES[theme].accentPresets.length - 1;
  const accentIndex =
    typeof raw.accentIndex === "number" &&
    Number.isInteger(raw.accentIndex) &&
    raw.accentIndex >= 0 &&
    raw.accentIndex <= maxAccentIndex
      ? raw.accentIndex
      : DEFAULT_TWEAKS.accentIndex;

  return {
    theme,
    myanmarFont,
    accentIndex,
    sound: typeof raw.sound === "boolean" ? raw.sound : DEFAULT_TWEAKS.sound,
  };
}

export function loadTweaks(): Tweaks {
  if (typeof window === "undefined") return DEFAULT_TWEAKS;
  try {
    const raw = localStorage.getItem(TWEAKS_KEY);
    if (!raw) return DEFAULT_TWEAKS;
    if (raw.length > MAX_STORAGE_CHARACTERS) return DEFAULT_TWEAKS;
    return normalizeTweaks(JSON.parse(raw));
  } catch {
    return DEFAULT_TWEAKS;
  }
}

export function saveTweaks(t: Tweaks): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(TWEAKS_KEY, JSON.stringify(t));
  } catch {}
}

export function loadFreeTypeDraft(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const draft = localStorage.getItem(FREE_TYPE_DRAFT_KEY);
    return draft && Array.from(draft).length <= MAX_FREE_TYPE_CHARACTERS
      ? draft
      : null;
  } catch {
    return null;
  }
}

export function saveFreeTypeDraft(draft: string): void {
  if (typeof window === "undefined") return;
  if (Array.from(draft).length > MAX_FREE_TYPE_CHARACTERS) return;
  try {
    localStorage.setItem(FREE_TYPE_DRAFT_KEY, draft);
  } catch {}
}

export function clearFreeTypeDraft(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(FREE_TYPE_DRAFT_KEY);
  } catch {}
}
