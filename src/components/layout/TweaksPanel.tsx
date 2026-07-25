"use client";

import { cva } from "class-variance-authority";
import { Settings, X } from "lucide-react";
import { MYANMAR_FONTS, THEMES, type ThemeId } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { useThemeTweaks } from "../providers/ThemeProvider";
import { HeaderPopover } from "./HeaderPopover";

const toggleButton = cva("mt-action border flex items-center justify-center", {
  variants: {
    active: {
      true: "bg-accent text-accent-ink border-accent",
      false: "mt-action-outline border-border-soft text-ink-soft",
    },
  },
});

const fontChoice = cva("mt-action min-w-0 border p-1.5 text-left", {
  variants: {
    selected: {
      true: "bg-accent text-accent-ink border-accent",
      false: "mt-action-outline border-border-soft bg-surface-2 text-ink-soft",
    },
  },
});

const themeChoice = cva(
  "mt-action min-w-0 border p-1.5 text-left bg-surface-2",
  {
    variants: {
      selected: {
        true: "border-accent text-ink shadow-[inset_0_0_0_1px_var(--mt-accent)]",
        false: "mt-action-outline border-border-soft text-ink-soft",
      },
    },
  },
);

export function TweaksPanel() {
  const { tweaks, setTweaks } = useThemeTweaks();
  const accentList = THEMES[tweaks.theme].accentPresets;

  return (
    <HeaderPopover
      trigger={({ open, toggle, panelId }) => (
        <button
          type="button"
          onClick={toggle}
          aria-label={open ? "Close tweaks panel" : "Open tweaks panel"}
          aria-expanded={open}
          aria-controls={panelId}
          className={toggleButton({
            active: open,
            className: "w-10 h-10 sm:w-8 sm:h-8",
          })}
        >
          <Settings size={16} />
        </button>
      )}
    >
      {({ close }) => (
        <>
          <header className="flex justify-between items-center mb-3">
            <div className="mt-eyebrow">Tweaks</div>
            <button
              type="button"
              onClick={close}
              aria-label="Close tweaks"
              className="mt-action mt-action-quiet w-6 h-6 flex items-center justify-center text-ink-soft"
            >
              <X size={14} />
            </button>
          </header>

          <Section label="Aesthetic" />
          <fieldset className="mb-2">
            <legend className="text-xs text-ink-soft mb-1">Theme</legend>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(THEMES).map((theme) => (
                <ThemeChoice
                  key={theme.id}
                  theme={theme}
                  selected={tweaks.theme === theme.id}
                  onSelect={() =>
                    setTweaks({ theme: theme.id, accentIndex: 0 })
                  }
                />
              ))}
            </div>
          </fieldset>
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
          <div className="mb-2">
            <div className="text-xs text-ink-soft mb-1">Myanmar font</div>
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
        </>
      )}
    </HeaderPopover>
  );
}

function ThemeChoice({
  theme,
  selected,
  onSelect,
}: {
  theme: (typeof THEMES)[ThemeId];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={themeChoice({ selected })}
    >
      <span
        className="mb-1 flex h-5 items-center gap-1 border px-1.5"
        style={{
          background: theme.isDark ? "#101114" : "#f1e7d0",
          borderColor: theme.accentPresets[0],
        }}
        aria-hidden="true"
      >
        {theme.accentPresets.map((color) => (
          <span
            key={color}
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: color }}
          />
        ))}
      </span>
      <span className="block truncate text-xs">{theme.name}</span>
    </button>
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
    <div className="mt-eyebrow mt-2 mb-1.5 pt-1.5 border-t border-dashed border-border-soft">
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
