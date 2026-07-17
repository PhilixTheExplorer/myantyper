import type { HistoryEntry } from "./storage";

export interface LessonStat {
  best: number;
  bestAcc: number;
  attempts: number;
}

export function lessonStatsFromHistory(
  history: readonly HistoryEntry[],
): Map<string, LessonStat> {
  const result = new Map<string, LessonStat>();
  for (const entry of history) {
    const current = result.get(entry.lessonId);
    if (!current) {
      result.set(entry.lessonId, {
        best: entry.wpm,
        bestAcc: entry.accuracy,
        attempts: 1,
      });
    } else {
      current.attempts += 1;
      current.best = Math.max(current.best, entry.wpm);
      current.bestAcc = Math.max(current.bestAcc, entry.accuracy);
    }
  }
  return result;
}
