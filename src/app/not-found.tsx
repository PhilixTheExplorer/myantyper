import type { Metadata } from "next";
import Link from "next/link";
import { StampSeal } from "@/components/ui/StampSeal";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <main className="min-h-[55vh] flex items-center justify-center">
      <div className="mt-surface px-8 py-12 flex flex-col items-center gap-6 text-center max-w-130">
        <StampSeal primary="404" secondary="NOT FOUND" rotate={-6} size={112} />
        <div>
          <div className="mt-eyebrow mb-2">Off the page</div>
          <h1 className="mt-display text-3xl text-ink text-balance">
            This page slipped the carriage
          </h1>
          <p className="text-sm text-ink-soft mt-3 leading-relaxed">
            The address you tried isn&apos;t part of MyanTyper. It may have
            moved, or never existed.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/"
            className="mt-action mt-action-primary inline-flex items-center px-4 py-2 text-xs tracking-widest uppercase bg-accent text-accent-ink border border-accent"
          >
            ▸ Home
          </Link>
          <Link
            href="/lessons"
            className="mt-action mt-action-outline inline-flex items-center px-4 py-2 text-xs tracking-widest uppercase border border-border-soft text-ink"
          >
            Lessons
          </Link>
        </div>
      </div>
    </main>
  );
}
