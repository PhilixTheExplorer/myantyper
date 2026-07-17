import { describe, expect, it } from "vitest";
import { lessonStatsFromHistory } from "./lessonStats";
import type { HistoryEntry } from "./storage";

function entry(partial: Partial<HistoryEntry>): HistoryEntry {
  return {
    date: "2026-07-16T00:00:00.000Z",
    lessonId: "core-u01-a",
    title: "Drill 1",
    wpm: 20,
    accuracy: 95,
    seconds: 30,
    keystrokes: 50,
    ...partial,
  };
}

describe("lessonStatsFromHistory", () => {
  it("returns an empty map for empty history", () => {
    expect(lessonStatsFromHistory([]).size).toBe(0);
  });

  it("keeps the best WPM and accuracy while counting attempts per lesson", () => {
    const stats = lessonStatsFromHistory([
      entry({ lessonId: "a", wpm: 20, accuracy: 90 }),
      entry({ lessonId: "a", wpm: 35, accuracy: 85 }),
      entry({ lessonId: "a", wpm: 30, accuracy: 99 }),
      entry({ lessonId: "b", wpm: 10, accuracy: 100 }),
    ]);

    expect(stats.get("a")).toEqual({ best: 35, bestAcc: 99, attempts: 3 });
    expect(stats.get("b")).toEqual({ best: 10, bestAcc: 100, attempts: 1 });
  });
});
