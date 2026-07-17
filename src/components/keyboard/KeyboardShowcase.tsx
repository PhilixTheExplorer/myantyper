"use client";

import { Keyboard } from "./Keyboard";

export function KeyboardShowcase() {
  return <Keyboard highlight={null} pressedKeys={new Set()} legend />;
}
