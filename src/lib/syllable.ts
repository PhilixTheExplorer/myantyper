const COMBINING_START = 0x102b;
const COMBINING_END = 0x103e;
const ASAT = 0x103a;
const VIRAMA = 0x1039;
const E_VOWEL = 0x1031;

export function isCombiningMark(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return c >= COMBINING_START && c <= COMBINING_END;
}

export function isBaseLetter(ch: string): boolean {
  const c = ch.codePointAt(0) ?? 0;
  return c >= 0x1000 && c <= 0x102a;
}

export function nextSyllableEnd(
  chars: readonly string[],
  start: number,
): number {
  const n = chars.length;
  if (start >= n) return n;

  const first = chars[start];
  if (first === " " || first === "\n") return start + 1;

  let i = start + 1;
  while (i < n) {
    const ch = chars[i];
    const cp = ch.codePointAt(0) ?? 0;

    if (isCombiningMark(ch)) {
      i++;
      if (cp === VIRAMA && i < n && isBaseLetter(chars[i])) i++;
      continue;
    }
    if (
      isBaseLetter(ch) &&
      i + 1 < n &&
      (chars[i + 1].codePointAt(0) ?? 0) === ASAT
    ) {
      i += 2;
      continue;
    }
    break;
  }
  return i;
}

export function segmentSyllables(chars: readonly string[]): [number, number][] {
  const ranges: [number, number][] = [];
  let i = 0;
  while (i < chars.length) {
    const end = nextSyllableEnd(chars, i);
    ranges.push([i, end]);
    i = end;
  }
  return ranges;
}

export function syllableAt(
  chars: readonly string[],
  pos: number,
): [number, number] {
  let i = 0;
  while (i < chars.length) {
    const end = nextSyllableEnd(chars, i);
    if (pos < end) return [i, end];
    i = end;
  }
  return [chars.length, chars.length];
}

/** Returns KBDMYAN input indexes, moving ေ before its syllable. */
export function visualTypeOrder(chars: readonly string[]): number[] {
  const order: number[] = [];
  for (const [start, end] of segmentSyllables(chars)) {
    let eIndex = -1;
    for (let i = start; i < end; i++) {
      if ((chars[i].codePointAt(0) ?? 0) === E_VOWEL) {
        eIndex = i;
        break;
      }
    }
    if (eIndex !== -1) {
      order.push(eIndex);
      for (let i = start; i < end; i++) if (i !== eIndex) order.push(i);
    } else {
      for (let i = start; i < end; i++) order.push(i);
    }
  }
  return order;
}
