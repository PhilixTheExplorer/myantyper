import type { CurriculumUnitSource } from "../types";

export const wordRhythmUnit = {
  id: "fluency-u01-word-rhythm",
  track: "fluency",
  title: "Build word and spacing rhythm",
  lessons: [
    {
      id: "fluency-u01-everyday-words",
      kind: "drill",
      title: "Everyday vocabulary",
      hint: "Common words with smooth spacing cadence",
      lines: ["မေမေ လာ", "ကိုကို လာ", "သူ စာစား", "စာ လာပါ", "မမ စာစား"],
    },
    {
      id: "fluency-u01-word-cadence",
      kind: "drill",
      title: "Repetition cadence",
      hint: "Maintain even cadence across repeated words",
      lines: ["မေမေ မေမေ", "ကိုကို ကိုကို", "သူ သူ", "စာစား စာစား", "မမ လာ"],
    },
    {
      id: "fluency-u01-fluent-phrases",
      kind: "drill",
      title: "Fluent phrases",
      hint: "Complete phrases and punctuation rhythm",
      lines: [
        "မင်္ဂလာပါ နေကောင်းလား",
        "ကျေးဇူးတင်ပါတယ်။",
        "စာဖတ်ပါ။ စာရေးပါ။",
        "ကိုကို ကျောင်းသို့ သွားပါ။",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
