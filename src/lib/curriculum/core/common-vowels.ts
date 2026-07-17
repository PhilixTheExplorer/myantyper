import { keyLesson } from "../key-lesson";
import type { CurriculumUnitSource } from "../types";

export const commonVowelsUnit = {
  id: "core-u01-common-vowels",
  track: "core",
  title: "Build common vowel patterns",
  lessons: [
    keyLesson({
      id: "core-u01-key-m-aa",
      output: "ာ",
      keyLabel: "M · right index",
      title: "Learn ာ on M",
      practice: ["ကာ မာ လာ စာ"],
    }),
    keyLesson({
      id: "core-u01-key-g-tall-aa",
      output: "ါ",
      keyLabel: "G · left index",
      title: "Learn ါ on G",
      practice: ["ခါ ငါ ခါ ငါ"],
    }),
    {
      id: "core-u01-aa-vowel-review",
      kind: "drill",
      title: "Long a vowels (ာ and ါ)",
      hint: "ာ (M) · ါ (G) · Add one vowel to known consonants",
      lines: [
        "ကာ မာ ပါ လာ ဘာ စာ",
        "ဆာ တာ နာ သာ ဟာ ဖာ",
        "ခါ ငါ ခါ ငါ",
        "ကာ မာ ပါ လာ ခါ ငါ",
      ],
    },
    {
      id: "core-u01-short-i",
      kind: "drill",
      title: "Short i vowel (ိ)",
      hint: "ိ (D) · Return to the middle-finger home key",
      introduces: "ိ",
      lines: ["ကိ မိ ပိ လိ စိ ဆိ", "တိ ထိ နိ သိ ခိ ငိ", "ကိ မိ ပိ လိ နိ သိ", "စာ မိ နာ သိ လာ"],
    },
    keyLesson({
      id: "core-u01-key-k-u",
      output: "ု",
      keyLabel: "K · right middle",
      title: "Learn ု on K",
      practice: ["ကု မု ပု လု"],
    }),
    keyLesson({
      id: "core-u01-key-l-uu",
      output: "ူ",
      keyLabel: "L · right ring",
      title: "Learn ူ on L",
      practice: ["ကူ မူ ပူ လူ"],
    }),
    {
      id: "core-u01-u-vowel-review",
      kind: "drill",
      title: "U vowels (ု and ူ)",
      hint: "ု (K) · ူ (L) · Alternate the right middle and ring fingers",
      lines: ["ကု မု ပု လု စု သု", "ကူ မူ ပူ လူ စူ သူ", "ကု ကူ မု မူ ပု ပူ", "လူ သူ ပူ စူ ကူ"],
    },
  ],
} satisfies CurriculumUnitSource;
