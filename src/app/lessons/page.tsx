import type { Metadata } from "next";
import { Suspense } from "react";
import { LessonBoard } from "@/components/lessons/LessonBoard";

export const metadata: Metadata = {
  title: "Free Myanmar & Burmese typing lessons",
  description:
    "Progressive, open-source typing lessons for learning the Windows Myanmar Unicode keyboard, from key positions to fluent sentences.",
  alternates: { canonical: "/lessons" },
  openGraph: { url: "/lessons" },
};

export default function LessonsPage() {
  return (
    <main>
      <header className="mb-5">
        <div>
          <div className="mt-eyebrow mb-1">Curriculum</div>
          <h1 className="mt-display text-3xl text-ink">
            Myanmar (Burmese) typing lessons
          </h1>
          <p className="text-sm text-ink-soft mt-2 max-w-180 leading-relaxed">
            Start Burmese typing practice with complete Windows Myanmar
            Visual-order keyboard foundations, then progress through vowels,
            medials, stacked forms, sentences, and fluency.
          </p>
        </div>
      </header>

      <Suspense fallback={null}>
        <LessonBoard />
      </Suspense>
    </main>
  );
}
