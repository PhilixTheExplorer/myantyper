"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hasKeyForChar } from "@/lib/keyboard";
import type { Lesson } from "@/lib/lessons";
import { normalizeMyanmar } from "@/lib/myanmar";
import { loadFreeTypeDraft } from "@/lib/storage";
import { TypingSession } from "../typing";

export function FreeTypeSession() {
  const [draft, setDraft] = useState<string | null | undefined>(undefined);

  useEffect(() => setDraft(loadFreeTypeDraft()), []);

  if (draft === undefined) return null;

  const text = draft ? normalizeMyanmar(draft) : "";
  const valid = text.trim().length > 0 && Array.from(text).every(hasKeyForChar);
  if (!valid) return <MissingDraft />;

  const lesson: Lesson = {
    id: "free",
    track: "foundation",
    kind: "drill",
    kindNumber: 1,
    unitId: "free",
    unitTitle: "Your text",
    title: "Free Type",
    hint: "your own text",
    lines: text.split("\n"),
  };

  return (
    <TypingSession lesson={lesson} exitHref="/free" exitLabel="Edit text" />
  );
}

function MissingDraft() {
  return (
    <div className="mt-surface mx-auto max-w-xl p-6 text-center">
      <div className="mt-eyebrow mb-2">Free type</div>
      <h1 className="mt-display text-2xl text-ink">
        No text ready to practise
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        Add or paste Myanmar Unicode text before starting a session.
      </p>
      <Link
        href="/free"
        className="mt-action mt-action-primary mt-5 inline-flex border border-accent bg-accent px-4 py-2 text-xs tracking-widest text-accent-ink uppercase"
      >
        Edit text
      </Link>
    </div>
  );
}
