import type { Metadata } from "next";
import { HistoryView } from "@/components/history/HistoryView";

export const metadata: Metadata = {
  title: "Session history",
  robots: { index: false, follow: false },
};

export default function HistoryPage() {
  return (
    <main>
      <header className="flex justify-between items-end mb-5">
        <div>
          <div className="mt-eyebrow mb-1">Logbook</div>
          <h1 className="mt-display text-3xl text-ink">Session history</h1>
        </div>
        <div className="text-xs tracking-widest text-ink-soft">
          Stored in this browser
        </div>
      </header>
      <HistoryView />
    </main>
  );
}
