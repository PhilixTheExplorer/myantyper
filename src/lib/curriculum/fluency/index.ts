import { handBalanceUnit } from "./hand-balance";
import { phraseAndSentenceFlowUnit } from "./phrase-and-sentence-flow";
import { skillReviewUnit } from "./skill-review";
import { wordRhythmUnit } from "./word-rhythm";

export const FLUENCY_UNITS = [
  wordRhythmUnit,
  phraseAndSentenceFlowUnit,
  skillReviewUnit,
  handBalanceUnit,
] as const;
