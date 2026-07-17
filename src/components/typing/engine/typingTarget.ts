import { normalizeMyanmar } from "@/lib/myanmar";
import { visualTypeOrder } from "@/lib/syllable";
import type { ParagraphLine } from "./types";

export interface TypingTarget {
  chars: string[];
  paragraphLines: ParagraphLine[];
  typeOrder: number[];
  stepOf: number[];
}

/** Display text stays canonical Myanmar; `typeOrder` captures visual key order. */
export function createTypingTarget(lines: readonly string[]): TypingTarget {
  const text = normalizeMyanmar(lines.join("\n"));
  const chars = Array.from(text);
  const paragraphLines = createParagraphLines(text);
  const typeOrder = visualTypeOrder(chars);
  const stepOf = new Array<number>(chars.length).fill(-1);

  typeOrder.forEach((charIndex, step) => {
    stepOf[charIndex] = step;
  });

  return { chars, paragraphLines, typeOrder, stepOf };
}

function createParagraphLines(text: string): ParagraphLine[] {
  let start = 0;
  return text.split("\n").map((line) => {
    const paragraphLine = { start, text: line };
    start += Array.from(line).length + 1;
    return paragraphLine;
  });
}
