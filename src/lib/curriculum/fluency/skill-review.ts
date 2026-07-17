import type { CurriculumUnitSource } from "../types";

export const skillReviewUnit = {
  id: "fluency-u03-skill-review",
  track: "fluency",
  title: "Review vowels, reaches, and patterns",
  lessons: [
    {
      id: "fluency-u03-vowel-review",
      kind: "drill",
      title: "Vowel & mark review",
      hint: "ေ  ိ  ီ  ု  ူ  ဲ  ံ  ာ း across vocabulary",
      lines: ["မေမေ နီနီ", "စာအုပ် ကူညီ", "မုန့် စိမ်း", "နို့ ကောင်း", "စာရေး စာဖတ်"],
    },
    {
      id: "fluency-u03-reach-review",
      kind: "drill",
      title: "Key reach review",
      hint: "Index, middle, ring & pinky reaches across rows",
      lines: ["ဆရာ တပည့်", "ဖခင် မိခင်", "ကလေး စာဖတ်", "ထမင်း စား", "မမ နီနီ"],
    },
    {
      id: "fluency-u03-pattern-review",
      kind: "drill",
      title: "Pattern review",
      hint: "ျ  ြ  ွ  ှ  ် combinations in real words",
      lines: [
        "ကျား ကြောင် ခွေး မြင်း",
        "ချစ်ခြင်း မေတ္တာ",
        "ကွင်း ကျယ် မြက်ခင်း",
        "မြန်မာ စာအုပ်",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
