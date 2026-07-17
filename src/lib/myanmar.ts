const MYANMAR_RANGE = /[က-႟]/;

// Heuristic Zawgyi-only code points.
const ZAWGYI_SIGNAL = /[ဳဴဵၤၩ-ၭ႐-႗]/;

export function normalizeMyanmar(text: string): string {
  return text.replace(/\u200b/g, "").normalize("NFC");
}

export function hasMyanmar(text: string): boolean {
  return MYANMAR_RANGE.test(text);
}

export function looksLikeZawgyi(text: string): boolean {
  return hasMyanmar(text) && ZAWGYI_SIGNAL.test(text);
}
