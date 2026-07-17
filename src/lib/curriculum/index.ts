import { CORE_UNITS } from "./core";
import { FLUENCY_UNITS } from "./fluency";
import { FOUNDATION_UNITS } from "./foundation";
import { MEDIAL_UNITS } from "./medials";
import { STACKING_UNITS } from "./stacking";
import { VOWEL_UNITS } from "./vowels";

export const CURRICULUM_UNIT_SOURCES = [
  ...FOUNDATION_UNITS,
  ...CORE_UNITS,
  ...VOWEL_UNITS,
  ...MEDIAL_UNITS,
  ...STACKING_UNITS,
  ...FLUENCY_UNITS,
] as const;
