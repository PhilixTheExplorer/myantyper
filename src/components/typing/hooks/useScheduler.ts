import { useCallback, useEffect, useRef } from "react";

/** Timeouts tracked so they can be cleared on unmount. */
export function useScheduler() {
  const timeouts = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  useEffect(
    () => () => {
      for (const id of timeouts.current) clearTimeout(id);
      timeouts.current.clear();
    },
    [],
  );

  return useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(() => {
      timeouts.current.delete(id);
      fn();
    }, ms);
    timeouts.current.add(id);
  }, []);
}
