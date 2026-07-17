import { describe, expect, it } from "vitest";
import { CHAR_TO_KEY } from "./keyboard";
import {
  CURRICULUM_UNITS,
  LESSON_TRACKS,
  LESSONS,
  lessonNeighbors,
  unitsByTrack,
} from "./lessons";

describe("lesson content", () => {
  it("uses only code points present in the keyboard map", () => {
    const offenders: string[] = [];
    for (const lesson of LESSONS) {
      for (const line of lesson.lines) {
        for (const ch of Array.from(line)) {
          if (ch === " " || ch === "\n") continue;
          if (!(ch in CHAR_TO_KEY)) {
            offenders.push(
              `${lesson.id} "${line}" → ${ch} (U+${(ch.codePointAt(0) ?? 0)
                .toString(16)
                .toUpperCase()
                .padStart(4, "0")})`,
            );
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("has unique lesson ids", () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("finds adjacent lessons in flattened curriculum order", () => {
    const first = lessonNeighbors(LESSONS[0].id);
    const last = lessonNeighbors(LESSONS.at(-1)?.id ?? "");

    expect(first?.previous).toBeUndefined();
    expect(first?.next).toBe(LESSONS[1]);
    expect(last?.previous).toBe(LESSONS.at(-2));
    expect(last?.next).toBeUndefined();
    expect(lessonNeighbors("not-a-lesson")).toBeUndefined();
  });

  it("continues lesson navigation across track boundaries", () => {
    const boundary = LESSONS.findIndex(
      (lesson, index) => index > 0 && lesson.track !== LESSONS[index - 1].track,
    );

    expect(boundary).toBeGreaterThan(0);
    expect(lessonNeighbors(LESSONS[boundary - 1].id)?.next).toBe(
      LESSONS[boundary],
    );
  });

  it("names every lesson for its owning track and unit", () => {
    for (const lesson of LESSONS) {
      expect(lesson.id).toMatch(new RegExp(`^${lesson.track}-u\\d{2}-`));
    }
  });

  it("declares every track used by a lesson", () => {
    const declared = new Set(LESSON_TRACKS.map((track) => track.id));
    for (const lesson of LESSONS) {
      expect(declared.has(lesson.track)).toBe(true);
    }
  });

  it("uses the independent skill-track progression", () => {
    expect(LESSON_TRACKS.map((track) => track.id)).toEqual([
      "foundation",
      "core",
      "vowels",
      "medials",
      "stacking",
      "fluency",
    ]);
    for (const track of LESSON_TRACKS) {
      expect(unitsByTrack(track.id).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("has unique unit ids and consistent lesson ownership", () => {
    const unitIds = CURRICULUM_UNITS.map((unit) => unit.id);
    expect(new Set(unitIds).size).toBe(unitIds.length);
    for (const unit of CURRICULUM_UNITS) {
      for (const lesson of unit.lessons) {
        expect(lesson.unitId).toBe(unit.id);
        expect(lesson.unitTitle).toBe(unit.title);
      }
    }
  });

  it("covers every mapped Myanmar glyph in the curriculum", () => {
    const isMyanmar = (char: string) =>
      /^[\u1000-\u109F\uAA60-\uAA7F]$/u.test(char);
    const covered = new Set(
      CURRICULUM_UNITS.flatMap((unit) =>
        unit.lessons.flatMap((lesson) =>
          lesson.lines.flatMap((line) => Array.from(line).filter(isMyanmar)),
        ),
      ),
    );
    const missing = Object.keys(CHAR_TO_KEY).filter(
      (char) => isMyanmar(char) && !covered.has(char),
    );
    expect(missing).toEqual([]);
  });

  it("introduces one keyboard output at a time before combining it", () => {
    const known = new Set([" ", "\n"]);
    const premature: string[] = [];

    for (const lesson of LESSONS) {
      if (lesson.introduces) {
        expect(Array.from(lesson.introduces)).toHaveLength(1);
        expect(lesson.introduces in CHAR_TO_KEY).toBe(true);
        expect(known.has(lesson.introduces)).toBe(false);
        known.add(lesson.introduces);
        expect(
          lesson.lines.some((line) =>
            Array.from(line).includes(lesson.introduces ?? ""),
          ),
          `${lesson.id} should practise ${lesson.introduces}`,
        ).toBe(true);
      }

      for (const line of lesson.lines) {
        for (const char of Array.from(line)) {
          if (!known.has(char)) premature.push(`${lesson.id} → ${char}`);
        }
      }
    }

    expect(premature).toEqual([]);
    expect(Object.keys(CHAR_TO_KEY).filter((char) => !known.has(char))).toEqual(
      [],
    );
  });
});
