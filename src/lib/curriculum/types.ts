export type Track =
  | "foundation"
  | "core"
  | "vowels"
  | "medials"
  | "stacking"
  | "fluency";

export type LessonKind = "drill";

export interface LessonSource {
  id: string;
  kind: LessonKind;
  title?: string;
  hint?: string;
  /** The single new keyboard output taught by this lesson. Omit for reviews. */
  introduces?: string;
  lines: string[];
}

export interface CurriculumUnitSource {
  id: string;
  track: Track;
  title: string;
  lessons: readonly LessonSource[];
}
