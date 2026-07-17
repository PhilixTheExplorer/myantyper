"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  DEFAULT_TWEAKS,
  loadTweaks,
  normalizeTweaks,
  saveTweaks,
  type Tweaks,
} from "@/lib/storage";
import { MYANMAR_FONTS, THEMES } from "@/lib/themes";

interface Ctx {
  tweaks: Tweaks;
  setTweaks: (next: Partial<Tweaks>) => void;
}

const ThemeCtx = createContext<Ctx | null>(null);

export function useThemeTweaks(): Ctx {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useThemeTweaks must be used inside ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setLocal] = useState<Tweaks>(DEFAULT_TWEAKS);
  // Prevent defaults from overwriting stored tweaks before hydration.
  const persistReady = useRef(false);

  useEffect(() => {
    setLocal(loadTweaks());
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", tweaks.theme);
    const fontStack = MYANMAR_FONTS.find(
      (f) => f.id === tweaks.myanmarFont,
    )?.stack;
    if (fontStack) html.style.setProperty("--mt-font-myanmar", fontStack);

    const accent = THEMES[tweaks.theme].accentPresets[tweaks.accentIndex];
    if (accent) {
      html.style.setProperty("--mt-accent", accent);
      html.style.setProperty("--mt-cursor", accent);
    }

    if (persistReady.current) saveTweaks(tweaks);
    else persistReady.current = true;
  }, [tweaks]);

  function setTweaks(next: Partial<Tweaks>) {
    setLocal((prev) => normalizeTweaks({ ...prev, ...next }));
  }

  return (
    <ThemeCtx.Provider value={{ tweaks, setTweaks }}>
      {children}
      <ThemeVignette />
    </ThemeCtx.Provider>
  );
}

/** Fixed lighting overlay painted on top of every screen. */
function ThemeVignette() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[25]"
      style={{
        background:
          "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,calc(var(--mt-vignette))) 100%)",
      }}
    />
  );
}
