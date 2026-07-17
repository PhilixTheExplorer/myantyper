import { useCallback, useEffect, useRef } from "react";

type Sound = "key" | "return" | "bell" | "error";

export function useTypewriterAudio(enabled: boolean) {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  return useCallback(
    (variant: Sound) => {
      if (!enabled) return;
      try {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new AC();
        const ctx = ctxRef.current;
        const t0 = ctx.currentTime;
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.connect(gain);
        gain.connect(ctx.destination);

        if (variant === "key") {
          oscillator.type = "square";
          oscillator.frequency.setValueAtTime(2400 + Math.random() * 400, t0);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(0.04, t0 + 0.002);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04);
        } else if (variant === "return") {
          oscillator.type = "square";
          oscillator.frequency.setValueAtTime(180, t0);
          oscillator.frequency.exponentialRampToValueAtTime(95, t0 + 0.09);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(0.08, t0 + 0.003);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
        } else if (variant === "bell") {
          oscillator.type = "sine";
          oscillator.frequency.setValueAtTime(1200, t0);
          oscillator.frequency.exponentialRampToValueAtTime(900, t0 + 0.5);
          gain.gain.setValueAtTime(0.001, t0);
          gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.7);
        } else {
          oscillator.type = "sawtooth";
          oscillator.frequency.setValueAtTime(150, t0);
          gain.gain.setValueAtTime(0.0001, t0);
          gain.gain.exponentialRampToValueAtTime(0.06, t0 + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
        }

        oscillator.start(t0);
        oscillator.stop(t0 + 0.8);
      } catch {
        /* Web Audio is optional. */
      }
    },
    [enabled],
  );
}
