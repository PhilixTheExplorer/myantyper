import { keyLesson } from "../key-lesson";

const numeralKeys = [
  ["၁", "1"],
  ["၂", "2"],
  ["၃", "3"],
  ["၄", "4"],
  ["၅", "5"],
  ["၆", "6"],
  ["၇", "7"],
  ["၈", "8"],
  ["၉", "9"],
  ["၀", "0"],
] as const;

export const numeralKeyLessons = numeralKeys.map(([output, key]) =>
  keyLesson({
    id: `stacking-u02-key-${key}-numeral`,
    output,
    keyLabel: `${key} · number row`,
    title: `Learn ${output} on ${key}`,
  }),
);
