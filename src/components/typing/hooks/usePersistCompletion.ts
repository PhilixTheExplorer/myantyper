import { useEffect } from "react";
import type { Lesson } from "@/lib/lessons";
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

  useEffect(() => {
    if (!done) return;
    const stats = computeStats({
      charsTyped,
      keystrokes,
      errors,
      elapsedMs: activeElapsedMs,
    });
    appendHistory({
      date: new Date().toISOString(),
      lessonId: lesson.id,
      title: lesson.title,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      seconds: stats.seconds,
      keystrokes,
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
