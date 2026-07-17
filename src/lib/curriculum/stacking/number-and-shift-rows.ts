import type { CurriculumUnitSource } from "../types";
import { bottomRowKeyLessons } from "./bottom-row-key-lessons";
import { numberRowKeyLessons } from "./number-row-key-lessons";
import { numeralKeyLessons } from "./numeral-key-lessons";
import { topRowKeyLessons } from "./top-row-key-lessons";

export const numberAndShiftRowsUnit = {
  id: "stacking-u02-number-and-shift-rows",
  track: "stacking",
  title: "Cover numerals and Shift rows",
  lessons: [
    ...numeralKeyLessons,
    {
      id: "stacking-u02-numeral-review",
      kind: "drill",
      title: "Myanmar numerals",
      hint: "၁ ၂ ၃ ၄ ၅ ၆ ၇ ၈ ၉ ၀ in everyday counts and dates",
      lines: [
        "၁ ၂ ၃ ၄ ၅ ၆ ၇ ၈ ၉ ၀",
        "စာအုပ် ၁ အုပ် ကလေး ၂ ယောက်",
        "ထမင်း ၃ ပွဲ ကော်ဖီ ၄ ခွက်",
        "နှစ် ၁၉၄၈ ခုနှစ် ၂၀၂၆ ခုနှစ်",
      ],
    },
    ...numberRowKeyLessons,
    {
      id: "stacking-u02-shift-number-review",
      kind: "drill",
      title: "Shift + number row vocabulary",
      hint: "Combine only the Shift-number-row outputs introduced above",
      lines: [
        "ၐ ဎ ဍ ၒ ဋ ၓ ၔ ၕ ရ",
        "ၐ ဍ ဋ ၔ ဎ ၒ ၓ ၕ",
        "ဋ ဍ ဎ ၐ ၕ ၔ ၓ ၒ",
        "ရ ဋ ရ ဍ ရ ဎ ရ ၐ",
      ],
    },
    ...topRowKeyLessons,
    {
      id: "stacking-u02-shift-top-review",
      kind: "drill",
      title: "Shift + upper row vocabulary",
      hint: "ဈ ဝ ဣ ၎ ဤ ၌ ဥ ၍ ဿ ဏ ဧ ဩ ဪ ၑ in context",
      lines: [
        "ဈေး ဝါး ဥပဒေ ဩဘာ ဧည့်သည်",
        "ဣန္ဒြေ ဤသို့ ၌ ၍ ၎င်း",
        "သုတေသန ဝိပဿနာ ဂဏန်း",
        "ဈ ဝ ဣ ၎ ဤ ၌ ဥ ၍ ဿ ဏ ဧ ဩ ဪ ၑ",
      ],
    },
    ...bottomRowKeyLessons,
    {
      id: "stacking-u02-shift-home-review",
      kind: "drill",
      title: "Shift + home row vocabulary",
      hint: "ဗ ှ ီ ္ ွ ံ ဲ ဒ ဓ ဂ across vocabulary and grammar",
      lines: [
        "ဗမာ ဒေါင်း ဓမ္မ ဂုဏ်တော်",
        "ပန်းချီ ကွဲပြား သံဃာတော်",
        "ဓမ္မစကြာ ဗုဒ္ဓဘာသာ ဂုဏ်ကျေးဇူး",
        "ဗ ှ ီ ္ ွ ံ ဲ ဒ ဓ ဂ",
      ],
    },
    {
      id: "stacking-u02-shift-bottom-review",
      kind: "drill",
      title: "Shift + lower row vocabulary",
      hint: "ဇ ဌ ဃ ဠ ယ ဉ ဦ ၊ ။ across vocabulary and grammar",
      lines: [
        "ဇာတ်ကား ဌာန ဃရာဝါသ ဠာ ယုန်",
        "ဉာဏ်ပညာ ဦးလေး ဇာတိ ဌာနေ",
        "ယုန်သူငယ် ဉာဏ်ကောင်းသည်၊ ဦးလေး လာသည်။",
        "ဇ ဌ ဃ ဠ ယ ဉ ဦ ၊ ။",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
