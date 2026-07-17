import { keyLesson } from "../key-lesson";
import type { CurriculumUnitSource } from "../types";

export const finalsAndReviewUnit = {
  id: "core-u02-finals-and-review",
  track: "core",
  title: "Add marks, finals, and review",
  lessons: [
    keyLesson({
      id: "core-u02-key-h-dot-below",
      output: "့",
      keyLabel: "H · right index",
      title: "Learn ့ on H",
      practice: ["ပါ့ မာ့ လာ့ ကာ့"],
    }),
    keyLesson({
      id: "core-u02-key-semicolon-visarga",
      output: "း",
      keyLabel: "; · right pinky",
      title: "Learn း on semicolon",
      practice: ["ကား မား ပါး လား"],
    }),
    {
      id: "core-u02-tone-mark-review",
      kind: "drill",
      title: "Tone marks (့ and း)",
      hint: "့ (H) · း (;) · Add the final mark after the vowel",
      lines: [
        "ကား မား ပါး လား စား သား",
        "ငါး ခါး နား ထား",
        "ပါ့ မာ့ လာ့ ကာ့",
        "ကား စား သား ငါး ခါး",
      ],
    },
    {
      id: "core-u02-asat-finals",
      kind: "drill",
      title: "Asat final (်)",
      hint: "် (F bump) · Type the final consonant, then return to F",
      introduces: "်",
      lines: [
        "ကန် မန် ပန် လန် စန် ဆန်",
        "တန် ထန် နန် သန် ဟန်",
        "ကင် မင် ပင် လင် စင် ဆင်",
        "ကန် ကင် မန် မင် ပန် ပင်",
      ],
    },
    {
      id: "core-u02-home-row-combinations",
      kind: "drill",
      title: "Home-row combinations",
      hint: "Combine only the vowels and marks introduced in this unit",
      lines: [
        "ကိ ကု ကူ ကာ ကား ကန် ကင်",
        "မိ မု မူ မာ မား မန် မင်",
        "ပိ ပု ပူ ပါ ပါး ပန် ပင်",
        "လိ လု လူ လာ လား လန် လင်",
      ],
    },
    {
      id: "core-u02-vowel-mark-review",
      kind: "drill",
      title: "Vowel and mark review",
      hint: "Keep the consonant first and add each following mark in order",
      lines: [
        "စာ စိ စု စူ စား စန် စင်",
        "သာ သိ သု သူ သား သန် သင်",
        "နာ နိ နု နူ နား နန် နင်",
        "ခါ ခိ ခု ခူ ခါး ခန် ခင်",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
