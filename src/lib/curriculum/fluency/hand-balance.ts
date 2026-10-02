import type { CurriculumUnitSource } from "../types";

export const handBalanceUnit = {
  id: "fluency-u04-hand-balance",
  track: "fluency",
  title: "Build hand balance and flow",
  lessons: [
    {
      id: "fluency-u04-left-hand-precision",
      kind: "drill",
      title: "Left-hand precision",
      hint: "Intensive fluency across left-hand keys across authentic syllables",
      lines: [
        "ကန် မန် ပန် တန် ထန် ခန် ဆန်",
        "ကာ မာ ပါ တာ ထာ ခါ ဆာ",
        "ကိ မိ ပိ တိ ထိ ခိ ဆိ",
        "ကေ မေ ပေ တေ ထေ ခေ ဆေ",
      ],
    },
    {
      id: "fluency-u04-right-hand-precision",
      kind: "drill",
      title: "Right-hand precision",
      hint: "Intensive fluency across right-hand keys across authentic syllables",
      lines: [
        "စာ ည ဟာ သာ လာ ဘာ ငါ",
        "စု နု ဟု သု လု ဘု ငု",
        "စူး နူး ဟူး သူး လူး ဘူး ငူး",
        "စို ညို ဟို သို လို ဘို ငို",
      ],
    },
    {
      id: "fluency-u04-hand-alternation",
      kind: "drill",
      title: "Hand alternation flow",
      hint: "Rapid alternation between left and right hand keystrokes",
      lines: [
        "စားပါ သွားပါ လာပါ နားပါ",
        "ကစားပါ စာဖတ်ပါ စာကျက်ပါ",
        "ကူညီပါ လုပ်ပေးပါ သွားကြည့်ပါ",
        "မင်္ဂလာပါ ကျေးဇူးပါ လာခဲ့ပါ။",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
