import type { LessonSource } from "./types";

export function keyLesson({
  id,
  output,
  keyLabel,
  title,
  practice = [],
}: {
  id: string;
  output: string;
  keyLabel: string;
  title: string;
  practice?: readonly string[];
}): LessonSource {
  if (Array.from(output).length !== 1) {
    throw new Error(`Key lesson ${id} must introduce exactly one code point`);
  }

  return {
    id,
    kind: "drill",
    title,
    hint: `${output} (${keyLabel}) · Learn this key before combining it`,
    introduces: output,
    lines: [
      `${output} ${output} ${output} ${output} ${output} ${output}`,
      ...practice,
    ],
  };
}
