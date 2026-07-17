import { commonShiftKeysUnit } from "./common-shift-keys";
import { frontAndShiftedVowelsUnit } from "./front-and-shifted-vowels";
import { transitionsAndPunctuationUnit } from "./transitions-and-punctuation";

export const VOWEL_UNITS = [
  frontAndShiftedVowelsUnit,
  commonShiftKeysUnit,
  transitionsAndPunctuationUnit,
] as const;
