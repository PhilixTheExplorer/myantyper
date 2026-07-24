import type { Metadata } from "next";
import { FreeTypeEntry } from "@/components/free/FreeTypeEntry";

export const metadata: Metadata = {
  title: "Free Burmese typing test",
  description:
    "Paste Myanmar Unicode text for a free, private typing test. Measure words per minute and accuracy while practising the Windows Myanmar keyboard.",
  alternates: { canonical: "/free" },
  openGraph: { url: "/free" },
};

export default function FreePage() {
  return (
    <main>
      <header className="mb-5">
        <div className="mt-eyebrow mb-1">Free type</div>
        <h1 className="mt-display text-3xl text-ink">
          Burmese typing test with your own text
        </h1>
      </header>
      <p className="text-sm text-ink-soft mb-4 max-w-175">
        Paste any Myanmar Unicode text, such as a proverb, poem, or news
        headline. MyanTyper turns it into a private typing practice session and
        reports your words per minute and accuracy.
      </p>
      <FreeTypeEntry />
    </main>
  );
}
