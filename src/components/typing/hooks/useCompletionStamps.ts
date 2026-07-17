import { useCallback, useRef, useState } from "react";
import type { SessionStamp } from "../engine/types";

export function useCompletionStamps() {
  const [stamps, setStamps] = useState<SessionStamp[]>([]);
  const seq = useRef(0);

  const addStamp = useCallback((label: string) => {
    seq.current += 1;
    setStamps((items) => [
      ...items,
      { id: seq.current, label, rotate: -10 + Math.random() * 20 },
    ]);
  }, []);

  const reset = useCallback(() => setStamps([]), []);

  return { stamps, addStamp, reset };
}
