"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { lessonNeighbors } from "@/lib/lessons";
import type { TypingSessionProps } from "../engine/types";
import { useTypingSession } from "../hooks/useTypingSession";
import {
  TypingSessionComplete,
  TypingSessionHeader,
  TypingSessionPractice,
} from "./TypingSessionView";

export function TypingSession({
  lesson,
  exitHref = "/lessons",
  exitLabel = "Exit",
}: TypingSessionProps) {
  const router = useRouter();
  const session = useTypingSession(lesson);
  const neighbors = lessonNeighbors(lesson.id);
  const nextLessonId = neighbors?.next?.id;

  useEffect(() => {
    if (!session.done) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.repeat ||
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        isInteractiveTarget(event.target)
      ) {
        return;
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        session.restart();
        return;
      }

      if (event.key === "Enter" && exitHref !== "/free") {
        event.preventDefault();
        router.push(nextLessonId ? `/practice/${nextLessonId}` : "/lessons");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [exitHref, nextLessonId, router, session.done, session.restart]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <TypingSessionHeader
        lesson={lesson}
        exitHref={exitHref}
        exitLabel={exitLabel}
        session={session}
      />
      {session.done ? (
        <TypingSessionComplete
          lesson={lesson}
          exitHref={exitHref}
          exitLabel={exitLabel}
          neighbors={neighbors}
          session={session}
        />
      ) : (
        <TypingSessionPractice session={session} />
      )}
    </div>
  );
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  return (
    target instanceof Element &&
    target.closest("a, button, input, textarea, select, [contenteditable]") !==
      null
  );
}
