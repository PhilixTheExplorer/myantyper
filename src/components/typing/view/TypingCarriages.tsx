import { isCombiningMark, segmentSyllables } from "@/lib/syllable";
import { cn } from "@/lib/utils";

/** Renders the current line in visual keystroke order. */
export function KeysCarriage({
  chars,
  step,
  typeOrder,
  errorFlash,
  carriageReturns,
}: {
  chars: string[];
  step: number;
  typeOrder: number[];
  errorFlash: boolean;
  carriageReturns: number;
}) {
  const safeStep = Math.min(step, Math.max(0, typeOrder.length - 1));
  let lineStartStep = safeStep;
  while (lineStartStep > 0 && chars[typeOrder[lineStartStep - 1]] !== "\n") {
    lineStartStep--;
  }
  let lineEndStep = safeStep;
  while (
    lineEndStep < typeOrder.length &&
    chars[typeOrder[lineEndStep]] !== "\n"
  ) {
    lineEndStep++;
  }
  if (lineEndStep < typeOrder.length) lineEndStep++;
  const lineSteps = typeOrder.slice(lineStartStep, lineEndStep);
  const lineCursor = safeStep - lineStartStep;

  return (
    <div className="absolute inset-x-0 top-3 bottom-1 overflow-hidden">
      <div className="mt-typewriter-ruler" aria-hidden />
      <div className="mt-strike-guide" aria-hidden>
        <span />
      </div>
      <div
        key={carriageReturns}
        className="mt-typewriter-paper"
        style={{ "--mt-paper-step": lineCursor } as React.CSSProperties}
      >
        <div lang="my" className="mt-myanmar mt-typewriter-line">
          {lineSteps.map((charIndex, offset) => {
            const tokenStep = lineStartStep + offset;
            const state =
              tokenStep === step
                ? "cursor"
                : tokenStep < step
                  ? "done"
                  : "pending";
            return (
              <span
                key={charIndex}
                className={cn(
                  "mt-typewriter-glyph",
                  state === "done" ? "text-ink" : "text-ink-dim",
                  state === "cursor" && "mt-typewriter-current text-ink",
                  state === "cursor" && errorFlash && "mt-typewriter-error",
                )}
              >
                {keystrokeGlyph(chars[charIndex])}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Renders shaped Myanmar in canonical order. */
export function ReaderCarriage({
  chars,
  cursorIndex,
  isTyped,
  errorFlash,
  carriageReturns,
  cursorRef,
  compact = false,
}: {
  chars: string[];
  cursorIndex: number;
  isTyped: (index: number) => boolean;
  errorFlash: boolean;
  carriageReturns: number;
  cursorRef: React.RefObject<HTMLSpanElement | null>;
  compact?: boolean;
}) {
  let lineStart = cursorIndex;
  while (lineStart > 0 && chars[lineStart - 1] !== "\n") lineStart--;
  let lineEnd = cursorIndex;
  while (lineEnd < chars.length && chars[lineEnd] !== "\n") lineEnd++;
  const lineChars = chars.slice(lineStart, lineEnd);

  return (
    <div
      className={cn(
        "overflow-hidden leading-snug text-pretty",
        compact
          ? "max-h-20 text-xl sm:max-h-24 sm:text-2xl"
          : "max-h-28 text-2xl sm:max-h-36 sm:text-4xl",
      )}
    >
      <div
        key={`${carriageReturns}-${lineStart}`}
        lang="my"
        className="mt-carriage-return"
      >
        {segmentSyllables(lineChars).map(([relativeStart, relativeEnd]) => {
          const start = lineStart + relativeStart;
          const end = lineStart + relativeEnd;
          const slice = chars.slice(start, end);
          const text = slice.join("");
          const current = cursorIndex >= start && cursorIndex < end;
          const typedText = slice
            .filter((_, offset) => isTyped(start + offset))
            .join("");
          const done = typedText.length === text.length;
          const displayText = text === " " ? "\u00a0" : text;
          return (
            <span
              key={start}
              ref={current ? cursorRef : undefined}
              className={cn(
                "mt-myanmar mt-reader-syllable",
                current
                  ? "mt-reader-syllable-current"
                  : done
                    ? "text-ink"
                    : "text-ink-dim",
                current && errorFlash && "mt-reader-syllable-error",
              )}
            >
              {current ? (
                <>
                  <span className="text-ink-dim">{displayText}</span>
                  <span className="mt-reader-typed-layer text-ink" aria-hidden>
                    <span>{typedText}</span>
                    <i className="mt-reader-inline-caret" />
                  </span>
                </>
              ) : (
                displayText
              )}
            </span>
          );
        })}
        {lineChars.length === 0 && <span>&nbsp;</span>}
      </div>
    </div>
  );
}

function keystrokeGlyph(ch: string): string {
  if (ch === " ") return "␣";
  if (ch === "\n") return "↵";
  return isCombiningMark(ch) ? `\u200c${ch}` : ch;
}
