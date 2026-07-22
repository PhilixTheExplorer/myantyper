import { useEffect, useRef } from "react";
import type { Lesson } from "@/lib/lessons";
import { newEntryId } from "@/lib/progress/types";
import { computeStats } from "@/lib/wpm";
import { useHistory } from "../../providers/HistoryProvider";

interface CompletionInput {
  done: boolean;
  lesson: Lesson;
  charsTyped: number;
  keystrokes: number;
  errors: number;
  activeElapsedMs: number;
}

export function usePersistCompletion({
  done,
  lesson,
  charsTyped,
  keystrokes,
  errors,
  activeElapsedMs,
}: CompletionInput) {
  const { appendHistory } = useHistory();
  // One record per finished run, however often the effect re-runs.
  const recorded = useRef(false);

  useEffect(() => {
    if (!done) {
      recorded.current = false;
      return;
    }
    if (recorded.current) return;
    recorded.current = true;

    const stats = computeStats({
      charsTyped,
      keystrokes,
      errors,
      elapsedMs: activeElapsedMs,
    });
    void appendHistory({
      id: newEntryId(),
      completedAt: Date.now(),
      lessonId: lesson.id,
      title: lesson.title,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      seconds: stats.seconds,
      keystrokes,
    }).then((saved) => {
      if (!saved) recorded.current = false;
    });
  }, [
    activeElapsedMs,
    appendHistory,
    charsTyped,
    done,
    errors,
    keystrokes,
    lesson.id,
    lesson.title,
  ]);
}
