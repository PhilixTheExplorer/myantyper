import { describe, expect, it } from "vitest";
import {
  nextSyllableEnd,
  segmentSyllables,
  syllableAt,
  visualTypeOrder,
} from "./syllable";

function syllables(text: string): string[] {
  const chars = Array.from(text);
  return segmentSyllables(chars).map(([s, e]) => chars.slice(s, e).join(""));
}

function typed(text: string): string {
  const chars = Array.from(text);
  return visualTypeOrder(chars)
    .map((i) => chars[i])
    .join("");
}

describe("segmentSyllables", () => {
  it("keeps a final consonant + asat in the same syllable", () => {
    // မြန် = onset မြ + coda န killed by asat → one syllable
    expect(syllables("မြန်")).toEqual(["မြန်"]);
  });

  it("groups medials, vowels and tones onto the onset", () => {
    expect(syllables("ကျောင်း")).toEqual(["ကျောင်း"]);
  });

  it("binds a virama-stacked consonant into one syllable", () => {
    expect(syllables("မ္မ")).toEqual(["မ_မ".replace("_", "္")]);
  });

  it("splits a two-syllable word at the next onset", () => {
    // ကွဲ | ပွဲ  (medial wa + vowel each)
    expect(syllables("ကွဲပွဲ")).toEqual(["ကွဲ", "ပွဲ"]);
  });

  it("treats spaces as their own unit", () => {
    expect(syllables("က ခ")).toEqual(["က", " ", "ခ"]);
  });
});

describe("syllableAt / nextSyllableEnd", () => {
  it("returns the enclosing range for any inner position", () => {
    const chars = Array.from("မြန်"); // 4 code points, one syllable
    expect(syllableAt(chars, 0)).toEqual([0, 4]);
    expect(syllableAt(chars, 2)).toEqual([0, 4]);
    expect(syllableAt(chars, 3)).toEqual([0, 4]);
  });

  it("advances index by exactly one syllable", () => {
    const chars = Array.from("ကွဲပွဲ");
    const end = nextSyllableEnd(chars, 0);
    expect(chars.slice(0, end).join("")).toBe("ကွဲ");
  });
});

describe("visualTypeOrder", () => {
  it("types ေ before its consonant", () => {
    // ဖေ is stored ဖ ေ but keyed ေ then ဖ
    expect(typed("ဖေ")).toBe("ေဖ");
  });

  it("keeps the aa after the consonant in ကော", () => {
    // ကော = က ေ ာ  →  ေ က ာ
    expect(typed("ကော")).toBe("ေကာ");
  });

  it("puts ေ before the consonant but medial after it", () => {
    // ကျေ = က ျ ေ  →  ေ က ျ
    expect(typed("ကျေ")).toBe("ေကျ");
  });

  it("leaves syllables without ေ untouched", () => {
    expect(typed("မြန်")).toBe("မြန်");
  });

  it("reorders each syllable independently", () => {
    // နေ | ကောင်း  →  ေန | ေကာင်း
    expect(typed("နေကောင်း")).toBe("ေနေကာင်း");
  });

  it("returns a permutation covering every index once", () => {
    const chars = Array.from("ကောင်းသွားမေ");
    const order = visualTypeOrder(chars);
    expect(order.slice().sort((a, b) => a - b)).toEqual(chars.map((_, i) => i));
  });
});
