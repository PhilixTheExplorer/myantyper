export type ThemeId = "paper" | "phosphor" | "foundry" | "amber";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  blurb: string;
  isDark: boolean;
  accentPresets: string[];
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  paper: {
    id: "paper",
    name: "Aged Paper",
    blurb: "Warm cream stock with oxblood ink.",
    isDark: false,
    accentPresets: ["#8b1a1a", "#1a4d5a", "#3a6b2b", "#6b3e8b"],
  },
  phosphor: {
    id: "phosphor",
    name: "Phosphor Terminal",
    blurb: "Near-black with phosphor green and CRT glow.",
    isDark: true,
    accentPresets: ["#7cf08b", "#f0c87c", "#7cb5f0", "#f08b7c"],
  },
  foundry: {
    id: "foundry",
    name: "Mechanical Foundry",
    blurb: "Industrial slate plates, riveted seams, brass keycaps.",
    isDark: true,
    accentPresets: ["#e8b86b", "#b86b6b", "#6bb8a4", "#a4b86b"],
  },
  amber: {
    id: "amber",
    name: "Amber Carriage",
    blurb: "Night-shift typewriter under a tungsten bulb.",
    isDark: true,
    accentPresets: ["#ffb066", "#ff9a4a", "#ffc88a", "#e88a4a"],
  },
};

export const MYANMAR_FONTS = [
  {
    id: "masterpiece",
    label: "Masterpiece Uni Type",
    stack: "'Masterpiece Uni Type', 'Noto Sans Myanmar', 'Padauk', sans-serif",
  },
  {
    id: "noto",
    label: "Noto Sans Myanmar",
    stack: "'Noto Sans Myanmar', sans-serif",
  },
  { id: "padauk", label: "Padauk", stack: "'Padauk', sans-serif" },
  {
    id: "pyidaungsu",
    label: "Pyidaungsu",
    stack: "'Pyidaungsu', 'Noto Sans Myanmar', sans-serif",
  },
] as const;

export type MyanmarFontId = (typeof MYANMAR_FONTS)[number]["id"];
