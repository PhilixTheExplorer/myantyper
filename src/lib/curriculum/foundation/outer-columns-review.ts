import { keyLesson } from "../key-lesson";
import type { CurriculumUnitSource } from "../types";

export const outerColumnsReviewUnit = {
  id: "foundation-u02-outer-columns-review",
  track: "foundation",
  title: "Reach, repeat, and review",
  lessons: [
    keyLesson({
      id: "foundation-u02-key-q-hsa",
      output: "ဆ",
      keyLabel: "Q · left pinky",
      title: "Learn ဆ on Q",
      practice: ["တ ဆ န ဆ မ ဆ"],
    }),
    keyLesson({
      id: "foundation-u02-key-z-pha",
      output: "ဖ",
      keyLabel: "Z · left pinky",
      title: "Learn ဖ on Z",
      practice: ["ဆ ဖ တ ဖ လ ဖ"],
    }),
    keyLesson({
      id: "foundation-u02-key-p-sa",
      output: "စ",
      keyLabel: "P · right pinky",
      title: "Learn စ on P",
      practice: ["ဖ စ ဆ စ သ စ"],
    }),
    keyLesson({
      id: "foundation-u02-key-bracket-ha",
      output: "ဟ",
      keyLabel: "[ · right pinky",
      title: "Learn ဟ on [",
      practice: ["စ ဟ ဆ ဟ သ ဟ"],
    }),
    keyLesson({
      id: "foundation-u02-key-bracket-au",
      output: "ဩ",
      keyLabel: "] · right pinky",
      title: "Learn ဩ on ]",
      practice: ["ဟ ဩ စ ဩ အ ဩ"],
    }),
    keyLesson({
      id: "foundation-u02-key-backslash-of",
      output: "၏",
      keyLabel: "\\ · right pinky",
      title: "Learn ၏ on backslash",
      practice: ["ဩ ၏ ဟ ၏ အ ၏"],
    }),
    {
      id: "foundation-u02-pinky-review",
      kind: "drill",
      title: "Pinky consonants (Q Z P [ ] \\)",
      hint: "ဆ ဖ စ ဟ ဩ ၏ · Learn the outer columns without combinations",
      lines: [
        "ဆ ဖ စ ဟ ဩ ၏",
        "ဆ ဆ ဖ ဖ စ စ ဟ ဟ",
        "ဩ ၏ ဩ ၏ ဆ ဖ စ ဟ",
        "ဟ စ ဖ ဆ ၏ ဩ ဆ စ",
      ],
    },
    {
      id: "foundation-u02-column-rhythm",
      kind: "drill",
      title: "Consonant column rhythm",
      hint: "Move vertically by finger, then return to the home row",
      lines: [
        "မ အ လ ဘ န ခ တ ထ ဆ ဖ",
        "ပ က ည င သ စ ဟ ဩ",
        "ဆ တ န မ အ ပ က စ သ င",
        "ဖ ထ ခ လ ဘ ည ဟ ဩ ၏",
      ],
    },
    {
      id: "foundation-u02-cumulative-review",
      kind: "drill",
      title: "Consonant key review",
      hint: "All unshifted consonants, still without vowel combinations",
      lines: [
        "ဆ တ န မ အ ပ က င သ စ",
        "ဟ ဩ ၏ ဖ ထ ခ လ ဘ ည",
        "က ခ င စ ဆ ည တ ထ န",
        "ပ ဖ ဘ မ လ သ ဟ အ",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
