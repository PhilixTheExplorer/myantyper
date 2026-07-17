import { keyLesson } from "../key-lesson";

const topRowKeys = [
  ["ဈ", "shift-q", "Shift+Q"],
  ["ဣ", "shift-e", "Shift+E"],
  ["၎", "shift-r", "Shift+R"],
  ["ဤ", "shift-t", "Shift+T"],
  ["၌", "shift-y", "Shift+Y"],
  ["ဥ", "shift-u", "Shift+U"],
  ["၍", "shift-i", "Shift+I"],
  ["ဿ", "shift-o", "Shift+O"],
  ["ဏ", "shift-p", "Shift+P"],
  ["ဧ", "shift-left-bracket", "Shift+["],
  ["ဪ", "shift-right-bracket", "Shift+]"],
  ["ၑ", "shift-backslash", "Shift+\\"],
] as const;

export const topRowKeyLessons = topRowKeys.map(([output, slug, keyLabel]) =>
  keyLesson({
    id: `stacking-u02-key-${slug}`,
    output,
    keyLabel: `${keyLabel} · top row`,
    title: `Learn ${output} on ${keyLabel}`,
  }),
);
