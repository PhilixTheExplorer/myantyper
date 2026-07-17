import type { CurriculumUnitSource } from "../types";
import { symbolKeyLessons } from "./symbol-key-lessons";

export const symbolCheckpointUnit = {
  id: "stacking-u04-symbol-checkpoint",
  track: "stacking",
  title: "Complete the keyboard checkpoint",
  lessons: [
    ...symbolKeyLessons,
    {
      id: "stacking-u04-symbol-review",
      kind: "drill",
      title: "Symbols & Latin numbers check",
      hint: "All remaining keyboard symbol outputs covered across real contexts",
      lines: [
        "/ ? - _ = + ' \" * ( )",
        "မေးခွန်း? အပေါင်း + အနှုတ် - ညီမျှခြင်း =",
        "ခွင်းစ ( ခွင်းပ ) ကြယ်ပွင့် *",
        "အဖော် ' မိတ်ဆွေ \" စာကြောင်း /",
      ],
    },
  ],
} satisfies CurriculumUnitSource;
