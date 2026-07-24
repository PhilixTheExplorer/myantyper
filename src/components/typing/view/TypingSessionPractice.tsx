import { fingerLabelForKey } from "@/lib/keyboard";
import { segmentSyllables } from "@/lib/syllable";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/wpm";
import { Keyboard } from "../../keyboard/Keyboard";
import { StampSeal } from "../../ui/StampSeal";
import type {
  Mistake,
  ParagraphLine,
  TypingSessionModel,
} from "../engine/types";
import { KeysCarriage, ReaderCarriage } from "./TypingCarriages";

export function TypingSessionPractice({
  session,
}: {
  session: TypingSessionModel;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="relative mb-2 shrink-0 space-y-2">
        <div className="mt-surface overflow-hidden px-5 py-2 sm:px-8">
          <div className="mb-1 flex min-h-5 items-center justify-between gap-3">
            <div className="mt-eyebrow shrink-0">Text to type</div>
            {session.mistake ? (
              <MistakeNotice mistake={session.mistake} />
            ) : (
              <PracticeStatus session={session} />
            )}
          </div>
          <ReaderCarriage
            chars={session.chars}
            cursorIndex={session.cursorIndex}
            isTyped={session.isTyped}
            errorFlash={session.errorFlash}
            carriageReturns={session.carriageReturns}
            cursorRef={session.cursorRef}
            compact={session.mode === "keys"}
          />
        </div>
        {session.mode === "keys" && (
          <div className="mt-key-order-compact mt-surface mt-typewriter-bed relative h-20.5 overflow-hidden sm:h-23">
            <KeysCarriage
              chars={session.chars}
              step={session.step}
              typeOrder={session.typeOrder}
              errorFlash={session.errorFlash}
              carriageReturns={session.carriageReturns}
            />
          </div>
        )}
        {session.timer.paused && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-bg/85">
            <div className="mt-display text-5xl tracking-widest text-accent">
              PAUSED
            </div>
            <div className="mt-eyebrow">PRESS ESC TO RESUME</div>
          </div>
        )}
        {session.stamps.map((stamp, index) => (
          <div
            key={stamp.id}
            className="absolute z-[5]"
            style={{
              right: 24 + index * 26,
              top: 40 + index * 16,
              transform: `rotate(${stamp.rotate}deg)`,
            }}
          >
            <StampSeal
              primary={stamp.label === "COMPLETE" ? "✓" : "½"}
              secondary={stamp.label}
              rotate={0}
              size={64}
            />
          </div>
        ))}
      </div>
      <div className="mb-2 grid min-h-0 flex-1 content-start grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Keyboard
          highlight={session.expectedHint}
          pressedKeys={session.pressed}
          maxWidth={900}
          legend
        />
        <ParagraphPreview
          lines={session.paragraphLines}
          currentLine={session.currentLine}
          cursorIndex={session.cursorIndex}
        />
      </div>
    </div>
  );
}

function PracticeStatus({ session }: { session: TypingSessionModel }) {
  return (
    <div className="flex min-w-0 items-center gap-3 text-xs tracking-widest text-ink-soft uppercase tabular-nums">
      <span className="hidden whitespace-nowrap md:inline">
        <strong className="text-ink font-normal">{session.live.wpm}</strong> WPM
      </span>
      <span className="hidden whitespace-nowrap lg:inline">
        <strong className="text-ink font-normal">
          {session.live.accuracy.toFixed(0)}%
        </strong>{" "}
        ACC
      </span>
      <span className="hidden whitespace-nowrap sm:inline">
        <strong className="text-ink font-normal">
          {formatDuration(session.timer.elapsed)}
        </strong>{" "}
        TIME
      </span>
      <div className="flex min-w-24 items-center gap-2 sm:min-w-32">
        <div
          className="relative h-1.5 flex-1 bg-bg"
          role="progressbar"
          aria-valuenow={Math.round(session.progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Lesson progress"
        >
          <div
            className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-100"
            style={{ width: `${session.progress}%` }}
          />
        </div>
        <span className="shrink-0 whitespace-nowrap">
          {session.step}/{session.total}
        </span>
      </div>
    </div>
  );
}

function MistakeNotice({ mistake }: { mistake: Mistake }) {
  const label = (key: string, shift: boolean) =>
    `${shift ? "SHIFT + " : ""}${key}`;
  const finger = fingerLabelForKey(mistake.expected);
  return (
    <div
      role="status"
      className="flex min-w-0 items-center gap-2 overflow-hidden border-l-2 border-error bg-surface-2 pl-2 text-xs tracking-widest uppercase"
    >
      <span className="shrink-0 whitespace-nowrap text-error">
        Pressed {label(mistake.pressed, mistake.pressedShift)}
      </span>
      <span className="shrink-0 whitespace-nowrap text-ink-soft">
        Expected {label(mistake.expected, mistake.expectedShift)}
      </span>
      {finger && (
        <span className="hidden shrink-0 whitespace-nowrap text-ink-soft sm:inline">
          {finger}
        </span>
      )}
    </div>
  );
}

function ParagraphPreview({
  lines,
  currentLine,
  cursorIndex,
}: {
  lines: ParagraphLine[];
  currentLine: number;
  cursorIndex: number;
}) {
  const firstLine = Math.max(0, currentLine - 1);
  const visibleLines = lines.slice(firstLine, currentLine + 2);

  return (
    <aside className="mt-surface flex min-w-0 flex-col p-4 xl:self-stretch xl:[contain:size]">
      <div className="mt-eyebrow mb-3">Paragraph</div>
      <div
        lang="my"
        className="mt-myanmar flex min-h-0 flex-1 flex-col gap-2 overflow-hidden text-base"
      >
        {visibleLines.map((line, offset) => {
          const index = firstLine + offset;
          const active = index === currentLine;
          return (
            <p
              key={line.start}
              className={cn(
                "border-l-2 pl-3 leading-relaxed",
                active ? "line-clamp-8" : "line-clamp-1",
                active
                  ? "border-accent text-ink"
                  : index < currentLine
                    ? "border-border-soft text-ink-soft"
                    : "border-transparent text-ink-dim",
              )}
            >
              {paragraphLineExcerpt(line, active ? cursorIndex : undefined)}
            </p>
          );
        })}
      </div>
    </aside>
  );
}

const PARAGRAPH_CHUNK_STEP = 80;
const PARAGRAPH_CHUNK_SIZE = 120;
const PARAGRAPH_CONTEXT_SIZE = 24;

function paragraphLineExcerpt(
  line: ParagraphLine,
  cursorIndex?: number,
): string {
  if (!line.text) return "\u00a0";

  const chars = Array.from(line.text);
  const syllables = segmentSyllables(chars);
  const relativeCursor =
    cursorIndex === undefined
      ? 0
      : Math.max(0, Math.min(chars.length, cursorIndex - line.start));
  const matchingSyllable = syllables.findIndex(
    ([, end]) => relativeCursor < end,
  );
  const activeSyllable =
    matchingSyllable === -1
      ? Math.max(0, syllables.length - 1)
      : matchingSyllable;
  const chunkStep =
    cursorIndex === undefined ? PARAGRAPH_CONTEXT_SIZE : PARAGRAPH_CHUNK_STEP;
  const chunkSize =
    cursorIndex === undefined ? PARAGRAPH_CONTEXT_SIZE : PARAGRAPH_CHUNK_SIZE;
  const firstSyllable = Math.floor(activeSyllable / chunkStep) * chunkStep;
  const visibleSyllables = syllables.slice(
    firstSyllable,
    firstSyllable + chunkSize,
  );
  const start = visibleSyllables[0]?.[0] ?? 0;
  const end = visibleSyllables.at(-1)?.[1] ?? chars.length;

  return `${start > 0 ? "… " : ""}${chars.slice(start, end).join("")}${
    end < chars.length ? " …" : ""
  }`;
}
