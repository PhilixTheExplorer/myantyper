/** Windows Myanmar (Visual order) keyboard map. */
export interface KeyHint {
  key: string;
  shift: boolean;
}

export interface KeyCap {
  latin: string;
  base: string;
  shifted: string;
}

const cap = (latin: string, base: string, shifted = ""): KeyCap => ({
  latin,
  base,
  shifted,
});

export const KB_ROWS: readonly (readonly KeyCap[])[] = [
  [
    cap("`", "ၐ", "ဎ"),
    cap("1", "၁", "ဍ"),
    cap("2", "၂", "ၒ"),
    cap("3", "၃", "ဋ"),
    cap("4", "၄", "ၓ"),
    cap("5", "၅", "ၔ"),
    cap("6", "၆", "ၕ"),
    cap("7", "၇", "ရ"),
    cap("8", "၈", "*"),
    cap("9", "၉", "("),
    cap("0", "၀", ")"),
  ],
  [
    cap("Q", "ဆ", "ဈ"),
    cap("W", "တ", "ဝ"),
    cap("E", "န", "ဣ"),
    cap("R", "မ", "၎"),
    cap("T", "အ", "ဤ"),
    cap("Y", "ပ", "၌"),
    cap("U", "က", "ဥ"),
    cap("I", "င", "၍"),
    cap("O", "သ", "ဿ"),
    cap("P", "စ", "ဏ"),
    cap("[", "ဟ", "ဧ"),
    cap("]", "ဩ", "ဪ"),
    cap("\\", "၏", "ၑ"),
  ],
  [
    cap("A", "ေ", "ဗ"),
    cap("S", "ျ", "ှ"),
    cap("D", "ိ", "ီ"),
    cap("F", "်", "္"),
    cap("G", "ါ", "ွ"),
    cap("H", "့", "ံ"),
    cap("J", "ြ", "ဲ"),
    cap("K", "ု", "ဒ"),
    cap("L", "ူ", "ဓ"),
    cap(";", "း", "ဂ"),
  ],
  [
    cap("Z", "ဖ", "ဇ"),
    cap("X", "ထ", "ဌ"),
    cap("C", "ခ", "ဃ"),
    cap("V", "လ", "ဠ"),
    cap("B", "ဘ", "ယ"),
    cap("N", "ည", "ဉ"),
    cap("M", "ာ", "ဦ"),
    cap(",", ",", "၊"),
    cap(".", ".", "။"),
    cap("/", "/", "?"),
  ],
] as const;

/** Myanmar code point to physical keystroke. */
export const CHAR_TO_KEY: Record<string, KeyHint> = {
  "၁": { key: "1", shift: false },
  "၂": { key: "2", shift: false },
  "၃": { key: "3", shift: false },
  "၄": { key: "4", shift: false },
  "၅": { key: "5", shift: false },
  "၆": { key: "6", shift: false },
  "၇": { key: "7", shift: false },
  "၈": { key: "8", shift: false },
  "၉": { key: "9", shift: false },
  "၀": { key: "0", shift: false },
  ၐ: { key: "`", shift: false },

  ဆ: { key: "Q", shift: false },
  တ: { key: "W", shift: false },
  န: { key: "E", shift: false },
  မ: { key: "R", shift: false },
  အ: { key: "T", shift: false },
  ပ: { key: "Y", shift: false },
  က: { key: "U", shift: false },
  င: { key: "I", shift: false },
  သ: { key: "O", shift: false },
  စ: { key: "P", shift: false },
  ဟ: { key: "[", shift: false },
  ဩ: { key: "]", shift: false },
  "၏": { key: "\\", shift: false },
  "ေ": { key: "A", shift: false },
  "ျ": { key: "S", shift: false },
  "ိ": { key: "D", shift: false },
  "်": { key: "F", shift: false },
  "ါ": { key: "G", shift: false },
  "့": { key: "H", shift: false },
  "ြ": { key: "J", shift: false },
  "ု": { key: "K", shift: false },
  "ူ": { key: "L", shift: false },
  "း": { key: ";", shift: false },
  ဖ: { key: "Z", shift: false },
  ထ: { key: "X", shift: false },
  ခ: { key: "C", shift: false },
  လ: { key: "V", shift: false },
  ဘ: { key: "B", shift: false },
  ည: { key: "N", shift: false },
  "ာ": { key: "M", shift: false },

  ဍ: { key: "1", shift: true },
  ၒ: { key: "2", shift: true },
  ဋ: { key: "3", shift: true },
  ၓ: { key: "4", shift: true },
  ၔ: { key: "5", shift: true },
  ၕ: { key: "6", shift: true },
  ရ: { key: "7", shift: true },
  ဎ: { key: "`", shift: true },
  ဈ: { key: "Q", shift: true },
  ဝ: { key: "W", shift: true },
  ဣ: { key: "E", shift: true },
  "၎": { key: "R", shift: true },
  ဤ: { key: "T", shift: true },
  "၌": { key: "Y", shift: true },
  ဥ: { key: "U", shift: true },
  "၍": { key: "I", shift: true },
  ဿ: { key: "O", shift: true },
  ဏ: { key: "P", shift: true },
  ဧ: { key: "[", shift: true },
  ဪ: { key: "]", shift: true },
  ၑ: { key: "\\", shift: true },
  ဗ: { key: "A", shift: true },
  "ှ": { key: "S", shift: true },
  "ီ": { key: "D", shift: true },
  "္": { key: "F", shift: true },
  "ွ": { key: "G", shift: true },
  "ံ": { key: "H", shift: true },
  "ဲ": { key: "J", shift: true },
  ဒ: { key: "K", shift: true },
  ဓ: { key: "L", shift: true },
  ဂ: { key: ";", shift: true },
  ဇ: { key: "Z", shift: true },
  ဌ: { key: "X", shift: true },
  ဃ: { key: "C", shift: true },
  ဠ: { key: "V", shift: true },
  ယ: { key: "B", shift: true },
  ဉ: { key: "N", shift: true },
  ဦ: { key: "M", shift: true },
  "၊": { key: ",", shift: true },
  "။": { key: ".", shift: true },

  ",": { key: ",", shift: false },
  ".": { key: ".", shift: false },
  "/": { key: "/", shift: false },
  "?": { key: "/", shift: true },
  "-": { key: "-", shift: false },
  _: { key: "-", shift: true },
  "=": { key: "=", shift: false },
  "+": { key: "=", shift: true },
  "'": { key: "'", shift: false },
  '"': { key: "'", shift: true },
  "*": { key: "8", shift: true },
  "(": { key: "9", shift: true },
  ")": { key: "0", shift: true },

  " ": { key: "SPACE", shift: false },
  "\n": { key: "ENTER", shift: false },
};

export function keyForChar(ch: string): KeyHint {
  return (
    CHAR_TO_KEY[ch] ?? {
      key: ch === " " ? "SPACE" : ch.toUpperCase(),
      shift: false,
    }
  );
}

export function hasKeyForChar(ch: string): boolean {
  return ch in CHAR_TO_KEY;
}

/** Maps `KeyboardEvent.code` to a physical key label. */
const CODE_TO_LABEL: Record<string, string> = {
  Backquote: "`",
  Minus: "-",
  Equal: "=",
  BracketLeft: "[",
  BracketRight: "]",
  Backslash: "\\",
  Semicolon: ";",
  Quote: "'",
  Comma: ",",
  Period: ".",
  Slash: "/",
  Space: "SPACE",
};

export function codeToLabel(code: string): string | null {
  if (code in CODE_TO_LABEL) return CODE_TO_LABEL[code];
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  return null;
}

export type Finger =
  | "l-pinky"
  | "l-ring"
  | "l-middle"
  | "l-index"
  | "r-index"
  | "r-middle"
  | "r-ring"
  | "r-pinky"
  | "thumb";

export type FingerColumn = "pinky" | "ring" | "middle" | "index" | "thumb";

export type Hand = "left" | "right" | "both";

const FINGER_BY_KEY: Record<string, Finger> = {};
const assign = (finger: Finger, keys: string[]) => {
  for (const k of keys) FINGER_BY_KEY[k] = finger;
};

assign("l-pinky", ["`", "1", "Q", "A", "Z"]);
assign("l-ring", ["2", "W", "S", "X"]);
assign("l-middle", ["3", "E", "D", "C"]);
assign("l-index", ["4", "5", "R", "T", "F", "G", "V", "B"]);
assign("r-index", ["6", "7", "Y", "U", "H", "J", "N", "M"]);
assign("r-middle", ["8", "I", "K", ","]);
assign("r-ring", ["9", "O", "L", "."]);
assign("r-pinky", ["0", "-", "=", "P", "[", "]", "\\", ";", "'", "/"]);
assign("thumb", ["SPACE"]);
assign("r-pinky", ["ENTER"]);

export function fingerForKey(key: string): Finger | null {
  return FINGER_BY_KEY[key.toUpperCase()] ?? null;
}

export function fingerParts(finger: Finger): {
  hand: Hand;
  column: FingerColumn;
} {
  if (finger === "thumb") return { hand: "both", column: "thumb" };
  const [side, column] = finger.split("-") as ["l" | "r", FingerColumn];
  return { hand: side === "l" ? "left" : "right", column };
}

const FINGER_NAMES: Record<Finger, string> = {
  "l-pinky": "Left pinky",
  "l-ring": "Left ring",
  "l-middle": "Left middle",
  "l-index": "Left index",
  "r-index": "Right index",
  "r-middle": "Right middle",
  "r-ring": "Right ring",
  "r-pinky": "Right pinky",
  thumb: "Thumb",
};

export function fingerName(finger: Finger): string {
  return FINGER_NAMES[finger];
}

export function fingerLabelForKey(key: string): string | null {
  const finger = fingerForKey(key);
  return finger ? FINGER_NAMES[finger] : null;
}

export const HOME_KEYS: ReadonlySet<string> = new Set([
  "A",
  "S",
  "D",
  "F",
  "J",
  "K",
  "L",
  ";",
]);

export const HOME_BUMP_KEYS: ReadonlySet<string> = new Set(["F", "J"]);
