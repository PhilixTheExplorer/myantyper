import { keyLesson } from "../key-lesson";

const symbolKeys = [
  [",", "comma", "comma"],
  [".", "period", "period"],
  ["/", "slash", "slash"],
  ["?", "shift-slash", "Shift+slash"],
  ["-", "minus", "minus"],
  ["_", "shift-minus", "Shift+minus"],
  ["=", "equals", "equals"],
  ["+", "shift-equals", "Shift+equals"],
  ["'", "quote", "quote"],
  ['"', "shift-quote", "Shift+quote"],
  ["*", "shift-8", "Shift+8"],
  ["(", "shift-9", "Shift+9"],
  [")", "shift-0", "Shift+0"],
] as const;

export const symbolKeyLessons = symbolKeys.map(([output, slug, keyLabel]) =>
  keyLesson({
    id: `stacking-u04-key-${slug}`,
    output,
    keyLabel,
    title: `Learn ${output} on ${keyLabel}`,
  }),
);
