import { keyLesson } from "../key-lesson";

const bottomRowKeys = [
  ["ဌ", "shift-x", "Shift+X"],
  ["ဃ", "shift-c", "Shift+C"],
  ["ဠ", "shift-v", "Shift+V"],
  ["ဉ", "shift-n", "Shift+N"],
  ["ဦ", "shift-m", "Shift+M"],
] as const;

export const bottomRowKeyLessons = bottomRowKeys.map(
  ([output, slug, keyLabel]) =>
    keyLesson({
      id: `stacking-u02-key-${slug}`,
      output,
      keyLabel: `${keyLabel} · bottom row`,
      title: `Learn ${output} on ${keyLabel}`,
    }),
);
