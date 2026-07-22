"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { summarizeHistory } from "@/lib/progress/types";
import { useHistory } from "../providers/HistoryProvider";

export function HomeStats() {
  const { history } = useHistory();

  const stats = useMemo(() => {
    const s = summarizeHistory(history);
    return {
      total: s.sessions,
      avgWPM: s.avgWPM,
      avgAcc: s.avgAccuracy.toFixed(1),
      minutes: s.totalMinutes,
      recent: history[0] ?? null,
    };
  }, [history]);

  return (
    <div className="flex flex-col gap-4 lg:grid lg:h-full lg:auto-rows-fr">
      <Card>
        <div className="mt-eyebrow">SESSION AVERAGE</div>
        <div className="mt-display text-5xl leading-tight mt-1">
          {stats.avgWPM} <span className="text-lg text-ink-soft">WPM</span>
        </div>
        <div className="text-xs text-ink-soft mt-1.5">
          {stats.avgAcc}% accuracy across {stats.total} sessions
        </div>
      </Card>
      <Card>
        <div className="mt-eyebrow">TIME AT THE KEYS</div>
        <div className="mt-display text-5xl leading-tight mt-1">
          {stats.minutes}
          <span className="text-lg text-ink-soft"> min</span>
        </div>
        <div className="text-xs text-ink-soft mt-1.5">
          {stats.recent ? (
            <>
              last: <span className="text-ink">{stats.recent.title}</span>
            </>
          ) : (
            "no sessions yet"
          )}
        </div>
      </Card>
      {stats.recent && (
        <Link
          href={`/practice/${stats.recent.lessonId}`}
          aria-label={`Continue ${stats.recent.title}`}
          className="mt-surface mt-action group flex flex-col p-5 transition-colors hover:border-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:bg-surface-2"
        >
          <div className="mt-eyebrow">RESUME</div>
          <div className="mt-display text-xl mt-1 text-ink group-hover:text-accent group-focus-visible:text-accent">
            {stats.recent.title}
          </div>
          <div className="mt-auto pt-4">
            <span className="inline-flex items-center gap-2 border border-accent bg-accent px-3 py-2 text-xs tracking-widest text-accent-ink uppercase transition-colors group-hover:bg-transparent group-hover:text-accent group-focus-visible:bg-transparent group-focus-visible:text-accent">
              Continue <ArrowRight aria-hidden="true" size={14} />
            </span>
          </div>
        </Link>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="mt-surface p-5">{children}</div>;
}
