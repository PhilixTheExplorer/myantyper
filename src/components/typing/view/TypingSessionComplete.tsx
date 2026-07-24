import { ArrowLeft, ArrowRight, CornerUpLeft, RotateCcw } from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/lib/lessons";
import { formatDuration } from "@/lib/wpm";
import { StampSeal } from "../../ui/StampSeal";
import { StatsPanel } from "../../ui/StatsPanel";
import type { TypingSessionModel } from "../engine/types";
import { RhythmScope } from "./RhythmScope";

type Neighbors = ReturnType<typeof import("@/lib/lessons").lessonNeighbors>;

export function TypingSessionComplete({
  exitHref,
  exitLabel,
  neighbors,
  session,
}: {
  lesson: Lesson;
  exitHref: string;
  exitLabel: string;
  neighbors: Neighbors;
  session: TypingSessionModel;
}) {
  return (
    <div className="mt-surface relative px-4 py-6 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
        <StampSeal primary="✓" secondary="COMPLETE" rotate={-6} size={104} />
        <div className="w-full">
          <StatsPanel
            stats={[
              {
                label: "WPM",
                value: String(session.live.wpm).padStart(3, "0"),
                sub: "words/min",
              },
              {
                label: "ACC",
                value: `${session.live.accuracy.toFixed(1)}%`,
                sub: "accuracy",
              },
              {
                label: "TIME",
                value: formatDuration(session.timer.elapsed),
                sub: "mm:ss",
              },
              {
                label: "KEYS",
                value: String(session.keystrokes).padStart(4, "0"),
                sub: "strokes",
              },
            ]}
          />
        </div>
        <div className="flex w-full flex-col items-center gap-4">
          <div className="w-full sm:max-w-sm">
            <RhythmScope intervals={session.intervals} />
          </div>
          <CompletionActions
            exitHref={exitHref}
            exitLabel={exitLabel}
            neighbors={neighbors}
            restart={session.restart}
          />
        </div>
      </div>
    </div>
  );
}

function CompletionActions({
  exitHref,
  exitLabel,
  neighbors,
  restart,
}: {
  exitHref: string;
  exitLabel: string;
  neighbors: Neighbors;
  restart: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
        {exitHref === "/free" && (
          <ActionLink href={exitHref} tone="outline">
            <ArrowLeft size={12} /> {exitLabel}
          </ActionLink>
        )}
        {neighbors?.previous && (
          <ActionLink
            href={`/practice/${neighbors.previous.id}`}
            tone="outline"
          >
            <ArrowLeft size={12} /> Previous
          </ActionLink>
        )}
        <button
          type="button"
          onClick={restart}
          className="mt-action mt-action-outline inline-flex items-center justify-center gap-2 border border-border-soft px-4 py-2 text-xs tracking-widest text-ink uppercase"
        >
          <RotateCcw size={12} /> Try again <ShortcutKey>R</ShortcutKey>
        </button>
        {neighbors?.next ? (
          <ActionLink href={`/practice/${neighbors.next.id}`} tone="primary">
            Next lesson <ArrowRight size={12} />
            <ShortcutKey>Enter</ShortcutKey>
          </ActionLink>
        ) : exitHref !== "/free" ? (
          <ActionLink href="/lessons" tone="primary">
            <CornerUpLeft size={12} /> Back to lessons
            <ShortcutKey>Enter</ShortcutKey>
          </ActionLink>
        ) : null}
      </div>
      {neighbors?.next && (
        <Link
          href="/lessons"
          className="mt-action mt-action-quiet px-2 py-1 text-xs tracking-widest text-ink-soft uppercase"
        >
          Back to lessons
        </Link>
      )}
    </div>
  );
}

function ShortcutKey({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="ml-1 border border-current px-1.5 py-0.5 text-[10px] leading-none opacity-70">
      {children}
    </kbd>
  );
}

function ActionLink({
  href,
  tone,
  children,
}: {
  href: string;
  tone: "outline" | "primary";
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={
        tone === "primary"
          ? "mt-action mt-action-primary inline-flex items-center justify-center gap-2 border border-accent bg-accent px-4 py-2 text-xs tracking-widest text-accent-ink uppercase"
          : "mt-action mt-action-outline inline-flex items-center justify-center gap-2 border border-border-soft px-4 py-2 text-xs tracking-widest text-ink uppercase"
      }
    >
      {children}
    </Link>
  );
}
