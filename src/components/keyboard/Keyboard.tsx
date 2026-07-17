"use client";

import type { FingerColumn, KeyCap, KeyHint } from "@/lib/keyboard";
import {
  fingerForKey,
  fingerParts,
  HOME_BUMP_KEYS,
  HOME_KEYS,
  KB_ROWS,
} from "@/lib/keyboard";
import { cn } from "@/lib/utils";

interface Props {
  /** The next keystroke to highlight, or null when idle. */
  highlight: KeyHint | null;
  /** Physical key labels currently held down (uppercase, plus SPACE/SHIFTL/SHIFTR). */
  pressedKeys: Set<string>;
  /** Cap the board's width. It fills its column fluidly up to this. */
  maxWidth?: number;
  /** Render the finger-colour key beneath the board. */
  legend?: boolean;
}

// Shift is pressed with the hand opposite the character key.
const LEFT_KEYS = new Set([
  "`",
  "1",
  "2",
  "3",
  "4",
  "5",
  "Q",
  "W",
  "E",
  "R",
  "T",
  "A",
  "S",
  "D",
  "F",
  "G",
  "Z",
  "X",
  "C",
  "V",
  "B",
]);

type ModRole = "shiftL" | "shiftR" | "enter" | "space" | "backspace";

type Slot =
  | { t: "char"; cap: KeyCap; u: number }
  | {
      t: "mod";
      id: string;
      label: string;
      u: number;
      role?: ModRole;
      align?: "left" | "right" | "center";
    };

const char = (cap: KeyCap, u = 1): Slot => ({ t: "char", cap, u });
const mod = (
  id: string,
  label: string,
  u: number,
  extra: { role?: ModRole; align?: "left" | "right" | "center" } = {},
): Slot => ({ t: "mod", id, label, u, ...extra });

// Every row must total 15u to align with the shared 60-track grid.
function buildRows(): Slot[][] {
  const [num, top, home, bottom] = KB_ROWS;
  return [
    [
      ...num.map((c) => char(c)),
      char({ latin: "-", base: "-", shifted: "_" }),
      char({ latin: "=", base: "=", shifted: "+" }),
      mod("bksp", "Bksp", 2, { role: "backspace", align: "right" }),
    ],
    [
      mod("tab", "Tab", 1.5, { align: "left" }),
      ...top.map((c, i) => char(c, i === top.length - 1 ? 1.5 : 1)),
    ],
    [
      mod("caps", "Caps", 1.75, { align: "left" }),
      ...home.map((c) => char(c)),
      char({ latin: "'", base: "'", shifted: '"' }),
      mod("enter", "Enter", 2.25, { role: "enter", align: "right" }),
    ],
    [
      mod("shiftL", "⇧ Shift", 2.25, { role: "shiftL", align: "left" }),
      ...bottom.map((c) => char(c)),
      mod("shiftR", "Shift ⇧", 2.75, { role: "shiftR", align: "right" }),
    ],
    [
      mod("ctrlL", "Ctrl", 1.5, { align: "left" }),
      mod("winL", "Win", 1.25, { align: "center" }),
      mod("altL", "Alt", 1.25, { align: "center" }),
      mod("space", "", 6.25, { role: "space" }),
      mod("altR", "Alt", 1.25, { align: "center" }),
      mod("fn", "Fn", 1, { align: "center" }),
      mod("menu", "Menu", 1, { align: "center" }),
      mod("ctrlR", "Ctrl", 1.5, { align: "right" }),
    ],
  ];
}

const LEGEND: { column: FingerColumn; label: string }[] = [
  { column: "pinky", label: "Pinky" },
  { column: "ring", label: "Ring" },
  { column: "middle", label: "Middle" },
  { column: "index", label: "Index" },
  { column: "thumb", label: "Thumb" },
];

export function Keyboard({
  highlight,
  pressedKeys,
  maxWidth,
  legend = false,
}: Props) {
  const highlightKey = highlight?.key ?? null;
  const shiftActive = !!highlight?.shift;
  const activeShiftSide =
    shiftActive && highlightKey
      ? LEFT_KEYS.has(highlightKey.toUpperCase())
        ? "R"
        : "L"
      : null;

  const rows = buildRows();

  return (
    <div className="flex flex-col gap-2">
      <div
        className="mt-surface mt-kb-frame"
        style={maxWidth ? { maxWidth } : undefined}
        // Key hints are announced elsewhere; hide the visual keyboard.
        aria-hidden
      >
        <div className="mt-kb">
          {rows.map((row) => (
            <div
              key={row
                .map((s) => (s.t === "char" ? s.cap.latin : s.id))
                .join("-")}
              className="mt-kb-row"
            >
              {row.map((slot) => {
                if (slot.t === "char") {
                  const active = highlightKey?.toUpperCase() === slot.cap.latin;
                  return (
                    <Keycap
                      key={slot.cap.latin}
                      cap={slot.cap}
                      span={slot.u * 4}
                      active={active}
                      needsShift={active && shiftActive}
                      pressed={pressedKeys.has(slot.cap.latin.toUpperCase())}
                    />
                  );
                }
                const { active, pressed } = modState(
                  slot.role,
                  highlightKey,
                  activeShiftSide,
                  pressedKeys,
                );
                return (
                  <ModKey
                    key={slot.id}
                    label={slot.label}
                    span={slot.u * 4}
                    align={slot.align ?? "center"}
                    active={active}
                    pressed={pressed}
                    role={slot.role}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {legend && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs tracking-widest uppercase text-ink-soft">
          {LEGEND.map((item) => (
            <span key={item.column} className="flex items-center gap-1.5">
              <span
                className="mt-kb-legend-dot"
                style={
                  {
                    "--kb-finger": `var(--mt-finger-${item.column})`,
                  } as React.CSSProperties
                }
              />
              {item.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/** Resolve active/pressed state for a structural key from its role. */
function modState(
  role: ModRole | undefined,
  highlightKey: string | null,
  activeShiftSide: "L" | "R" | null,
  pressedKeys: Set<string>,
): { active: boolean; pressed: boolean } {
  switch (role) {
    case "shiftL":
      return {
        active: activeShiftSide === "L",
        pressed: pressedKeys.has("SHIFTL"),
      };
    case "shiftR":
      return {
        active: activeShiftSide === "R",
        pressed: pressedKeys.has("SHIFTR"),
      };
    case "enter":
      return { active: highlightKey === "ENTER", pressed: false };
    case "space":
      return {
        active: highlightKey === "SPACE",
        pressed: pressedKeys.has("SPACE"),
      };
    case "backspace":
      return { active: false, pressed: pressedKeys.has("Backspace") };
    default:
      return { active: false, pressed: false };
  }
}

/** The finger column a physical key belongs to, as a `data-finger` value. */
function fingerAttr(key: string): FingerColumn | undefined {
  const finger = fingerForKey(key);
  return finger ? fingerParts(finger).column : undefined;
}

function Keycap({
  cap,
  span,
  active,
  needsShift,
  pressed,
}: {
  cap: KeyCap;
  span: number;
  active: boolean;
  needsShift: boolean;
  pressed: boolean;
}) {
  const primary = needsShift && cap.shifted ? cap.shifted : cap.base;
  const isHome = HOME_KEYS.has(cap.latin);

  return (
    <div
      className="mt-kb-key"
      style={{ gridColumn: `span ${span}` }}
      data-finger={fingerAttr(cap.latin)}
      data-active={active}
      data-pressed={pressed}
      data-home={isHome}
      data-bump={HOME_BUMP_KEYS.has(cap.latin)}
    >
      <span className="mt-kb-latin">{cap.latin}</span>
      {cap.shifted && !needsShift && (
        <span className="mt-kb-shifted">{cap.shifted}</span>
      )}
      {needsShift && <span className="mt-kb-shift-badge">⇧</span>}
      <span className="mt-kb-glyph">{primary}</span>
    </div>
  );
}

function ModKey({
  label,
  span,
  align,
  active,
  pressed,
  role,
}: {
  label: string;
  span: number;
  align: "left" | "right" | "center";
  active: boolean;
  pressed: boolean;
  role?: ModRole;
}) {
  // Omit finger colors from structural keys that are not taught.
  const finger =
    role === "space"
      ? "thumb"
      : role === "enter" || role === "shiftL" || role === "shiftR"
        ? "pinky"
        : undefined;

  return (
    <div
      className={cn(
        "mt-kb-key mt-kb-mod",
        align === "left" && "mt-kb-mod-left",
        align === "right" && "mt-kb-mod-right",
      )}
      style={{ gridColumn: `span ${span}` }}
      data-finger={finger}
      data-active={active}
      data-pressed={pressed}
    >
      {label}
    </div>
  );
}
