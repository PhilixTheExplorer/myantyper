"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { codeToLabel, keyForChar } from "@/lib/keyboard";
import type { Lesson } from "@/lib/lessons";
import { computeStats } from "@/lib/wpm";
import { useThemeTweaks } from "../../providers/ThemeProvider";
import type { PracticeMode, TypingSessionModel } from "../engine/types";
import {
  advance,
  type EngineEffect,
  type EngineInput,
  type EngineState,
  type EngineTarget,
  initialEngineState,
} from "../engine/typingEngine";
import { createTypingTarget } from "../engine/typingTarget";
import { useActiveTimer } from "./useActiveTimer";
import { useCompletionStamps } from "./useCompletionStamps";
import { useErrorFlash } from "./useErrorFlash";
import { usePersistCompletion } from "./usePersistCompletion";
import { shiftLabel, usePressedKeys } from "./usePressedKeys";
import { useScheduler } from "./useScheduler";
import { useTypewriterAudio } from "./useTypewriterAudio";

function defaultMode(lesson: Lesson): PracticeMode {
  return lesson.id === "free" ? "reader" : "keys";
}

/** React adapter over the pure engine; all matching rules live in `typingEngine.ts`. */
export function useTypingSession(lesson: Lesson): TypingSessionModel {
  const { chars, paragraphLines, typeOrder, stepOf } = useMemo(
    () => createTypingTarget(lesson.lines),
    [lesson.lines],
  );
  const total = typeOrder.length;
  const target = useMemo<EngineTarget>(
    () => ({ chars, typeOrder, total }),
    [chars, typeOrder, total],
  );

  const [engine, setEngine] = useState<EngineState>(initialEngineState);
  const engineRef = useRef(engine);
  const [mode, setMode] = useState<PracticeMode>(() => defaultMode(lesson));

  const cursorRef = useRef<HTMLSpanElement>(null);
  const startedRef = useRef(false);

  const { tweaks } = useThemeTweaks();
  const {
    activeElapsedMs,
    elapsed,
    finish,
    paused,
    reset: resetTimer,
    start: startTimer,
    togglePaused,
  } = useActiveTimer();
  const click = useTypewriterAudio(tweaks.sound);

  const schedule = useScheduler();
  const {
    pressed,
    press: pressKey,
    release: releaseKey,
    flash: flashKey,
    reset: resetKeys,
  } = usePressedKeys(schedule);
  const { errorFlash, flashError, reset: resetError } = useErrorFlash(schedule);
  const { stamps, addStamp, reset: resetStamps } = useCompletionStamps();

  const runEffects = useCallback(
    (effects: EngineEffect[]) => {
      for (const effect of effects) {
        switch (effect.type) {
          case "sound":
            click(effect.variant);
            break;
          case "carriageReturn":
            click("return");
            break;
          case "flashError":
            flashError();
            break;
          case "completed":
            finish();
            addStamp("COMPLETE");
            break;
        }
      }
    },
    [addStamp, click, finish, flashError],
  );

  const dispatch = useCallback(
    (input: EngineInput) => {
      const { state, effects } = advance(target, engineRef.current, input);
      engineRef.current = state;
      setEngine(state);
      runEffects(effects);
    },
    [runEffects, target],
  );

  usePersistCompletion({
    done: engine.done,
    lesson,
    charsTyped: engine.step,
    keystrokes: engine.keystrokes,
    errors: engine.errors,
    activeElapsedMs,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: cursor movement must follow both display mode and step.
  useEffect(() => {
    cursorRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [mode, engine.step]);

  useEffect(() => {
    if (engine.done) return;
    const onDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === "Escape") {
        event.preventDefault();
        togglePaused();
        return;
      }
      if (paused) return;
      if (event.key === "Shift") {
        pressKey(shiftLabel(event.code));
        return;
      }
      if (!startedRef.current) {
        startedRef.current = true;
        startTimer();
      }
      if (event.key === "Backspace") {
        event.preventDefault();
        flashKey("Backspace");
        dispatch({ kind: "backspace", at: Date.now() });
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        dispatch({ kind: "enter", at: Date.now() });
        return;
      }
      const pressedKey = codeToLabel(event.code);
      if (pressedKey === null) return;
      event.preventDefault();
      flashKey(pressedKey);
      dispatch({
        kind: "char",
        label: pressedKey,
        shift: event.shiftKey,
        at: Date.now(),
      });
    };
    const onUp = (event: KeyboardEvent) => {
      const key =
        event.key === "Shift"
          ? shiftLabel(event.code)
          : codeToLabel(event.code);
      if (key !== null) releaseKey(key);
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, [
    dispatch,
    engine.done,
    flashKey,
    paused,
    pressKey,
    releaseKey,
    startTimer,
    togglePaused,
  ]);

  const restart = useCallback(() => {
    engineRef.current = initialEngineState();
    setEngine(engineRef.current);
    resetTimer();
    resetKeys();
    resetError();
    resetStamps();
    startedRef.current = false;
  }, [resetError, resetKeys, resetStamps, resetTimer]);

  const { step, keystrokes, errors } = engine;
  const cursorIndex = step < total ? typeOrder[step] : chars.length;
  const currentLine = paragraphLines.findLastIndex(
    (line) => line.start <= cursorIndex,
  );
  const expectedChar = cursorIndex < chars.length ? chars[cursorIndex] : null;
  const live = useMemo(
    () =>
      computeStats({
        charsTyped: step,
        keystrokes,
        errors,
        elapsedMs: elapsed * 1000,
      }),
    [elapsed, errors, keystrokes, step],
  );

  return {
    chars,
    paragraphLines,
    typeOrder,
    total,
    step,
    keystrokes,
    pressed,
    errorFlash,
    stamps,
    carriageReturns: engine.carriageReturns,
    intervals: engine.intervals,
    done: engine.done,
    mode,
    setMode,
    mistake: engine.mistake,
    cursorRef,
    timer: { elapsed, paused, togglePaused },
    restart,
    cursorIndex,
    currentLine,
    expectedHint: expectedChar ? keyForChar(expectedChar) : null,
    isTyped: (index: number) => stepOf[index] !== -1 && stepOf[index] < step,
    live,
    progress: total > 0 ? (step / total) * 100 : 0,
  };
}
