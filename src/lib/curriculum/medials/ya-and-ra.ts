import type { CurriculumUnitSource } from "../types";

export const yaAndRaUnit = {
  id: "medials-u01-ya-and-ra",
  track: "medials",
  title: "Learn Ya and Ra medials",
  lessons: [
    {
      id: "medials-u01-medial-ya",
      kind: "drill",
      title: "Medial Ya (ျ - Key S)",
      hint: "ကျ ချ ပျ မျ in everyday Burmese words",
      introduces: "ျ",
      lines: [
        "ကျား မျက် ပျော် မျောက်",
        "ချစ် ကျေး ကျောင်း များ ချက်",
        "ကျောင်းသား ပျော်စရာ ချစ်သူ",
        "ပျားများ မျက်စိ ချက်ပါ",
      ],
    },
    {
      id: "medials-u01-medial-ra",
      kind: "drill",
      title: "Medial Ra (ြ - Key J)",
      hint: "ကြ ခြ ပြ မြ in everyday Burmese words",
      introduces: "ြ",
      lines: [
        "ကြား ခြား ပြား မြား မြေ",
        "ကြောင် မြင် ပြင် ကြည့် ကြက်",
        "ကြောင်လေး မြင်သာ ပြင်ဆင်",
        "မြေကြီး ပြားချပ် ကြားနာ",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
