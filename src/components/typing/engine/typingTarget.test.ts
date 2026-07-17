import { describe, expect, it } from "vitest";
import { createTypingTarget } from "./typingTarget";

describe("createTypingTarget", () => {
  it("keeps canonical display order while deriving visual key order", () => {
    const target = createTypingTarget(["ဖေ"]);

    expect(target.chars).toEqual(["ဖ", "ေ"]);
    expect(target.typeOrder).toEqual([1, 0]);
    expect(target.stepOf).toEqual([1, 0]);
  });

  it("tracks paragraph offsets by Unicode code point", () => {
    const target = createTypingTarget(["က", "ခ"]);

    expect(target.paragraphLines).toEqual([
      { start: 0, text: "က" },
      { start: 2, text: "ခ" },
    ]);
  });
});
