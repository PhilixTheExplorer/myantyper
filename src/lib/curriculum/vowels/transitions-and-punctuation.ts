import { keyLesson } from "../key-lesson";
import type { CurriculumUnitSource } from "../types";

export const transitionsAndPunctuationUnit = {
  id: "vowels-u03-transitions-and-punctuation",
  track: "vowels",
  title: "Practise transitions and punctuation",
  lessons: [
    keyLesson({
      id: "vowels-u03-key-shift-comma",
      output: "၊",
      keyLabel: "Shift+comma · right middle",
      title: "Learn ၊ on Shift+comma",
    }),
    keyLesson({
      id: "vowels-u03-key-shift-period",
      output: "။",
      keyLabel: "Shift+period · right ring",
      title: "Learn ။ on Shift+period",
    }),
    {
      id: "vowels-u03-punctuation-review",
      kind: "drill",
      title: "Myanmar punctuation",
      hint: "၊ (Shift+comma) · ။ (Shift+period) · Release Shift after each mark",
      lines: [
        "မေမေ၊ ကိုကို၊ နီနီ၊ လီလီ။",
        "စာလာပါ။ လူလာပါ။",
        "ဗမာစာ၊ ဝါစာ။",
        "ဒါပါ၊ ဟာပါ၊ လာပါ။",
      ],
    },
    {
      id: "vowels-u03-front-vowel-transitions",
      kind: "drill",
      title: "Front vowel across hands",
      hint: "Type ေ first, then reach to consonants with either hand",
      lines: [
        "မေ နေ လေ ပေ တေ စေ",
        "ရေ ဝေ ယေ ဒေ",
        "မေမေ နေနေ လေလေ ရေရေ",
        "စာရေးပါ။ ရေလာပါ။",
      ],
    },
    {
      id: "vowels-u03-shift-timing",
      kind: "drill",
      title: "Shift press and release timing",
      hint: "Use the opposite hand for Shift and release it before the next key",
      lines: [
        "ဗ ဝ ဇ ရ ယ ဒ ဓ ဂ",
        "နီ မဲ ကံ ဗမာ ဝါး ရေ",
        "မေမေ၊ နီနီ၊ လီလီ။",
        "ဗမာစာ ရေးပါ။",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
