import { useCallback, useState } from "react";

const KEY_FLASH_MS = 110;

export function shiftLabel(code: string): "SHIFTL" | "SHIFTR" {
  return code === "ShiftRight" ? "SHIFTR" : "SHIFTL";
}

export function usePressedKeys(schedule: (fn: () => void, ms: number) => void) {
  const [pressed, setPressed] = useState<Set<string>>(new Set());

  const release = useCallback((key: string) => {
    setPressed((keys) => {
      const next = new Set(keys);
      next.delete(key);
      return next;
    });
  }, []);

  const press = useCallback((key: string) => {
    setPressed((keys) => new Set(keys).add(key));
  }, []);

  const flash = useCallback(
    (key: string) => {
      press(key);
      schedule(() => release(key), KEY_FLASH_MS);
    },
    [press, release, schedule],
  );

  const reset = useCallback(() => setPressed(new Set()), []);

  return { pressed, press, release, flash, reset };
}
