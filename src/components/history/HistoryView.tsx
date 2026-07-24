"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { progressErrorMessage } from "@/lib/progress/store";
import type { HistoryEntry } from "@/lib/progress/types";
import { formatDuration } from "@/lib/wpm";
import { useHistory } from "../providers/HistoryProvider";
import { StatsPanel } from "../ui/StatsPanel";
import { WpmTrend } from "./WpmTrend";

const SESSIONS_PER_PAGE = 20;
const TREND_SESSION_LIMIT = 30;

export function HistoryView() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    overview,
    historyRevision,
    historyError,
    isHistoryLoading,
    listHistoryPage,
    retryHistory,
  } = useHistory();
  const newestHistoryId = useRef<string | undefined>(undefined);
  const [visibleHistory, setVisibleHistory] = useState<HistoryEntry[]>([]);
  const [pageError, setPageError] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const totals = overview.summary;
  const pageParam = Number(searchParams.get("page"));
  const requestedPage =
    Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;
  const pageCount = Math.max(1, Math.ceil(totals.sessions / SESSIONS_PER_PAGE));
  const currentPage = Math.min(requestedPage, pageCount);
  const pageStart = (currentPage - 1) * SESSIONS_PER_PAGE;

  const replacePage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) params.delete("page");
      else params.set("page", String(page));
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const nextNewestId = overview.recent[0]?.id;
    if (
      newestHistoryId.current !== undefined &&
      nextNewestId !== newestHistoryId.current &&
      requestedPage !== 1
    ) {
      replacePage(1);
    }
    newestHistoryId.current = nextNewestId;
  }, [overview.recent, requestedPage, replacePage]);

  // historyRevision deliberately invalidates the visible page after append,
  // import, remote sync, or a cross-tab write.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    if (isHistoryLoading || totals.sessions === 0) {
      if (totals.sessions === 0) setVisibleHistory([]);
      return;
    }

    let active = true;
    setIsPageLoading(true);
    setVisibleHistory([]);
    setPageError(null);
    void listHistoryPage(pageStart, SESSIONS_PER_PAGE)
      .then((page) => {
        if (active) setVisibleHistory(page.entries);
      })
      .catch((error: unknown) => {
        if (active) setPageError(progressErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsPageLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    historyRevision,
    isHistoryLoading,
    listHistoryPage,
    pageStart,
    totals.sessions,
  ]);

  if (isHistoryLoading && totals.sessions === 0) {
    return (
      <div className="mt-surface p-10 text-center text-ink-soft">
        Loading history…
      </div>
    );
  }

  if (totals.sessions === 0) {
    if (historyError || pageError) {
      return (
        <div
          role="alert"
          className="mt-surface flex items-center justify-between gap-4 border-error p-4 text-sm text-error"
        >
          <span>{historyError || pageError}</span>
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
      {(historyError || pageError) && (
        <div
          role="alert"
          className="mt-surface mb-6 flex items-center justify-between gap-4 border-error p-4 text-sm text-error"
        >
          <span>{historyError || pageError}</span>
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

      <WpmTrend
        history={overview.recent.slice(0, TREND_SESSION_LIMIT)}
        avg={totals.avgWPM}
      />

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
          {isPageLoading && visibleHistory.length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-ink-soft">
              Loading sessions…
            </div>
          ) : (
            visibleHistory.map((h, i) => (
              <div
                key={h.id}
                className="grid grid-cols-[1.6fr_2fr_0.8fr_0.8fr_0.8fr_0.8fr] px-5 py-3.5 text-sm items-center"
                style={{
                  borderBottom:
                    i < visibleHistory.length - 1
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
            ))
          )}
        </div>
      </div>
      {pageCount > 1 && (
        <nav
          aria-label="History pagination"
          className="mt-4 flex items-center justify-between gap-4"
        >
          <button
            type="button"
            className="mt-action mt-action-outline inline-flex items-center gap-2 border border-border-soft px-3 py-2 text-xs tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage === 1}
            onClick={() => replacePage(currentPage - 1)}
          >
            <ArrowLeft aria-hidden="true" size={14} />
            Previous
          </button>
          <div className="text-xs tracking-widest text-ink-soft">
            PAGE {currentPage} OF {pageCount}
          </div>
          <button
            type="button"
            className="mt-action mt-action-outline inline-flex items-center gap-2 border border-border-soft px-3 py-2 text-xs tracking-widest uppercase disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentPage === pageCount}
            onClick={() => replacePage(currentPage + 1)}
          >
            Next
            <ArrowRight aria-hidden="true" size={14} />
          </button>
        </nav>
      )}
    </>
  );
}
