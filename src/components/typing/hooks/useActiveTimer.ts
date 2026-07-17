import { useCallback, useEffect, useRef, useState } from "react";

const ELAPSED_TICK_MS = 1_000;

/** Tracks route-local elapsed active time, excluding paused intervals. */
export function useActiveTimer() {
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [activeElapsedMs, setActiveElapsedMs] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const activeStartedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!started || paused) return;
    const id = setInterval(() => {
      const activeStartedAt = activeStartedAtRef.current;
      const activeMs =
        activeElapsedMs +
        (activeStartedAt === null ? 0 : Date.now() - activeStartedAt);
      setElapsed(Math.floor(activeMs / 1_000));
    }, ELAPSED_TICK_MS);
    return () => clearInterval(id);
  }, [activeElapsedMs, paused, started]);

  const start = useCallback(() => {
    if (activeStartedAtRef.current !== null) return;
    activeStartedAtRef.current = Date.now();
    setStarted(true);
  }, []);

  const togglePaused = useCallback(() => {
    if (paused) {
      if (started) activeStartedAtRef.current = Date.now();
      setPaused(false);
      return;
    }

    const activeStartedAt = activeStartedAtRef.current;
    if (activeStartedAt !== null) {
      const nextElapsedMs = activeElapsedMs + Date.now() - activeStartedAt;
      activeStartedAtRef.current = null;
      setActiveElapsedMs(nextElapsedMs);
      setElapsed(Math.floor(nextElapsedMs / 1_000));
    }
    setPaused(true);
  }, [activeElapsedMs, paused, started]);

  const finish = useCallback(() => {
    const activeStartedAt = activeStartedAtRef.current;
    const nextElapsedMs =
      activeElapsedMs +
      (activeStartedAt === null ? 0 : Date.now() - activeStartedAt);
    activeStartedAtRef.current = null;
    setActiveElapsedMs(nextElapsedMs);
    setElapsed(Math.floor(nextElapsedMs / 1_000));
    setPaused(true);
  }, [activeElapsedMs]);

  const reset = useCallback(() => {
    activeStartedAtRef.current = null;
    setStarted(false);
    setPaused(false);
    setActiveElapsedMs(0);
    setElapsed(0);
  }, []);

  return {
    activeElapsedMs,
    elapsed,
    finish,
    paused,
    reset,
    start,
    started,
    togglePaused,
  };
}
