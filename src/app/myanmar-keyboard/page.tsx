import type { Metadata } from "next";
import { KeyboardShowcase } from "@/components/keyboard/KeyboardShowcase";
import {
  A,
  Article,
  ArticleCTA,
  ArticleHeader,
  Section,
} from "@/components/ui/Article";
import { JsonLd } from "@/components/ui/JsonLd";
import { firstLessonByTrack } from "@/lib/lessons";
import { techArticleSchema } from "@/lib/site";

export const metadata: Metadata = {
  title: "Myanmar keyboard: the Windows Visual order layout",
  description:
    "How the Windows Myanmar (Visual order) keyboard works, how to enable it, and why the front vowel is typed before its consonant.",
  alternates: { canonical: "/myanmar-keyboard" },
  openGraph: {
    title: "The Myanmar (Visual order) keyboard",
    description:
      "How the standard Windows Myanmar keyboard layout works and how to enable it.",
    url: "/myanmar-keyboard",
    type: "article",
  },
};

export default function MyanmarKeyboardPage() {
  const firstLesson = firstLessonByTrack("foundation");
  if (!firstLesson) throw new Error("Keyboard Foundations has no lessons");

  return (
    <Article>
      <JsonLd
        data={techArticleSchema({
          path: "/myanmar-keyboard",
          headline: "The Myanmar (Visual order) keyboard",
          description:
            "How the Windows Myanmar (Visual order) keyboard works, how to enable it, and why the front vowel is typed before its consonant.",
        })}
      />
      <ArticleHeader
        eyebrow="Myanmar keyboard"
        title="The Myanmar (Visual order) keyboard"
        lead="MyanTyper teaches the layout that ships with Windows as the default for Myanmar: “Myanmar (Visual order)”, the KBDMYAN keyboard."
      />

      <Section title="The layout">
        <p>
          This is the standard Windows Myanmar keyboard (keyboard identifier
          00130C00). Common consonants sit on the unshifted keys; several
          letters live on Shift combinations, for instance{" "}
          <span lang="my">ရ</span> is Shift+7 and <span lang="my">ဋ</span> is
          Shift+3, and Myanmar punctuation <span lang="my">၊</span> and{" "}
          <span lang="my">။</span> are on Shift+comma and Shift+period.
        </p>
        <div className="my-2">
          <KeyboardShowcase />
        </div>
      </Section>

      <Section title="Visual order: type what you see">
        <p>
          The layout is called <strong>Visual order</strong> because you type
          glyphs roughly in the order they appear from left to right. The most
          important consequence is the front vowel <span lang="my">ေ</span>{" "}
          (U+1031): even though it is stored <em>after</em> its consonant in
          Unicode, you <strong>type it first</strong>. So{" "}
          <span lang="my">ဖေ</span> is keyed as <span lang="my">ေ</span> then{" "}
          <span lang="my">ဖ</span>.
        </p>
        <p>
          Every combining mark, including medials such as{" "}
          <span lang="my">ျ ြ ွ ှ</span>, vowels, tone marks and the asat{" "}
          <span lang="my">်</span>, is a separate keystroke. MyanTyper breaks
          each target syllable down into its keystrokes so you always know what
          comes next.
        </p>
      </Section>

      <Section title="How to enable it on Windows">
        <p>
          Open{" "}
          <strong>
            Settings → Time &amp; language → Language &amp; region
          </strong>
          , add <strong>Myanmar (Burmese)</strong> as a language, then make sure
          the <strong>Myanmar (Visual order)</strong> keyboard is installed for
          it. Switch between keyboards with <strong>Win + Space</strong>.
        </p>
        <p>
          Other layouts exist, including phonetic and third-party layouts.
          MyanTyper supports the exact Windows Visual-order positions; an input
          source on macOS or Linux may use different physical-key mappings even
          when it is labelled Myanmar or Burmese.
        </p>
      </Section>

      <Section title="Practise it">
        <p>
          Reading a layout only gets you so far. Muscle memory comes from
          repetition. The <A href="/lessons">Keyboard Foundations</A> cover
          every unshifted and shifted Myanmar key within an independent
          skill-based progression, highlighting each next key as you go. See
          also <A href="/myanmar-unicode">Myanmar Unicode explained</A>.
        </p>
      </Section>

      <ArticleCTA
        href={`/practice/${firstLesson.id}`}
        label="Start Keyboard Foundations"
        note="Begin with the unshifted top-row positions."
      />
    </Article>
  );
}
