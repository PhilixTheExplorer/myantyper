import type { Metadata } from "next";
import { Suspense } from "react";
import { LessonBoard } from "@/components/lessons/LessonBoard";

export const metadata: Metadata = {
  title: "Myanmar typing lessons",
  description:
    "Learn to touch-type Myanmar Unicode on the Windows Myanmar (Visual order) keyboard with a progressive curriculum.",
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
            Myanmar typing lessons
          </h1>
          <p className="text-sm text-ink-soft mt-2 max-w-180 leading-relaxed">
            Begin with complete Windows Myanmar Visual-order keyboard
            foundations, then progress through vowels, medials, stacked forms,
            sentences, and fluency.
          </p>
        </div>
      </header>

      <Suspense fallback={null}>
        <LessonBoard />
      </Suspense>
    </main>
  );
}
