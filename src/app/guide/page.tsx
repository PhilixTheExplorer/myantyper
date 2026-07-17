import type { Metadata } from "next";
import { GuideContent } from "@/components/guide/GuideContent";
import { JsonLd } from "@/components/ui/JsonLd";
import { firstLessonByTrack } from "@/lib/lessons";
import { techArticleSchema } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to use MyanTyper",
  description:
    "Learn how to practise Myanmar Unicode typing with MyanTyper, including Visual-order input, Keys mode, Reader mode, and Free Type.",
  alternates: { canonical: "/guide" },
  openGraph: {
    title: "How to use MyanTyper",
    description:
      "A bilingual guide to Visual-order Myanmar typing, practice modes, lessons, and Free Type.",
    url: "/guide",
    type: "article",
  },
};

export default function GuidePage() {
  const firstLesson = firstLessonByTrack("foundation");
  if (!firstLesson) throw new Error("Keyboard Foundations has no lessons");

  return (
    <>
      <JsonLd
        data={{
          ...techArticleSchema({
            path: "/guide",
            headline: "How to use MyanTyper",
            description:
              "A bilingual guide to Visual-order Myanmar typing, practice modes, lessons, and Free Type.",
          }),
          inLanguage: ["en", "my"],
        }}
      />
      <GuideContent firstLessonId={firstLesson.id} />
    </>
  );
}
