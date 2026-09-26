"use client";

import { cva } from "class-variance-authority";
import { ArrowRight, ChevronDown } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AppLink } from "@/components/ui/AppLink";
import { StampSeal } from "@/components/ui/StampSeal";
import {
  LESSON_TRACKS,
  type Lesson,
  lessonKindLabel,
  unitsByTrack,
} from "@/lib/lessons";
import type { LessonHistoryStat } from "@/lib/progress/types";
import { cn } from "@/lib/utils";
import { useHistory } from "../providers/HistoryProvider";

const trackTab = cva("mt-action shrink-0 border px-3 py-2 text-xs", {
  variants: {
    active: {
      true: "border-accent bg-accent text-accent-ink",
      false: "mt-action-outline border-border-soft text-ink-soft",
    },
  },
});

export function LessonBoard() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { overview } = useHistory();
  const stats = overview.lessonStats;

  const selectedTrack =
    LESSON_TRACKS.find((track) => track.id === searchParams.get("track")) ??
    LESSON_TRACKS[0];
  const units = unitsByTrack(selectedTrack.id);
  const lessons = units.flatMap((unit) => unit.lessons);
  const done = lessons.filter((lesson) => stats.has(lesson.id)).length;
  const progress = lessons.length > 0 ? (done / lessons.length) * 100 : 0;
  const nextLesson = lessons.find((lesson) => !stats.has(lesson.id));
  const suggestedUnit =
    units.find((unit) =>
      unit.lessons.some((lesson) => !stats.has(lesson.id)),
    ) ?? units[0];
  const requestedUnitId = searchParams.get("unit");
  const expandedUnitId =
    requestedUnitId === "closed"
      ? null
      : (units.find((unit) => unit.id === requestedUnitId)?.id ??
        suggestedUnit?.id ??
        null);

  function replaceCataloguePosition(trackId: string, unitId?: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("track", trackId);
    if (unitId) params.set("unit", unitId);
    else params.delete("unit");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <section className="mb-12">
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {LESSON_TRACKS.map((track) => {
          const active = track.id === selectedTrack.id;
          return (
            <button
              className={trackTab({ active })}
              key={track.id}
              onClick={() => replaceCataloguePosition(track.id)}
              type="button"
            >
              {track.label}
            </button>
          );
        })}
      </div>

      <div className="mt-surface mb-5 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="mt-eyebrow mb-1">
              {units.length} units · {lessons.length} lessons
            </div>
            <h2 className="mt-display text-2xl text-ink leading-none">
              {selectedTrack.label}
            </h2>
          </div>
          <div className="sm:text-right">
            <div className="text-xs tracking-widest">
              <span className={done > 0 ? "text-accent" : "text-ink-soft"}>
                {done}
              </span>
              <span className="text-ink-soft"> / {lessons.length} DONE</span>
            </div>
            <div className="mt-2 h-1.5 w-full border border-border-soft bg-surface-2 sm:w-48">
              <div
                className="h-full bg-accent"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <p className="mt-3 max-w-190 text-xs leading-relaxed text-ink-soft">
          {selectedTrack.blurb}
        </p>
      </div>

      {nextLesson && (
        <AppLink
          className="group mb-6 grid grid-cols-[4px_1fr] border border-border-soft bg-surface transition-colors hover:border-accent hover:bg-surface-2"
          href={`/practice/${nextLesson.id}`}
        >
          <span aria-hidden="true" className="bg-accent" />
          <div className="flex min-w-0 flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="min-w-0">
              <div className="mt-eyebrow mb-1 text-accent">NEXT LESSON</div>
              <div className="mt-display truncate text-xl text-ink">
                {nextLesson.title}
              </div>
              {nextLesson.hint && (
                <div className="mt-1 truncate text-xs text-ink-soft">
                  {nextLesson.hint}
                </div>
              )}
            </div>
            <span className="inline-flex shrink-0 items-center justify-center gap-2 self-start border border-accent bg-accent px-4 py-2 text-xs tracking-widest text-accent-ink uppercase transition-colors group-hover:bg-transparent group-hover:text-accent group-focus-visible:bg-transparent group-focus-visible:text-accent sm:self-auto">
              Start lesson
              <ArrowRight
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
                size={16}
              />
            </span>
          </div>
        </AppLink>
      )}

      <div className="space-y-3">
        {units.map((unit, unitIndex) => {
          const unitDone = unit.lessons.filter((lesson) =>
            stats.has(lesson.id),
          ).length;
          const open = expandedUnitId === unit.id;

          return (
            <section className="border border-border-soft" key={unit.id}>
              <button
                aria-expanded={open}
                className="mt-action mt-action-quiet flex w-full items-center justify-between gap-4 px-4 py-3 text-left focus-visible:bg-surface-2 sm:px-5"
                onClick={() =>
                  replaceCataloguePosition(
                    selectedTrack.id,
                    open ? "closed" : unit.id,
                  )
                }
                type="button"
              >
                <div className="min-w-0">
                  <div className="mt-eyebrow mb-1">
                    UNIT {String(unitIndex + 1).padStart(2, "0")}
                  </div>
                  <h3 className="mt-display text-xl leading-tight text-ink">
                    {unit.title}
                  </h3>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-xs tracking-widest text-ink-soft">
                  <span>
                    {unitDone} / {unit.lessons.length} DONE
                  </span>
                  <ChevronDown
                    className={cn("transition-transform", open && "rotate-180")}
                    size={16}
                  />
                </div>
              </button>
              {open && (
                <div className="border-t border-border-soft p-3 sm:p-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {unit.lessons.map((lesson) => (
                      <LessonCard
                        key={lesson.id}
                        lesson={lesson}
                        stat={stats.get(lesson.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </section>
  );
}

function LessonCard({
  lesson,
  stat,
}: {
  lesson: Lesson;
  stat: LessonHistoryStat | undefined;
}) {
  const done = stat !== undefined;
  const kind = lessonKindLabel(lesson.kind);
  const lessonLabel = `${kind} ${lesson.kindNumber}`;

  return (
    <AppLink
      href={`/practice/${lesson.id}`}
      className={cn(
        "mt-surface relative block p-3.5 transition-[background-color,border-color,transform] hover:-translate-y-0.5 hover:border-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:bg-surface-2",
        done && "border-accent",
      )}
    >
      {stat && (
        <div className="absolute top-2 right-3 z-10">
          <StampSeal
            primary="DONE"
            secondary={`${stat.best} WPM\n${stat.bestAcc.toFixed(0)}% ACC`}
            rotate={-6}
            size={68}
          />
        </div>
      )}
      <div className={cn(stat && "min-h-17 pr-19")}>
        <div className="mt-eyebrow mb-2 min-h-4">{lessonLabel}</div>
        {lesson.title !== lessonLabel && (
          <div className="mt-display mb-1 truncate py-0.5 text-base leading-normal text-ink">
            {lesson.title}
          </div>
        )}
        {lesson.hint && (
          <div className="mb-2 truncate text-xs text-ink-soft">
            {lesson.hint}
          </div>
        )}
      </div>
      <div className="mt-myanmar min-h-13.5 border-t border-dashed border-border-soft pt-2.5 text-xl leading-snug text-ink line-clamp-2">
        {lesson.lines[0]}
      </div>
    </AppLink>
  );
}
