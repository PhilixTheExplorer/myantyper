"use client";

import Link from "next/link";
import { useEffect } from "react";
import { StampSeal } from "@/components/ui/StampSeal";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[55vh] flex items-center justify-center">
      <div className="mt-surface px-8 py-12 flex flex-col items-center gap-6 text-center max-w-130">
        <StampSeal primary="ERR" secondary="JAMMED" rotate={-6} size={112} />
        <div>
          <div className="mt-eyebrow mb-2">Something jammed</div>
          <h1 className="mt-display text-3xl text-ink text-balance">
            The carriage jammed
          </h1>
          <p className="text-sm text-ink-soft mt-3 leading-relaxed">
            An unexpected error interrupted the page. Try again. Your saved
            history and settings are untouched.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="mt-action mt-action-primary inline-flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase bg-accent text-accent-ink border border-accent"
          >
            ↻ Try again
          </button>
          <Link
            href="/"
            className="mt-action mt-action-outline inline-flex items-center px-4 py-2 text-xs tracking-widest uppercase border border-border-soft text-ink"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
