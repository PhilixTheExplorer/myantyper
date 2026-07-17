import type { Metadata } from "next";
import { FreeTypeEntry } from "@/components/free/FreeTypeEntry";

export const metadata: Metadata = {
  title: "Free Myanmar typing practice",
  description:
    "Paste any Myanmar Unicode text and practise typing it on the Windows Myanmar (Visual order) keyboard with MyanTyper.",
  alternates: { canonical: "/free" },
  openGraph: { url: "/free" },
};

export default function FreePage() {
  return (
    <main>
      <header className="mb-5">
        <div className="mt-eyebrow mb-1">Free type</div>
        <h1 className="mt-display text-3xl text-ink">
          Paste your own Myanmar text
        </h1>
      </header>
      <p className="text-sm text-ink-soft mb-4 max-w-175">
        Drop in any Unicode Myanmar text, such as a proverb, poem, or news
        headline. The app will turn it into a typing target.
      </p>
      <FreeTypeEntry />
    </main>
  );
}
