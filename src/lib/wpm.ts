/** WPM uses five successfully typed code points per word. */

export interface SessionResult {
  /** Code points successfully typed. */
  charsTyped: number;
  /** All keystrokes the user produced (correct + incorrect). */
  keystrokes: number;
  /** Errors (mismatched keystrokes). */
  errors: number;
  /** Elapsed wall time, milliseconds. */
  elapsedMs: number;
}

export interface SessionStats {
  wpm: number;
  /** 0-100. */
  accuracy: number;
  /** Whole seconds. */
  seconds: number;
}

export function computeStats(r: SessionResult): SessionStats {
  const minutes = Math.max(r.elapsedMs / 60_000, 0.05);
  const wpm = Math.round(r.charsTyped / 5 / minutes);
  const accuracy =
    r.keystrokes > 0 ? Math.max(0, 100 - (r.errors / r.keystrokes) * 100) : 100;
  return {
    wpm,
    accuracy: Math.round(accuracy * 10) / 10,
    seconds: Math.round(r.elapsedMs / 1000),
  };
}

export function formatDuration(seconds: number): string {
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}
