import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TypingSession } from "@/components/typing";
import { LESSONS, lessonById } from "@/lib/lessons";

export function generateStaticParams() {
  return LESSONS.map((l) => ({ lessonId: l.id }));
}

interface Props {
  params: Promise<{ lessonId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = lessonById(lessonId);
  if (!lesson) return {};

  const title = `${lesson.unitTitle}: ${lesson.title}`;
  const description = lesson.hint
    ? `Practise ${lesson.title.toLowerCase()} for ${lesson.unitTitle}: ${lesson.hint}`
    : `Practise ${lesson.title.toLowerCase()} for ${lesson.unitTitle} on the Windows Myanmar (Visual order) keyboard.`;
  const path = `/practice/${lesson.id}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path },
  };
}

export default async function PracticePage({ params }: Props) {
  const { lessonId } = await params;
  const lesson = lessonById(lessonId);
  if (!lesson) notFound();

  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <TypingSession key={lesson.id} lesson={lesson} />
    </main>
  );
}
