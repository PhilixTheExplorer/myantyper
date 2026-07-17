import { keyLesson } from "../key-lesson";
import type { CurriculumUnitSource } from "../types";

export const commonShiftKeysUnit = {
  id: "vowels-u02-common-shift-keys",
  track: "vowels",
  title: "Build common Shift-key control",
  lessons: [
    keyLesson({
      id: "vowels-u02-key-shift-a-ba",
      output: "ဗ",
      keyLabel: "Shift+A · left pinky",
      title: "Learn ဗ on Shift+A",
    }),
    keyLesson({
      id: "vowels-u02-key-shift-w-wa",
      output: "ဝ",
      keyLabel: "Shift+W · left ring",
      title: "Learn ဝ on Shift+W",
    }),
    keyLesson({
      id: "vowels-u02-key-shift-z-za",
      output: "ဇ",
      keyLabel: "Shift+Z · left pinky",
      title: "Learn ဇ on Shift+Z",
    }),
    {
      id: "vowels-u02-left-shift-review",
      kind: "drill",
      title: "Common Shift consonants: Left side",
      hint: "ဗ (Shift+A) · ဝ (Shift+W) · ဇ (Shift+Z), using the right Shift key",
      lines: ["ဗ ဝ ဇ ဗ ဝ ဇ", "ဗ ဗ ဝ ဝ ဇ ဇ", "ဗာ ဝါ ဇာ", "ဗိ ဝိ ဇိ ဗု ဝု ဇု"],
    },
    keyLesson({
      id: "vowels-u02-key-shift-7-ra",
      output: "ရ",
      keyLabel: "Shift+7 · right index",
      title: "Learn ရ on Shift+7",
    }),
    keyLesson({
      id: "vowels-u02-key-shift-b-ya",
      output: "ယ",
      keyLabel: "Shift+B · left index",
      title: "Learn ယ on Shift+B",
    }),
    keyLesson({
      id: "vowels-u02-key-shift-k-da",
      output: "ဒ",
      keyLabel: "Shift+K · right middle",
      title: "Learn ဒ on Shift+K",
    }),
    keyLesson({
      id: "vowels-u02-key-shift-l-dha",
      output: "ဓ",
      keyLabel: "Shift+L · right ring",
      title: "Learn ဓ on Shift+L",
    }),
    keyLesson({
      id: "vowels-u02-key-shift-semicolon-ga",
      output: "ဂ",
      keyLabel: "Shift+; · right pinky",
      title: "Learn ဂ on Shift+semicolon",
    }),
    {
      id: "vowels-u02-right-shift-review",
      kind: "drill",
      title: "Common Shift consonants: Right side",
      hint: "ရ ယ ဒ ဓ ဂ · Use the left Shift key for right-hand outputs",
      lines: [
        "ရ ယ ဒ ဓ ဂ",
        "ရ ရ ယ ယ ဒ ဒ ဓ ဓ ဂ ဂ",
        "ရာ ယာ ဒါ ဓာ ဂါ",
        "ရိ ယိ ဒိ ဓိ ဂိ",
      ],
    },
    {
      id: "vowels-u02-common-shift-words",
      kind: "drill",
      title: "Common Shift words",
      hint: "Use the new Shift consonants with previously learned vowels and marks",
      lines: ["ဗမာ ဝါး ယုန် ရေ", "ဒါ ဓား ဂီတ ဇာတ်", "ဝါ ဝိ ဝု ဝူ ဝဲ", "ရာ ရိ ရု ရူ ရဲ ရေ"],
    },
  ],
} satisfies CurriculumUnitSource;
