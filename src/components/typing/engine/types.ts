import type { KeyHint } from "@/lib/keyboard";
import type { Lesson } from "@/lib/lessons";
import type { SessionStats } from "@/lib/wpm";

export interface TypingSessionProps {
  lesson: Lesson;
  exitHref?: string;
  exitLabel?: string;
}

export type PracticeMode = "keys" | "reader";

export interface Mistake {
  pressed: string;
  pressedShift: boolean;
  expected: string;
  expectedShift: boolean;
}

export interface ParagraphLine {
  start: number;
  text: string;
}

export interface SessionStamp {
  id: number;
  label: string;
  rotate: number;
}

/** Stable view contract for the typing-session controller. */
export interface TypingSessionModel {
  chars: string[];
  paragraphLines: ParagraphLine[];
  typeOrder: number[];
  total: number;
  step: number;
  keystrokes: number;
  pressed: Set<string>;
  errorFlash: boolean;
  stamps: SessionStamp[];
  carriageReturns: number;
  intervals: number[];
  done: boolean;
  mode: PracticeMode;
  setMode: (mode: PracticeMode) => void;
  mistake: Mistake | null;
  cursorRef: React.RefObject<HTMLSpanElement | null>;
  timer: {
    elapsed: number;
    paused: boolean;
    togglePaused: () => void;
  };
  restart: () => void;
  cursorIndex: number;
  currentLine: number;
  expectedHint: KeyHint | null;
  isTyped: (index: number) => boolean;
  live: SessionStats;
  progress: number;
}
