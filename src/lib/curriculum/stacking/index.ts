import { codasAndStacksUnit } from "./codas-and-stacks";
import { consonantFamiliesUnit } from "./consonant-families";
import { numberAndShiftRowsUnit } from "./number-and-shift-rows";
import { symbolCheckpointUnit } from "./symbol-checkpoint";

export const STACKING_UNITS = [
  codasAndStacksUnit,
  numberAndShiftRowsUnit,
  consonantFamiliesUnit,
  symbolCheckpointUnit,
] as const;
