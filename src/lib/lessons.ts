import { CURRICULUM_UNIT_SOURCES } from "./curriculum";
import type {
  CurriculumUnitSource,
  LessonKind,
  LessonSource,
  Track,
} from "./curriculum/types";

export interface Lesson extends Omit<LessonSource, "title"> {
  title: string;
  track: Track;
  unitId: string;
  unitTitle: string;
  kindNumber: number;
}

export interface CurriculumUnit extends Omit<CurriculumUnitSource, "lessons"> {
  lessons: readonly Lesson[];
}

export interface LessonNeighbors {
  previous: Lesson | undefined;
  next: Lesson | undefined;
}

const UNIT_SOURCES: readonly CurriculumUnitSource[] = CURRICULUM_UNIT_SOURCES;

export const CURRICULUM_UNITS: readonly CurriculumUnit[] = UNIT_SOURCES.map(
  (unit) => ({
    ...unit,
    lessons: unit.lessons.map((lesson, unitIndex) => {
      const kindNumber = unit.lessons
        .slice(0, unitIndex + 1)
        .filter((item) => item.kind === lesson.kind).length;
      return {
        ...lesson,
        title: lesson.title ?? lessonKindLabel(lesson.kind),
        track: unit.track,
        unitId: unit.id,
        unitTitle: unit.title,
        kindNumber,
      };
    }),
  }),
);

export const LESSONS: readonly Lesson[] = CURRICULUM_UNITS.flatMap(
  (unit) => unit.lessons,
);

export const LESSON_TRACKS: { id: Track; label: string; blurb: string }[] = [
  {
    id: "foundation",
    label: "Keyboard Foundations",
    blurb:
      "Build physical-key habits with finger zones, unshifted consonants, and controlled reach drills.",
  },
  {
    id: "core",
    label: "Core Myanmar",
    blurb:
      "Combine common consonants with simple vowels, marks, and short syllable patterns.",
  },
  {
    id: "vowels",
    label: "Vowel Building",
    blurb:
      "Practise front-vowel visual order, shifted vowels, tones, punctuation, and smooth transitions.",
  },
  {
    id: "medials",
    label: "Medials and Joined Forms",
    blurb:
      "Build Ya, Ra, Wa, and Ha medial combinations without adding several new movements at once.",
  },
  {
    id: "stacking",
    label: "Codas and Stacking",
    blurb:
      "Handle final consonants, asat, virama stacks, kinzi, rare outputs, numerals, and complete-keyboard checks.",
  },
  {
    id: "fluency",
    label: "Sentences and Fluency",
    blurb:
      "Develop steady spacing, phrase rhythm, sentence accuracy, hand balance, and continuous typing.",
  },
];

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}

export function lessonNeighbors(id: string): LessonNeighbors | undefined {
  const index = LESSONS.findIndex((lesson) => lesson.id === id);
  if (index === -1) return undefined;

  return {
    previous: LESSONS[index - 1],
    next: LESSONS[index + 1],
  };
}

export function lessonsByTrack(track: Track): Lesson[] {
  return LESSONS.filter((lesson) => lesson.track === track);
}

export function firstLessonByTrack(track: Track): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.track === track);
}

export function unitsByTrack(track: Track): CurriculumUnit[] {
  return CURRICULUM_UNITS.filter((unit) => unit.track === track);
}

export function lessonKindLabel(kind: LessonKind): string {
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

export function trackLabel(track: Track): string {
  return LESSON_TRACKS.find((item) => item.id === track)?.label ?? track;
}
