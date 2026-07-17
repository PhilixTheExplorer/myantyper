import { keyLesson } from "../key-lesson";

const numberRowKeys = [
  ["ၐ", "backquote", "`"],
  ["ဎ", "shift-backquote", "Shift+`"],
  ["ဍ", "shift-1", "Shift+1"],
  ["ၒ", "shift-2", "Shift+2"],
  ["ဋ", "shift-3", "Shift+3"],
  ["ၓ", "shift-4", "Shift+4"],
  ["ၔ", "shift-5", "Shift+5"],
  ["ၕ", "shift-6", "Shift+6"],
] as const;

export const numberRowKeyLessons = numberRowKeys.map(
  ([output, slug, keyLabel]) =>
    keyLesson({
      id: `stacking-u02-key-${slug}`,
      output,
      keyLabel: `${keyLabel} · number row`,
      title: `Learn ${output} on ${keyLabel}`,
    }),
);
