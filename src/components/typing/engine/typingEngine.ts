import { keyForChar } from "@/lib/keyboard";
import type { Mistake } from "./types";

/**
 * Pure typing state machine: no React, DOM, clock, or randomness. Time arrives
 * on each input as `at`, so identical inputs always produce identical output.
 */

export interface EngineTarget {
  /** Canonical display code points. */
  chars: string[];
  /** Display indices in visual keystroke order. */
  typeOrder: number[];
  /** Number of keystrokes required to finish (`typeOrder.length`). */
  total: number;
}

export interface EngineState {
  step: number;
  errors: number;
  keystrokes: number;
  carriageReturns: number;
  intervals: number[];
  mistake: Mistake | null;
  done: boolean;
  /** Timestamp of the previous stroke, for rhythm intervals. */
  lastStrokeAt: number | null;
}

export type EngineInput =
  | { kind: "char"; label: string; shift: boolean; at: number }
  | { kind: "backspace"; at: number }
  | { kind: "enter"; at: number };

/** Side effect the adapter must carry out (sound, flash, timer, history). */
export type EngineEffect =
  | { type: "sound"; variant: "key" | "error" | "bell" | "return" }
  | { type: "flashError" }
  | { type: "carriageReturn" }
  | { type: "completed" };

export interface EngineResult {
  state: EngineState;
  effects: EngineEffect[];
}

/** Cap on retained inter-keystroke intervals for the cadence chart. */
export const MAX_INTERVALS = 64;

export function initialEngineState(): EngineState {
  return {
    step: 0,
    errors: 0,
    keystrokes: 0,
    carriageReturns: 0,
    intervals: [],
    mistake: null,
    done: false,
    lastStrokeAt: null,
  };
}

function charAtStep(target: EngineTarget, index: number): string | null {
  return index < target.total ? target.chars[target.typeOrder[index]] : null;
}

/** Appends the gap since the previous stroke, bounded to `MAX_INTERVALS`. */
function recordStroke(intervals: number[], last: number | null, at: number) {
  if (last === null) return intervals;
  const interval = at - last;
  return intervals.length >= MAX_INTERVALS
    ? [...intervals.slice(1), interval]
    : [...intervals, interval];
}

/** Advances by one input; returns the next state and its effects. Never mutates `state`. */
export function advance(
  target: EngineTarget,
  state: EngineState,
  input: EngineInput,
): EngineResult {
  if (state.done) return { state, effects: [] };

  const intervals = recordStroke(state.intervals, state.lastStrokeAt, input.at);
  const base: EngineState = {
    ...state,
    intervals,
    lastStrokeAt: input.at,
    keystrokes: state.keystrokes + 1,
  };

  if (input.kind === "backspace") {
    return {
      state: { ...base, step: Math.max(0, state.step - 1) },
      effects: [{ type: "sound", variant: "key" }],
    };
  }

  if (input.kind === "enter") {
    // Enter only advances when the cursor is sitting on a line break.
    if (charAtStep(target, state.step) !== "\n") {
      return { state, effects: [] };
    }
    let index = state.step;
    while (charAtStep(target, index) === "\n") index++;
    return {
      state: {
        ...base,
        step: index,
        carriageReturns: state.carriageReturns + 1,
      },
      effects: [{ type: "carriageReturn" }],
    };
  }

  // A character stroke: first cross any pending line breaks (carriage return),
  // then match against the expected key at the resulting step.
  const effects: EngineEffect[] = [];
  let index = state.step;
  let carriageReturns = state.carriageReturns;
  const before = index;
  while (charAtStep(target, index) === "\n") index++;
  if (index !== before) {
    carriageReturns += 1;
    effects.push({ type: "carriageReturn" });
  }

  if (index >= target.total) {
    return { state: { ...base, step: index, carriageReturns }, effects };
  }

  const expected = keyForChar(charAtStep(target, index) as string);
  const correct =
    input.label === expected.key.toUpperCase() &&
    input.shift === expected.shift;

  if (correct) {
    const next = index + 1;
    const done = next >= target.total;
    effects.push({ type: "sound", variant: "key" });
    if (done)
      effects.push({ type: "sound", variant: "bell" }, { type: "completed" });
    return {
      state: { ...base, step: next, carriageReturns, mistake: null, done },
      effects,
    };
  }

  effects.push({ type: "sound", variant: "error" }, { type: "flashError" });
  return {
    state: {
      ...base,
      step: index,
      carriageReturns,
      errors: state.errors + 1,
      mistake: {
        pressed: input.label,
        pressedShift: input.shift,
        expected: expected.key.toUpperCase(),
        expectedShift: expected.shift,
      },
    },
    effects,
  };
}
