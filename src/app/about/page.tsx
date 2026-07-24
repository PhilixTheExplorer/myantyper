import type { Metadata } from "next";
import {
  A,
  Article,
  ArticleCTA,
  ArticleHeader,
  Section,
} from "@/components/ui/Article";
import { JsonLd } from "@/components/ui/JsonLd";
import {
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
  GITHUB_SPONSOR_URL,
  techArticleSchema,
} from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About MyanTyper: free Myanmar Unicode typing tutor" },
  description:
    "MyanTyper is a free, open-source Myanmar Unicode typing tutor. No ads. No tracking. No account required.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About MyanTyper",
    description:
      "A free, open-source touch-typing tutor for the Windows Myanmar (Visual order) keyboard.",
    url: "/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <Article>
      <JsonLd
        data={techArticleSchema({
          path: "/about",
          headline: "About MyanTyper",
          description:
            "MyanTyper is a free, open-source touch-typing tutor for the Windows Myanmar (Visual order) keyboard.",
        })}
      />
      <ArticleHeader
        eyebrow="About"
        title="A typing tutor built for Myanmar Unicode"
        lead="MyanTyper helps you learn to touch-type Myanmar (Burmese) on the Windows Myanmar (Visual order) keyboard, one syllable and one keystroke at a time."
      />

      <Section title="Why MyanTyper">
        <p>
          <strong>MyanTyper</strong> joins <strong>Myan</strong> with
          <strong> Typer</strong>. Myan points to Myanmar and echoes the Burmese
          word <span lang="my">မြန်</span>, meaning fast. The name describes a
          person learning to type Myanmar text quickly, accurately, and with
          confidence.
        </p>
        <p lang="my" className="mt-myanmar text-base">
          <strong>MyanTyper</strong> ဆိုသည်မှာ <strong>Myan</strong> နှင့်
          <strong> Typer</strong> ကို ပေါင်းစပ်ထားသော အမည်ဖြစ်သည်။
          <strong> Myan</strong> သည် Myanmar ကို ကိုယ်စားပြုသလို “မြန်” ဟူသော အဓိပ္ပာယ်လည်း
          ပါဝင်သည်။ မြန်မာစာကို မြန်မြန်၊ မှန်မှန်၊ ယုံကြည်မှုရှိရှိ ရိုက်တတ်သူကို ဆိုလိုသည်။
        </p>
      </Section>

      <Section title="What it is">
        <p>
          MyanTyper is a free, open-source touch-typing tutor for the Myanmar
          script. It teaches the official Windows{" "}
          <A href="/myanmar-keyboard">Myanmar (Visual order) keyboard</A>{" "}
          through an independently authored, skill-based curriculum, live speed
          and accuracy feedback, and an on-screen keyboard that shows you the
          next key to press.
        </p>
        <p>
          Unlike English typing tutors, it understands{" "}
          <A href="/myanmar-unicode">Myanmar Unicode</A> at the code-point
          level: every medial, vowel, tone mark and asat is its own keystroke,
          and the front vowel <span lang="my">ေ</span> is typed before its
          consonant, exactly as the Visual-order layout expects.
        </p>
      </Section>

      <Section title="Principles">
        <p>
          <strong>No ads. No tracking. No analytics.</strong> MyanTyper is
          anonymous and local-first by default: your lesson history and
          preferences are saved only in your browser. An optional account lets
          you sign in with Google to sync your history across your own devices,
          and your practice data is not uploaded unless you do. See the{" "}
          <A href="/privacy">privacy policy</A> for details.
        </p>
        <p>
          <strong>Open source.</strong> The project is licensed under the GNU
          Affero General Public License v3.0. You can read the code, file
          issues, or contribute on{" "}
          <A href="https://github.com/PhilixTheExplorer/myantyper">GitHub</A>.
        </p>
        <p>
          <strong>Standard Unicode only.</strong> MyanTyper works with proper
          Myanmar Unicode text, not the legacy Zawgyi encoding. Learning here
          builds habits that work across every modern app, phone and website.
        </p>
      </Section>

      <Section title="How to help">
        <p>
          <strong>Contribute.</strong> The most valuable help is native-speaker
          review, lesson improvements, keyboard-layout references, bug reports,
          and accessibility feedback. Start with the{" "}
          <A href={GITHUB_ISSUES_URL}>issue templates</A> or read the
          contributing guide in the repository.
        </p>
        <p>
          <strong>Sponsor.</strong> If MyanTyper is useful for your classroom,
          community, or own practice, you can{" "}
          <A href={GITHUB_SPONSOR_URL}>sponsor ongoing maintenance</A> so the
          project has time for careful Unicode, browser and content review.
        </p>
        <p>
          <strong>Star.</strong> A GitHub star is a small thing, but it helps
          learners and teachers discover that a Myanmar Unicode typing tutor
          exists. You can{" "}
          <A href={GITHUB_REPO_URL}>star the project on GitHub</A>.
        </p>
      </Section>

      <Section title="How it works">
        <p>
          Start with <A href="/lessons">Keyboard Foundations</A>, then continue
          through core syllables, vowels, medials, stacked forms, and original
          fluency practice. Prefer your own material?{" "}
          <A href="/free">Free type</A> turns any pasted Unicode Myanmar text
          into a typing drill. Your speed over time is charted on the{" "}
          <A href="/history">history</A> page.
        </p>
      </Section>

      <ArticleCTA
        href="/lessons"
        label="Browse the lessons"
        note="No sign-up required."
      />
    </Article>
  );
}
