import type { CurriculumUnitSource } from "../types";

export const waAndHaUnit = {
  id: "medials-u02-wa-and-ha",
  track: "medials",
  title: "Add shifted Wa and Ha medials",
  lessons: [
    {
      id: "medials-u02-medial-wa",
      kind: "drill",
      title: "Medial Wa (ွ - Shift+G)",
      hint: "ကွ ခွ ပွ မွ in everyday Burmese words",
      introduces: "ွ",
      lines: [
        "ကွဲ ပွဲ ခွဲ မွေး ခွေး ကွေး",
        "ကျွဲ မွေး ကြွက် ရွက် ကွပ်",
        "ပွဲတော် မွေးနေ့ ခွေးလေး",
        "ခွဲဝေ ကျွဲကော မွေးနေ့",
      ],
    },
    {
      id: "medials-u02-medial-ha",
      kind: "drill",
      title: "Medial Ha (ှ - Shift+S)",
      hint: "မှ နှ လှ in everyday Burmese words",
      introduces: "ှ",
      lines: [
        "မှန် နှစ် လှ မှာ နှာ",
        "မှု မြှင့် လွှတ် မှား လှေ",
        "မှန်ကန် လှပ နှစ်ဆ မှာကြား",
        "နှာခေါင်း မှားယွင်း လှေကား",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
