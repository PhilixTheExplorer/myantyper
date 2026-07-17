import type { CurriculumUnitSource } from "../types";

export const codasAndStacksUnit = {
  id: "stacking-u01-codas-and-stacks",
  track: "stacking",
  title: "Build codas and stacked forms",
  lessons: [
    {
      id: "stacking-u01-final-tone-review",
      kind: "drill",
      title: "Final consonants & tones",
      hint: "် (Key F) · ့ (H) · း (;) · ံ (Shift+H) in vocabulary",
      lines: [
        "ကန် ဆန် ဝင် တက် လက် ခက်",
        "ကား စား မှား ပါ့ မာ့ နေ့",
        "ကောင်း မှန် ချစ် ချမ်းသာ",
        "ထမင်း ဟင်းလျာ စာအုပ်ဆိုင်",
      ],
    },
    {
      id: "stacking-u01-virama-stacks",
      kind: "drill",
      title: "Stacked consonants (္ - Shift+F)",
      hint: "္ (Shift+F to stack under consonant in authentic words)",
      introduces: "္",
      lines: [
        "ဒုက္ခ ပစ္စည်း ကမ္ဘာ သိပ္ပံ",
        "မင်္ဂလာ သစ္စာ မေတ္တာ ဝိဇ္ဇာ",
        "ကမ္ဘာကြီး ဒုက္ခ မင်္ဂလာပါ",
        "သစ္စာရှိ မေတ္တာထား ပစ္စည်းများ",
      ],
    },
    {
      id: "stacking-u01-asat-word-building",
      kind: "drill",
      title: "Asat final syllables",
      hint: "Building final consonant sounds with Asat (်) across common codas",
      lines: [
        "ကန် ကင် ကတ် ကပ် ကက်",
        "မန် မင် မတ် မပ် မက်",
        "ပန် ပင် ပတ် ပပ် ပက်",
        "တန် တင် တတ် တပ် တက်",
      ],
    },
    {
      id: "stacking-u01-kinzi-stacking-review",
      kind: "drill",
      title: "Kinzi & stacked words",
      hint: "Advanced practice with kinzi (င်္) and stacked consonants (္) in context",
      lines: [
        "မင်္ဂလာ သစ္စာ ဗုဒ္ဓ ကမ္ဘာ ပစ္စည်း",
        "သိပ္ပံ ဝိဇ္ဇာ ပညာ မင်္ဂလာ",
        "မေတ္တာ ပညာ မင်္ဂလာ",
        "သစ္စာ ကမ္ဘာ ပစ္စည်း သိပ္ပံ",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
