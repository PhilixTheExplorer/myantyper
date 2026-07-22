"use client";

import { useMemo } from "react";
import { summarizeHistory } from "@/lib/progress/types";
import { formatDuration } from "@/lib/wpm";
import { useHistory } from "../providers/HistoryProvider";
import { StatsPanel } from "../ui/StatsPanel";
import { WpmTrend } from "./WpmTrend";

export function HistoryView() {
  const { history, historyError, isHistoryLoading, retryHistory } =
    useHistory();

  const totals = useMemo(() => summarizeHistory(history), [history]);

  if (isHistoryLoading && !history.length) {
    return (
      <div className="mt-surface p-10 text-center text-ink-soft">
        Loading history…
      </div>
    );
  }

  if (!history.length) {
    if (historyError) {
      return (
        <div
          role="alert"
          className="mt-surface flex items-center justify-between gap-4 border-error p-4 text-sm text-error"
        >
          <span>{historyError}</span>
          <button
            type="button"
            className="mt-action mt-action-outline shrink-0 border border-border-soft px-3 py-2 text-xs tracking-widest uppercase"
            onClick={retryHistory}
          >
            Retry
          </button>
        </div>
      );
    }
    return (
      <div className="mt-surface p-10 text-center text-ink-soft">
        No sessions yet. Complete a lesson to see your history here.
      </div>
    );
  }

  return (
    <>
      {historyError && (
        <div
          role="alert"
          className="mt-surface mb-6 flex items-center justify-between gap-4 border-error p-4 text-sm text-error"
        >
          <span>{historyError}</span>
          <button
            type="button"
            className="mt-action mt-action-outline shrink-0 border border-border-soft px-3 py-2 text-xs tracking-widest uppercase"
            onClick={retryHistory}
          >
            Retry
          </button>
        </div>
      )}
      <div className="mb-6">
        <StatsPanel
          stats={[
            {
              label: "SESSIONS",
              value: String(totals.sessions).padStart(3, "0"),
              sub: "recorded",
            },
            {
              label: "BEST WPM",
              value: String(totals.bestWPM).padStart(3, "0"),
              sub: "all-time",
            },
            {
              label: "AVG WPM",
              value: String(totals.avgWPM).padStart(3, "0"),
              sub: "rolling",
            },
            {
              label: "AVG ACC",
              value: `${totals.avgAccuracy.toFixed(1)}%`,
              sub: "rolling",
            },
            {
              label: "MINUTES",
              value: String(totals.totalMinutes).padStart(4, "0"),
              sub: "at the keys",
            },
          ]}
        />
      </div>

      <WpmTrend history={history} avg={totals.avgWPM} />

      <div className="mt-surface overflow-x-auto">
        <div className="min-w-140">
          <div className="grid grid-cols-[1.6fr_2fr_0.8fr_0.8fr_0.8fr_0.8fr] px-5 py-3 border-b border-dashed border-border-soft mt-eyebrow">
            <div>Date</div>
            <div>Lesson</div>
            <div>WPM</div>
            <div>Acc</div>
            <div>Time</div>
            <div>Keys</div>
          </div>
          {history.map((h, i) => (
            <div
              key={h.id}
              className="grid grid-cols-[1.6fr_2fr_0.8fr_0.8fr_0.8fr_0.8fr] px-5 py-3.5 text-sm items-center"
              style={{
                borderBottom:
                  i < history.length - 1
                    ? "1px dashed var(--mt-border-soft)"
                    : "none",
              }}
            >
              <div className="text-ink-soft">
                {new Date(h.completedAt).toLocaleString()}
              </div>
              <div className="text-ink">
                {h.lessonId} · {h.title}
              </div>
              <div className="mt-display text-lg text-accent">{h.wpm}</div>
              <div>{h.accuracy}%</div>
              <div>{formatDuration(h.seconds)}</div>
              <div className="text-ink-soft">{h.keystrokes}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
