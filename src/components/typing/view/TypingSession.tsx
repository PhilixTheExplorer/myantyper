"use client";

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
  const session = useTypingSession(lesson);
  const neighbors = lessonNeighbors(lesson.id);

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
