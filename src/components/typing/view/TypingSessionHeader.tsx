import {
  ArrowLeft,
  BookOpen,
  CircleHelp,
  CornerUpLeft,
  Keyboard as KeyboardIcon,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import type { Lesson } from "@/lib/lessons";
import { trackLabel } from "@/lib/lessons";
import { cn } from "@/lib/utils";
import type { TypingSessionModel } from "../engine/types";

export function TypingSessionHeader({
  lesson,
  exitHref,
  exitLabel,
  session,
}: {
  lesson: Lesson;
  exitHref: string;
  exitLabel: string;
  session: TypingSessionModel;
}) {
  return (
    <div className="mb-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <div className="mt-eyebrow truncate">
          {lesson.id === "free"
            ? "FREE TYPE"
            : trackLabel(lesson.track).toUpperCase()}{" "}
          · {lesson.unitTitle}
        </div>
        <h1 className="mt-display truncate py-1 text-xl leading-normal text-ink sm:text-2xl">
          {lesson.title}
        </h1>
      </div>
      {!session.done && (
        <div className="flex shrink-0 flex-wrap items-center gap-1.5 lg:justify-end">
          <fieldset
            className="inline-grid grid-cols-2 border border-border-soft"
            aria-label="Prompt"
          >
            <ModeButton
              active={session.mode === "keys"}
              label="Keys"
              title="Show readable text and visual key order"
              onClick={() => session.setMode("keys")}
            >
              <KeyboardIcon size={13} />
            </ModeButton>
            <ModeButton
              active={session.mode === "reader"}
              label="Reader"
              title="Show readable Myanmar text"
              onClick={() => session.setMode("reader")}
            >
              <BookOpen size={13} />
            </ModeButton>
          </fieldset>
          <ModeHelp />
          <div className="flex gap-1.5">
            <IconButton
              label={session.timer.paused ? "Resume" : "Pause"}
              onClick={session.timer.togglePaused}
            >
              {session.timer.paused ? <Play size={13} /> : <Pause size={13} />}
            </IconButton>
            <IconButton label="Restart" onClick={session.restart}>
              <RotateCcw size={13} />
            </IconButton>
            <Link
              href={exitHref}
              aria-label={exitLabel}
              title={exitLabel}
              className="mt-action mt-action-outline inline-flex h-10 w-10 items-center justify-center border border-border-soft text-ink sm:h-8 sm:w-8"
            >
              {exitHref === "/free" ? (
                <ArrowLeft size={13} />
              ) : (
                <CornerUpLeft size={13} />
              )}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ModeHelp() {
  return (
    <details className="group relative">
      <summary
        className="mt-action mt-action-outline flex h-10 w-10 cursor-pointer list-none items-center justify-center border border-border-soft text-ink sm:h-8 sm:w-8 [&::-webkit-details-marker]:hidden"
        aria-label="Explain Keys and Reader modes"
        title="Keys and Reader help"
      >
        <CircleHelp size={14} />
      </summary>
      <div className="absolute right-0 z-30 mt-2 w-72 border border-border-soft bg-bg p-4 text-xs leading-relaxed text-ink-soft shadow-lg">
        <p>
          <strong className="text-ink">Keys</strong> adds the physical input
          order. Use it while learning new sequences.
        </p>
        <p className="mt-2">
          <strong className="text-ink">Reader</strong> shows natural Myanmar
          without the key-order rail. Use it for recall and fluency.
        </p>
        <Link
          href="/guide#practice-modes"
          className="mt-3 inline-block text-accent underline underline-offset-2"
        >
          Read the learner guide
        </Link>
      </div>
    </details>
  );
}
function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="mt-action mt-action-outline inline-flex h-10 w-10 items-center justify-center border border-border-soft text-ink sm:h-8 sm:w-8"
    >
      {children}
    </button>
  );
}
function ModeButton({
  active,
  label,
  title,
  onClick,
  children,
}: {
  active: boolean;
  label: string;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-pressed={active}
      className={cn(
        "mt-action inline-flex h-10 items-center justify-center gap-2 px-3 text-xs tracking-widest uppercase sm:h-8",
        active ? "bg-accent text-accent-ink" : "mt-action-quiet text-ink-soft",
      )}
    >
      {children}
      {label}
    </button>
  );
}
