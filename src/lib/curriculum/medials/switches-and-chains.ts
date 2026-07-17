import type { CurriculumUnitSource } from "../types";

export const switchesAndChainsUnit = {
  id: "medials-u03-switches-and-chains",
  track: "medials",
  title: "Practise medial switches and chains",
  lessons: [
    {
      id: "medials-u03-ya-ra-switches",
      kind: "drill",
      title: "Ya vs Ra medial switch",
      hint: "Rapid distinction between Ya (ျ) and Ra (ြ) across vocabulary words",
      lines: [
        "ကျား ကြား ချား ခြား ပျား ပြား",
        "ကျေး ကြေး ချေး ခြေး ပျေး ပြေး",
        "ကျောက် ကြောက် မျက် မြက်",
        "ကျောင်းသား ကြောင်လေး များပြား",
      ],
    },
    {
      id: "medials-u03-vowel-medial-chains",
      kind: "drill",
      title: "Medial & vowel combinations",
      hint: "Combining medials with front vowels and tone marks (ကျောင်း ခြောင်း)",
      lines: [
        "ကျောင်း ကြောင်း ချောင်း ခြောင်း",
        "ကျေး ကြေး ချေး ခြေး မွေး ပြေး",
        "ကျယ် ကြယ် ချယ် ခြယ် ပျယ် ပြယ်",
        "ကျက် ကြက် ချက် ခြက် ပျက် ပြက်",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
