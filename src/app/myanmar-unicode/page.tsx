import type { Metadata } from "next";
import {
  Article,
  ArticleCTA,
  ArticleHeader,
  Section,
} from "@/components/ui/Article";
import { JsonLd } from "@/components/ui/JsonLd";
import { techArticleSchema } from "@/lib/site";

export const metadata: Metadata = {
  title: "Myanmar Unicode explained: Unicode vs Zawgyi",
  description:
    "What Myanmar Unicode is, how it differs from the legacy Zawgyi encoding, and why standard Unicode matters for search, sorting and cross-platform text.",
  alternates: { canonical: "/myanmar-unicode" },
  openGraph: {
    title: "Myanmar Unicode explained",
    description:
      "Myanmar Unicode vs Zawgyi: what the difference is and why it matters.",
    url: "/myanmar-unicode",
    type: "article",
  },
};

export default function MyanmarUnicodePage() {
  return (
    <Article>
      <JsonLd
        data={techArticleSchema({
          path: "/myanmar-unicode",
          headline: "Myanmar Unicode explained: Unicode vs Zawgyi",
          description:
            "What Myanmar Unicode is, how it differs from the legacy Zawgyi encoding, and why standard Unicode matters.",
        })}
      />
      <ArticleHeader
        eyebrow="Myanmar Unicode"
        title="Myanmar Unicode, and why it isn't Zawgyi"
        lead="Myanmar text on the web comes in two incompatible flavours. Understanding the difference is the first step to typing Burmese that works everywhere."
      />

      <Section title="What Myanmar Unicode is">
        <p>
          Unicode is the international standard that assigns a unique code point
          to every character. The Myanmar script lives in the{" "}
          <strong>Myanmar block, U+1000-U+109F</strong> (with additional letters
          in the Extended blocks), covering Burmese plus minority languages such
          as Shan, Mon and Karen.
        </p>
        <p>
          In proper Unicode, a syllable is stored in a fixed logical order:
          consonant, then any medials, vowels, tone marks and asat. Each of
          these is a <strong>separate code point</strong>. For example{" "}
          <span lang="my">မြန်မာ</span> is a sequence of base letters and
          combining marks, not a set of pre-composed glyphs.
        </p>
      </Section>

      <Section title="Zawgyi vs Unicode">
        <p>
          <strong>Zawgyi</strong> is a legacy font that became widespread in
          Myanmar before Unicode support matured. Although Zawgyi text also uses
          the U+1000-U+109F range, it assigns those code points differently and
          non-systematically. It stores glyphs roughly in visual order and
          duplicates characters for different shapes. The result looks correct
          only in a Zawgyi font and is <strong>not interoperable</strong> with
          the Unicode standard.
        </p>
        <p>
          Because Zawgyi and Unicode reuse the same numbers for different
          things, the same bytes render as garbled text in the wrong font.
          Myanmar began a national migration to Unicode around{" "}
          <strong>2019</strong>, when telecoms and major platforms switched
          over. Modern Android, iOS, Windows and macOS all ship Unicode Myanmar
          support by default.
        </p>
      </Section>

      <Section title="Why standard Unicode matters">
        <p>
          Unicode text can be{" "}
          <strong>searched, sorted and spell-checked</strong> correctly, copied
          between apps, indexed by search engines, and read by screen readers.
          Zawgyi text breaks all of these. Typing in Unicode means what you
          write today keeps working across every device and service.
        </p>
        <p>
          The standard Unicode font shipped for Myanmar is{" "}
          <strong>Pyidaungsu</strong>. MyanTyper stores and displays text in
          canonical Unicode (NFC) form throughout, so the drills you practise
          match real-world text.
        </p>
      </Section>

      <ArticleCTA
        href="/myanmar-keyboard"
        label="See the Myanmar keyboard"
        note="Learn the layout that types Unicode."
      />
    </Article>
  );
}
