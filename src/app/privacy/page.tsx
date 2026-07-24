import type { Metadata } from "next";
import { A, Article, ArticleHeader, Section } from "@/components/ui/Article";
import { JsonLd } from "@/components/ui/JsonLd";
import { PRIVACY_EMAIL, techArticleSchema } from "@/lib/site";

const LAST_UPDATED = "24 July 2026";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy: MyanTyper" },
  description:
    "How MyanTyper handles your data. Anonymous and local-first by default. An optional Google account enables cross-device history sync.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "MyanTyper Privacy Policy",
    description:
      "Anonymous and local-first by default. An optional Google account enables cross-device history sync.",
    url: "/privacy",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <Article>
      <JsonLd
        data={techArticleSchema({
          path: "/privacy",
          headline: "MyanTyper Privacy Policy",
          description:
            "How MyanTyper handles your data, including the optional Google account used for cross-device history sync.",
        })}
      />
      <ArticleHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        lead="MyanTyper is anonymous and local-first by default. Your typing history and preferences stay on your device unless you choose to sign in and sync them."
      />

      <Section title="In short">
        <p>
          You can use MyanTyper without an account. When you do not sign in,
          your practice history and preferences are stored in your own browser
          and are not uploaded to the account database.
        </p>
        <p>
          Signing in with Google is <strong>optional</strong> and exists for a
          single purpose: to sync your typing history across your own devices.
          If you never sign in, nothing in this policy about accounts applies to
          you.
        </p>
        <p>
          <strong>
            No advertising. No analytics. No third-party tracking. We do not
            sell your data.
          </strong>
        </p>
      </Section>

      <Section title="When you do not sign in">
        <p>
          Anonymous practice is the default. Your lesson progress, session
          history, statistics, and preferences (theme, fonts, sound) are saved
          locally in your browser using local storage and IndexedDB. This data
          stays on your device, is not transmitted to our servers, and is not
          visible to us. Clearing your browser storage removes it.
        </p>
      </Section>

      <Section title="When you sign in with Google">
        <p>
          If you choose to sign in, we use Google as the sign-in provider and
          request only your basic profile (the standard <strong>openid</strong>,{" "}
          <strong>email</strong>, and <strong>profile</strong> scopes). We do
          not request access to your Gmail, contacts, Drive, or any other Google
          service.
        </p>
        <p>Once you are signed in, we store the following on our servers:</p>
        <ul className="flex flex-col gap-2 list-disc pl-5 [&_strong]:text-ink [&_strong]:font-normal">
          <li>
            <strong>Account profile</strong> from Google: your name, email
            address, profile image, Google account identifier, an internal
            account identifier, and account timestamps.
          </li>
          <li>
            <strong>OAuth account data</strong>: the scopes granted during
            sign-in and tokens returned by Google, which may include access, ID,
            and refresh tokens. OAuth tokens are encrypted before they are
            stored in the account database. A separate MyanTyper session token
            keeps you signed in.
          </li>
          <li>
            <strong>Session information</strong>: a session identifier and
            token, creation and expiration times, and, for security, the IP
            address and browser user-agent associated with an active session.
          </li>
          <li>
            <strong>Typing history</strong>: for each completed session, the
            lesson, words per minute, accuracy, duration, keystroke count, and
            completion time, linked to your account so it can sync across your
            devices.
          </li>
        </ul>
        <p>
          We use this data only to provide the account and sync features. We do
          not use it for advertising, profiling, or analytics, and we do not
          disclose it except to the service providers below as needed to
          authenticate you, operate MyanTyper, and synchronize your history.
        </p>
      </Section>

      <Section title="Where your data is stored">
        <p>
          <strong>Google</strong> handles authentication when you sign in. Their
          handling of your Google account is governed by{" "}
          <A href="https://policies.google.com/privacy">
            Google&apos;s Privacy Policy
          </A>
          .
        </p>
        <p>
          <strong>Neon</strong> provides the managed PostgreSQL database that
          stores your account and synced history in the region configured for
          this project. Its handling of that data is governed by the{" "}
          <A href="https://neon.com/privacy-policy">
            provider&apos;s Privacy Notice
          </A>
          .
        </p>
        <p>
          <strong>Vercel</strong> hosts and delivers MyanTyper. It processes
          ordinary request metadata such as IP address, browser user-agent,
          requested route, timestamps, and response status for delivery,
          security, troubleshooting, and reliability. MyanTyper does not use
          this information for advertising or behavioral analytics. See{" "}
          <A href="https://vercel.com/legal/privacy-notice">
            Vercel&apos;s Privacy Notice
          </A>
          .
        </p>
      </Section>

      <Section title="Cookies">
        <p>
          We use essential cookies for authentication, including a session
          cookie and short-lived cookies used to secure the Google sign-in flow.
          We do not use advertising or tracking cookies.
        </p>
      </Section>

      <Section title="Keeping and deleting your data">
        <p>
          <strong>Signing out</strong> ends the account session and returns the
          app to its anonymous local history. History saved for the signed-in
          account remains in browser storage but is not shown while signed out.
          History that existed anonymously before sign-in remains available.
        </p>
        <p>
          <strong>Retention</strong>: your account profile and synced history
          remain until you delete the account. Session records remain until they
          expire, are ended, or the account is deleted. Operational logs and
          database restore history follow the retention settings of the service
          providers described above.
        </p>
        <p>
          <strong>Deleting your account</strong>
          {"\u00a0"}is available at any time from the account menu. It removes
          your profile, sessions, and all synced typing history from the active
          database, removes the stored Google tokens, and, when a current token
          is available, asks Google to revoke it. It does not remove history
          stored locally in this browser. After deletion, local history saved
          for that account is no longer displayed by MyanTyper; clear the
          site&apos;s browser data to remove it. Residual server copies may
          remain temporarily in provider backups or restore history until their
          retention periods expire.
        </p>
        <p>
          To request a copy of your data, or for any other data request, contact
          us through the channel below. Depending on where you live, you may
          also have rights to access, correct, or restrict the processing of
          your data.
        </p>
      </Section>

      <Section title="Children">
        <p>
          MyanTyper can be used without creating an account. If the law where a
          child lives requires permission from a parent or guardian before
          creating an online account, the child should not sign in without that
          permission. If you believe a child created an account without the
          required permission, contact us so the account can be removed.
        </p>
      </Section>

      <Section title="Changes to this policy">
        <p>
          We may update this policy as the project evolves. Material changes
          will be reflected here with a new update date. This policy was last
          updated on {LAST_UPDATED}.
        </p>
      </Section>

      <Section title="Contact">
        <p>
          For any privacy question or data request, email{" "}
          <A href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</A>. Please do not
          post personal information in a public GitHub issue.
        </p>
      </Section>
    </Article>
  );
}
