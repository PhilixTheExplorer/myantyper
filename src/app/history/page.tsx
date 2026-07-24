import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryView } from "@/components/history/HistoryView";

export const metadata: Metadata = {
  title: "Session history",
  robots: { index: false, follow: false },
};

export default function HistoryPage() {
  return (
    <main>
      <header className="mb-5">
        <div>
          <div className="mt-eyebrow mb-1">Logbook</div>
          <h1 className="mt-display text-3xl text-ink">Session history</h1>
        </div>
      </header>
      <Suspense fallback={null}>
        <HistoryView />
      </Suspense>
    </main>
  );
}
