import { keyLesson } from "../key-lesson";
import type { CurriculumUnitSource } from "../types";

export const frontAndShiftedVowelsUnit = {
  id: "vowels-u01-front-and-shifted-vowels",
  track: "vowels",
  title: "Learn visual order and shifted vowels",
  lessons: [
    {
      id: "vowels-u01-front-vowel-order",
      kind: "drill",
      title: "Front vowel ေ order",
      hint: "ေ (Key A - Type ေ before consonant in visual order)",
      introduces: "ေ",
      lines: [
        "မေ နေ လေ ပေ တေ စေ",
        "ဆေ ကေ ခေ ငေ သေ ဟေ",
        "မေမေ နေနေ လေလေ ပေပေ",
        "အေ အေ မေ နေ လေ စေ",
      ],
    },
    keyLesson({
      id: "vowels-u01-key-shift-d-ii",
      output: "ီ",
      keyLabel: "Shift+D · left middle",
      title: "Learn ီ on Shift+D",
      practice: ["နီ မီ ပီ လီ"],
    }),
    keyLesson({
      id: "vowels-u01-key-shift-j-ai",
      output: "ဲ",
      keyLabel: "Shift+J · right index",
      title: "Learn ဲ on Shift+J",
      practice: ["ကဲ ပဲ မဲ လဲ"],
    }),
    keyLesson({
      id: "vowels-u01-key-shift-h-anusvara",
      output: "ံ",
      keyLabel: "Shift+H · right index",
      title: "Learn ံ on Shift+H",
      practice: ["ကံ စံ တံ သံ"],
    }),
    {
      id: "vowels-u01-shifted-vowel-review",
      kind: "drill",
      title: "Shifted vowels and marks",
      hint: "ီ (Shift+D) · ဲ (Shift+J) · ံ (Shift+H)",
      lines: ["နီ မီ ပီ လီ စီ သီ", "ကဲ ပဲ မဲ လဲ နဲ သဲ", "ကံ စံ တံ သံ လံ ပံ", "နီနီ မီမီ ကဲကဲ ပဲပဲ"],
    },
  ],
} satisfies CurriculumUnitSource;
