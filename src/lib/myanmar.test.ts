import { describe, expect, it } from "vitest";
import { hasMyanmar, looksLikeZawgyi, normalizeMyanmar } from "./myanmar";

describe("normalizeMyanmar", () => {
  it("returns NFC-normalized text unchanged when already canonical", () => {
    const s = "မြန်မာစာ";
    expect(normalizeMyanmar(s)).toBe(s.normalize("NFC"));
  });

  it("leaves ASCII untouched", () => {
    expect(normalizeMyanmar("hello")).toBe("hello");
  });

  it("strips zero-width spaces (U+200B) used for word segmentation", () => {
    const zwsp = String.fromCodePoint(0x200b);
    const s = `မြန်မာ${zwsp}စာ`;
    const out = normalizeMyanmar(s);
    expect(out).toBe("မြန်မာစာ");
    expect([...out].some((c) => c.codePointAt(0) === 0x200b)).toBe(false);
  });
});

describe("hasMyanmar", () => {
  it("detects Myanmar code points", () => {
    expect(hasMyanmar("မြန်မာ")).toBe(true);
  });
  it("is false for pure ASCII", () => {
    expect(hasMyanmar("abc 123")).toBe(false);
  });
});

describe("looksLikeZawgyi", () => {
  it("does not flag clean Unicode Burmese", () => {
    // A normal Unicode sentence with kinzi, medials, stacking.
    expect(looksLikeZawgyi("မင်္ဂလာပါ ကျွန်တော် ဒုက္ခ")).toBe(false);
  });

  it("does not flag non-Myanmar text", () => {
    expect(looksLikeZawgyi("just latin text")).toBe(false);
  });

  it("flags Burmese text containing Zawgyi-signal code points", () => {
    // U+1064 is Zawgyi's kinzi carrier; Unicode never uses it in Burmese.
    const zawgyiish = `က${String.fromCodePoint(0x1064)}`;
    expect(looksLikeZawgyi(zawgyiish)).toBe(true);
  });

  it("flags a repurposed Mon second-storey vowel (U+1034)", () => {
    const zawgyiish = `က${String.fromCodePoint(0x1034)}`;
    expect(looksLikeZawgyi(zawgyiish)).toBe(true);
  });
});
