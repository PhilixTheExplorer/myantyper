"use client";

const FAST_MS = 120;
const SLOW_MS = 700;
const SLOTS = 32;
const CADENCE_WINDOW = 10;
const IRREGULAR_CV = 0.6;

function barHeight(ms: number): number {
  const t = (ms - FAST_MS) / (SLOW_MS - FAST_MS);
  return Math.min(1, Math.max(0.08, 1 - t));
}

function isIrregular(intervals: number[]): boolean {
  const w = intervals.slice(-CADENCE_WINDOW);
  if (w.length < 4) return false;
  const mean = w.reduce((a, b) => a + b, 0) / w.length;
  if (mean === 0) return false;
  const variance = w.reduce((a, b) => a + (b - mean) ** 2, 0) / w.length;
  return Math.sqrt(variance) / mean > IRREGULAR_CV;
}

export function RhythmScope({ intervals }: { intervals: number[] }) {
  const recent = intervals.slice(-SLOTS);
  const pad = SLOTS - recent.length;
  const irregular = isIrregular(intervals);

  return (
    <div className="mt-surface px-3 py-2 flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="mt-eyebrow">CADENCE</span>
        <span
          className="text-xs tracking-widest"
          style={{
            color: irregular ? "var(--mt-error)" : "var(--mt-ink-soft)",
          }}
        >
          {intervals.length < 4
            ? "n/a"
            : irregular
              ? "IRREGULAR CADENCE"
              : "STEADY"}
        </span>
      </div>
      <div className="flex items-end gap-px h-10">
        {Array.from({ length: pad }, (_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: positional sparkline bar
            key={`pad-${i}`}
            className="flex-1"
            style={{
              height: "8%",
              background: "var(--mt-ink-dim)",
              opacity: 0.4,
            }}
          />
        ))}
        {recent.map((ms, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: positional sparkline bar
            key={`bar-${pad + i}`}
            className="flex-1"
            style={{
              height: `${barHeight(ms) * 100}%`,
              background: "var(--mt-accent)",
              opacity: 0.35 + (i / SLOTS) * 0.65,
            }}
          />
        ))}
      </div>
    </div>
  );
}
