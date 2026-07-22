// Synchronous on purpose: theme and font must be readable before first paint,
// so an async store would show as a flash. History lives in `@/lib/progress`.

import {
  MYANMAR_FONTS,
  type MyanmarFontId,
  THEMES,
  type ThemeId,
} from "./themes";

const TWEAKS_KEY = "myantyper.tweaks";
const FREE_TYPE_DRAFT_KEY = "myantyper.free-type-draft";

const MAX_STORAGE_CHARACTERS = 1_000_000;
export const MAX_FREE_TYPE_CHARACTERS = 5_000;

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
