import type { CurriculumUnitSource } from "../types";

export const phraseAndSentenceFlowUnit = {
  id: "fluency-u02-phrase-and-sentence-flow",
  track: "fluency",
  title: "Extend rhythm into sentences",
  lessons: [
    {
      id: "fluency-u02-two-syllable-pace",
      kind: "drill",
      title: "Two-syllable cadence",
      hint: "Smooth rhythm across common two-syllable words",
      lines: [
        "ကျောင်းသား ကလေး စာအုပ် ထမင်း",
        "ဆရာ မိခင် ဖခင် တပည့်",
        "စာရေး စာဖတ် ကစား နားလည်",
        "ကောင်းကင် မြေကြီး နေရောင်",
      ],
    },
    {
      id: "fluency-u02-three-syllable-flow",
      kind: "drill",
      title: "Three-syllable flow",
      hint: "Even pacing across compound words and expressions",
      lines: [
        "ကျေးဇူးတင် နေကောင်းလား စာအုပ်ဆိုင်",
        "ကျောင်းဆရာ ကလေးငယ် စာရေးသူ",
        "သွားပါမယ် လာပါမယ် စာဖတ်မယ်",
        "ကစားကွင်း စာကြည့်တိုက် နေဝင်ချိန်",
      ],
    },
    {
      id: "fluency-u02-sentence-rhythm",
      kind: "drill",
      title: "Complete sentence cadence",
      hint: "Full sentences with natural spacing and punctuation",
      lines: [
        "ကျွန်တော် စာကျက်သည်။",
        "မမ ထမင်းချက်သည်။",
        "ကလေးငယ် ကစားသည်။",
        "ဆရာမ စာသင်ပေးသည်။",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
