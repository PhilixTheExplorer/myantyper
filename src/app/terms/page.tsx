import type { Metadata } from "next";
import { A, Article, ArticleHeader, Section } from "@/components/ui/Article";
import { JsonLd } from "@/components/ui/JsonLd";
import { PRIVACY_EMAIL, techArticleSchema } from "@/lib/site";

const LAST_UPDATED = "24 July 2026";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service: MyanTyper" },
  description:
    "Terms for using MyanTyper and its optional Google account and history-sync features.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "MyanTyper Terms of Service",
    description: "Terms for using MyanTyper and its optional account features.",
    url: "/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <Article>
      <JsonLd
        data={techArticleSchema({
          path: "/terms",
          headline: "MyanTyper Terms of Service",
          description:
            "Terms for using MyanTyper and its optional account features.",
        })}
      />
      <ArticleHeader
        eyebrow="Terms"
        title="Terms of Service"
        lead="MyanTyper is a free, open-source typing tutor. These terms apply when you use the public website and its optional account features."
      />

      <Section title="Using MyanTyper">
        <p>
          You may use the lessons, Free Type practice, local history, and
          preferences without creating an account. Use the service lawfully and
          do not attempt to disrupt it, bypass its security, access another
          person&apos;s account, or place an unreasonable load on its systems.
        </p>
      </Section>

      <Section title="Optional accounts">
        <p>
          Google sign-in is optional and is provided only for cross-device
          typing-history sync. You are responsible for access to your Google
          account and for activity performed through your MyanTyper session. You
          may sign out or permanently delete your MyanTyper account from the
          account menu.
        </p>
        <p>
          Our collection and handling of account and practice data is described
          in the <A href="/privacy">Privacy Policy</A>.
        </p>
      </Section>

      <Section title="Your text and project content">
        <p>
          Text you enter into Free Type remains on your device; MyanTyper does
          not claim ownership of it. Project code and authored learning content
          remain subject to the licenses identified in the project repository.
        </p>
      </Section>

      <Section title="Availability">
        <p>
          The service is provided as available and without a promise that it
          will always be uninterrupted or error-free. Features may change, and
          access may be limited when reasonably necessary for security,
          maintenance, legal compliance, or protection of the service and its
          users.
        </p>
      </Section>

      <Section title="Learning results and liability">
        <p>
          MyanTyper is an educational aid, not a guarantee of typing speed,
          accuracy, compatibility, or any particular learning result. To the
          extent permitted by law, the project maintainers are not liable for
          indirect or consequential loss resulting from use of, or inability to
          use, the service.
        </p>
      </Section>

      <Section title="Changes and contact">
        <p>
          These terms may be updated as the service evolves. Material changes
          will be reflected here with a new update date. These terms were last
          updated on {LAST_UPDATED}.
        </p>
        <p>
          Questions about these terms can be sent to{" "}
          <A href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</A>.
        </p>
      </Section>
    </Article>
  );
}
