"use client";

import { useId, useState } from "react";
import type { HistoryEntry } from "@/lib/storage";

const W = 760;
const H = 240;
const PAD_L = 44;
const PAD_R = 18;
const PAD_T = 20;
const PAD_B = 30;
const PLOT_W = W - PAD_L - PAD_R;
const PLOT_H = H - PAD_T - PAD_B;
const BASELINE = PAD_T + PLOT_H;
const TICKS = 4;

const clamp = (n: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, n));

export function WpmTrend({
  history,
  avg,
}: {
  history: HistoryEntry[];
  avg: number;
}) {
  const gradId = useId();
  const [hover, setHover] = useState<{
    i: number;
    px: number;
    py: number;
  } | null>(null);

  const trend = history.slice().reverse();
  const wpms = trend.map((h) => h.wpm);
  const n = wpms.length;

  const dataMax = Math.max(...wpms);
  const dataMin = Math.min(...wpms);
  const top = Math.max(10, Math.ceil((dataMax + 4) / 10) * 10);
  const bottom = Math.max(0, Math.floor((dataMin - 4) / 10) * 10);
  const range = Math.max(1, top - bottom);

  const xAt = (i: number) =>
    n <= 1 ? PAD_L + PLOT_W / 2 : PAD_L + (i / (n - 1)) * PLOT_W;
  const yAt = (w: number) => PAD_T + (1 - (w - bottom) / range) * PLOT_H;

  const linePts = wpms.map((w, i) => `${xAt(i)},${yAt(w)}`).join(" ");
  const areaPath =
    n >= 2
      ? `M ${xAt(0)},${BASELINE} ` +
        wpms.map((w, i) => `L ${xAt(i)},${yAt(w)}`).join(" ") +
        ` L ${xAt(n - 1)},${BASELINE} Z`
      : null;

  const ticks = Array.from({ length: TICKS + 1 }, (_, k) =>
    Math.round(top - (range * k) / TICKS),
  );
  const showAvg = avg > bottom && avg < top;

  const first = wpms[0];
  const last = wpms[n - 1];
  const delta = last - first;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const fx = (e.clientX - rect.left) / rect.width;
    const i = clamp(
      Math.round(((fx * W - PAD_L) / PLOT_W) * (n - 1 || 1)),
      0,
      n - 1,
    );
    setHover({
      i,
      px: (xAt(i) / W) * rect.width,
      py: (yAt(wpms[i]) / H) * rect.height,
    });
  }

  const active = hover ? trend[hover.i] : null;

  return (
    <div className="mt-surface p-5 mb-6">
      <div className="flex justify-between items-start gap-4 mb-4">
        <div>
          <div className="mt-eyebrow">WPM TREND</div>
          <div className="mt-display text-xl mt-0.5 text-ink">
            Speed over recent sessions
          </div>
        </div>
        <div className="text-right">
          {n >= 2 && (
            <div
              className="mt-display text-lg leading-none"
              style={{
                color: delta >= 0 ? "var(--mt-success)" : "var(--mt-error)",
              }}
            >
              {delta >= 0 ? "▲" : "▼"} {delta >= 0 ? "+" : ""}
              {delta}
              <span className="text-xs tracking-widest text-ink-soft">
                {" "}
                WPM
              </span>
            </div>
          )}
          <div className="text-xs tracking-widest text-ink-soft mt-1">
            OLDEST → NEWEST
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          aria-label={`WPM trend across ${n} recent ${n === 1 ? "session" : "sessions"}`}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto touch-none"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
        >
          <title>WPM trend over recent sessions</title>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--mt-accent)"
                stopOpacity="0.22"
              />
              <stop
                offset="100%"
                stopColor="var(--mt-accent)"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          {ticks.map((v) => (
            <g key={v}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={yAt(v)}
                y2={yAt(v)}
                stroke="var(--mt-border-soft)"
                strokeDasharray="2 6"
              />
              <text
                x={PAD_L - 8}
                y={yAt(v) + 4}
                textAnchor="end"
                fontSize="12"
                fill="var(--mt-ink-soft)"
                style={{ fontFamily: "var(--mt-font-ui)" }}
              >
                {v}
              </text>
            </g>
          ))}

          {showAvg && (
            <>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={yAt(avg)}
                y2={yAt(avg)}
                stroke="var(--mt-ink-soft)"
                strokeWidth={1}
                strokeDasharray="5 4"
                opacity={0.5}
              />
              <text
                x={W - PAD_R}
                y={yAt(avg) - 6}
                textAnchor="end"
                fontSize="11"
                fill="var(--mt-ink-soft)"
                style={{ fontFamily: "var(--mt-font-ui)" }}
              >
                avg {avg}
              </text>
            </>
          )}

          {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}
          {n >= 2 && (
            <polyline
              points={linePts}
              fill="none"
              stroke="var(--mt-accent)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {hover && (
            <line
              x1={xAt(hover.i)}
              x2={xAt(hover.i)}
              y1={PAD_T}
              y2={BASELINE}
              stroke="var(--mt-accent)"
              strokeWidth={1}
              opacity={0.4}
            />
          )}

          {wpms.map((w, i) => {
            const isHover = hover?.i === i;
            const isLast = i === n - 1;
            return (
              <circle
                key={`${trend[i].date}-${trend[i].lessonId}`}
                cx={xAt(i)}
                cy={yAt(w)}
                r={isHover ? 6 : isLast ? 5 : 4}
                fill="var(--mt-accent)"
                stroke="var(--mt-surface)"
                strokeWidth={isHover || isLast ? 2 : 0}
              />
            );
          })}

          {!hover && n >= 1 && (
            <text
              x={clamp(xAt(n - 1), PAD_L + 14, W - PAD_R)}
              y={clamp(yAt(last) - 12, PAD_T + 12, BASELINE)}
              textAnchor="end"
              fontSize="13"
              fill="var(--mt-ink)"
              style={{ fontFamily: "var(--mt-font-display)" }}
            >
              {last}
            </text>
          )}
        </svg>

        {hover && active && (
          <div
            className="pointer-events-none absolute z-10 mt-surface px-3 py-2 text-xs leading-tight -translate-x-1/2 -translate-y-full"
            style={{
              left: hover.px,
              top: hover.py - 10,
              background: "var(--mt-bg)",
              minWidth: 130,
            }}
          >
            <div className="mt-display text-base text-accent leading-none">
              {active.wpm}{" "}
              <span className="text-xs text-ink-soft tracking-widest">WPM</span>
            </div>
            <div className="text-ink truncate mt-1">{active.title}</div>
            <div className="text-ink-soft mt-0.5">
              {active.accuracy}% · {new Date(active.date).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
