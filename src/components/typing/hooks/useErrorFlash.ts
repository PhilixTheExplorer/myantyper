import { useCallback, useState } from "react";

const ERROR_FLASH_MS = 700;

export function useErrorFlash(schedule: (fn: () => void, ms: number) => void) {
  const [errorFlash, setErrorFlash] = useState(false);

  const flashError = useCallback(() => {
    setErrorFlash(true);
    schedule(() => setErrorFlash(false), ERROR_FLASH_MS);
  }, [schedule]);

  const reset = useCallback(() => setErrorFlash(false), []);

  return { errorFlash, flashError, reset };
}
