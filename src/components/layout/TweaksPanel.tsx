"use client";

import { cva } from "class-variance-authority";
import { Settings, X } from "lucide-react";
import { useState } from "react";
import { MYANMAR_FONTS, THEMES, type ThemeId } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { useThemeTweaks } from "../providers/ThemeProvider";

const toggleButton = cva("mt-action border flex items-center justify-center", {
  variants: {
    active: {
      true: "bg-accent text-accent-ink border-accent",
      false: "mt-action-outline border-border-soft text-ink-soft",
    },
  },
});

const fontChoice = cva("mt-action min-w-0 border p-2 text-left", {
  variants: {
    selected: {
      true: "bg-accent text-accent-ink border-accent",
      false: "mt-action-outline border-border-soft bg-surface-2 text-ink-soft",
    },
  },
});

export function TweaksPanel() {
  const { tweaks, setTweaks } = useThemeTweaks();
  const [open, setOpen] = useState(false);
  const accentList = THEMES[tweaks.theme].accentPresets;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={open ? "Close tweaks panel" : "Open tweaks panel"}
        aria-expanded={open}
        className={toggleButton({
          active: open,
          className: "w-10 h-10 sm:w-8 sm:h-8",
        })}
      >
        <Settings size={16} />
      </button>
      {open && (
        <aside className="absolute right-0 top-12 sm:top-10 w-[min(300px,calc(100vw-2rem))] mt-surface p-5 z-50 backdrop-blur-sm">
          <header className="flex justify-between items-center mb-4">
            <div className="mt-eyebrow">Tweaks</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close tweaks"
              className="mt-action mt-action-quiet w-6 h-6 flex items-center justify-center text-ink-soft"
            >
              <X size={14} />
            </button>
          </header>

          <Section label="Aesthetic" />
          <Row label="Theme">
            <select
              value={tweaks.theme}
              onChange={(e) =>
                setTweaks({
                  theme: e.target.value as ThemeId,
                  accentIndex: 0,
                })
              }
              className="w-full bg-transparent border border-border-soft px-2 py-1 text-xs text-ink"
            >
              {Object.values(THEMES).map((th) => (
                <option key={th.id} value={th.id}>
                  {th.name}
                </option>
              ))}
            </select>
          </Row>
          <Row label="Accent">
            <div className="flex gap-2">
              {accentList.map((color, i) => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setTweaks({ accentIndex: i })}
                  aria-label={`Accent ${i + 1}`}
                  className={cn(
                    "mt-action w-6 h-6 border hover:scale-110",
                    tweaks.accentIndex === i
                      ? "border-ink"
                      : "border-border-soft hover:border-accent",
                  )}
                  style={{ background: color }}
                />
              ))}
            </div>
          </Row>

          <Section label="Typography" />
          <div className="mb-3">
            <div className="text-xs text-ink-soft mb-2">Myanmar font</div>
            <div className="grid grid-cols-2 gap-2">
              {MYANMAR_FONTS.map((font) => (
                <MyanmarFontChoice
                  key={font.id}
                  font={font}
                  selected={tweaks.myanmarFont === font.id}
                  onSelect={() => setTweaks({ myanmarFont: font.id })}
                />
              ))}
            </div>
          </div>

          <Section label="Audio" />
          <Row label="Typewriter clicks">
            <input
              type="checkbox"
              checked={tweaks.sound}
              onChange={(e) => setTweaks({ sound: e.target.checked })}
            />
          </Row>
        </aside>
      )}
    </div>
  );
}

function MyanmarFontChoice({
  font,
  selected,
  onSelect,
}: {
  font: (typeof MYANMAR_FONTS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={fontChoice({ selected })}
    >
      <span className="block truncate text-xs tracking-widest uppercase">
        {font.label}
      </span>
      <span
        lang="en"
        className="block mt-1 text-xs"
        style={{ fontFamily: font.stack }}
      >
        Aa Bb
      </span>
      <span
        lang="my"
        className="block mt-0.5 text-base leading-none"
        style={{ fontFamily: font.stack }}
      >
        မြန်မာစာ
      </span>
    </button>
  );
}

function Section({ label }: { label: string }) {
  return (
    <div className="mt-eyebrow mt-3 mb-2 pt-2 border-t border-dashed border-border-soft">
      {label}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 mb-2">
      <div className="text-xs text-ink-soft">{label}</div>
      <div className="flex-1 max-w-37.5">{children}</div>
    </div>
  );
}
