import Link from "next/link";
import { HomeStats } from "@/components/home/HomeStats";
import { JsonLd } from "@/components/ui/JsonLd";
import { StampSeal } from "@/components/ui/StampSeal";
import { firstLessonByTrack, LESSON_TRACKS } from "@/lib/lessons";
import {
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
  GITHUB_SPONSOR_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export default function HomePage() {
  const firstLesson = firstLessonByTrack("foundation");
  if (!firstLesson) throw new Error("Keyboard Foundations has no lessons");

  return (
    <main>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: SITE_NAME,
          url: SITE_URL,
          applicationCategory: "EducationalApplication",
          operatingSystem: "Any (web browser)",
          description:
            "Free, open-source Burmese typing practice, progressive Myanmar Unicode lessons, and a typing speed and accuracy test for the Windows Myanmar (Visual order) keyboard.",
          featureList: [
            "Burmese typing practice",
            "Myanmar Unicode typing lessons",
            "Typing speed and accuracy test",
            "Windows Myanmar Visual-order keyboard guide",
          ],
          inLanguage: ["en", "my"],
          isAccessibleForFree: true,
          license: "https://www.gnu.org/licenses/agpl-3.0.html",
          publisher: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
            sameAs: [GITHUB_REPO_URL],
          },
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        }}
      />
      <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8 mb-10">
        <div className="mt-surface relative p-6 sm:p-9 min-h-70 sm:min-h-80">
          <div className="mt-eyebrow mb-4">
            KBDMYAN · Unicode · Built for focused practice
          </div>
          <h1 className="mt-display text-4xl sm:text-5xl leading-none text-ink">
            Type{" "}
            <span
              className="text-accent"
              style={{ fontFamily: "'Masterpiece Uni Type', sans-serif" }}
            >
              မြန်မာစာ
            </span>{" "}
            <br />
            with confidence.
          </h1>
          <p className="mt-5 max-w-150 text-sm leading-relaxed text-ink-soft">
            MyanTyper is a free, open-source Burmese typing practice tool for
            the Windows Myanmar keyboard. Build real muscle memory from your
            first key positions to fluent original sentences, with progressive
            Myanmar Unicode lessons and local-first history.
          </p>
          <p
            lang="my"
            className="mt-4 max-w-150 text-lg leading-relaxed text-ink"
            style={{ fontFamily: "'Masterpiece Uni Type', sans-serif" }}
          >
            လက်ကွက်မကြည့်ဘဲ မြန်မာစာ ရိုက်တတ်အောင် လေ့ကျင့်ကြမယ်။
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/practice/${firstLesson.id}`}
              className="mt-action mt-action-primary inline-flex items-center px-4 py-2 text-xs tracking-widest uppercase bg-accent text-accent-ink border border-accent"
            >
              ▸ Begin Foundations
            </Link>
            <Link
              href="/free"
              className="mt-action mt-action-outline inline-flex items-center px-4 py-2 text-xs tracking-widest uppercase border border-border-soft text-ink"
            >
              Free typing test
            </Link>
            <Link
              href="/myanmar-keyboard"
              className="mt-action mt-action-outline inline-flex items-center px-4 py-2 text-xs tracking-widest uppercase border border-border-soft text-ink"
            >
              See the keyboard
            </Link>
          </div>
          <p className="mt-4 text-xs tracking-widest uppercase text-ink-soft">
            Free and open source · No ads · No tracking ·{" "}
            <Link
              href="/about"
              className="text-accent underline underline-offset-2 hover:opacity-80"
            >
              About the project
            </Link>
          </p>

          <div className="absolute right-6 top-6 hidden sm:block">
            <StampSeal primary="00" secondary="SESSIONS" rotate={6} size={84} />
          </div>
        </div>

        <HomeStats />
      </section>

      <SectionHeading eyebrow="QUICK START" title="Where to begin" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {LESSON_TRACKS.map((track, idx) => {
          const first = firstLessonByTrack(track.id);
          if (!first) return null;
          return (
            <Link
              key={track.id}
              href={`/practice/${first.id}`}
              className="group mt-surface mt-action flex h-full flex-col p-6 transition-colors hover:border-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:bg-surface-2"
            >
              <div className="mb-3 flex justify-end">
                <div className="mt-display text-3xl leading-none text-accent tabular-nums">
                  <span className="sr-only">Stage </span>
                  {String(idx + 1).padStart(2, "0")}
                </div>
              </div>
              <div className="mt-display mb-2 line-clamp-2 text-2xl leading-tight text-ink sm:min-h-[2.4em]">
                {track.label}
              </div>
              <div className="text-xs leading-relaxed text-ink-soft">
                {track.blurb}
              </div>
              <div className="mt-auto pt-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 border-t border-dashed border-border-soft pt-3">
                  <div className="mt-myanmar min-w-0 truncate whitespace-nowrap text-2xl text-ink">
                    {first.lines[0]}
                  </div>
                  <div className="inline-flex h-8 shrink-0 items-center justify-center whitespace-nowrap border border-accent bg-accent px-3 text-xs tracking-widest text-accent-ink uppercase transition-colors group-hover:bg-transparent group-hover:text-accent group-focus-visible:bg-transparent group-focus-visible:text-accent">
                    ▸ START
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="mt-10">
        <SectionHeading
          eyebrow="HOW IT WORKS"
          title="Built for real Myanmar typing"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link
            href="/myanmar-keyboard"
            className="group mt-surface mt-action flex h-full flex-col p-6 transition-colors hover:border-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:bg-surface-2"
          >
            <div className="mt-eyebrow mb-3">THE LAYOUT</div>
            <div className="mt-display text-2xl text-ink mb-2">
              Windows Visual order
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Learn the KBDMYAN keyboard that ships with Windows, including
              shifted keys and the visual-order front vowel.
            </p>
            <div className="mt-auto pt-5">
              <span className="inline-flex border border-accent bg-accent px-3 py-2 text-xs tracking-widest text-accent-ink uppercase transition-colors group-hover:bg-transparent group-hover:text-accent group-focus-visible:bg-transparent group-focus-visible:text-accent">
                ▸ View keyboard
              </span>
            </div>
          </Link>
          <Link
            href="/myanmar-unicode"
            className="group mt-surface mt-action flex h-full flex-col p-6 transition-colors hover:border-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:bg-surface-2"
          >
            <div className="mt-eyebrow mb-3">THE TEXT STANDARD</div>
            <div className="mt-display text-2xl text-ink mb-2">
              Unicode, not Zawgyi
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              Understand why standard Myanmar Unicode makes text work across
              modern devices, apps and the web.
            </p>
            <div className="mt-auto pt-5">
              <span className="inline-flex border border-accent bg-accent px-3 py-2 text-xs tracking-widest text-accent-ink uppercase transition-colors group-hover:bg-transparent group-hover:text-accent group-focus-visible:bg-transparent group-focus-visible:text-accent">
                ▸ Learn Unicode
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <SectionHeading eyebrow="OPEN SOURCE" title="Help MyanTyper grow" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              href: GITHUB_ISSUES_URL,
              eyebrow: "CONTRIBUTE",
              title: "Improve lessons",
              body: "Review Myanmar text, report keyboard mapping mistakes, suggest accessibility fixes, or open a focused pull request.",
              action: "File an issue",
            },
            {
              href: GITHUB_SPONSOR_URL,
              eyebrow: "SPONSOR",
              title: "Fund maintenance",
              body: "Support time for Unicode checks, browser testing, content review, and the quiet upkeep that keeps the tutor usable.",
              action: "Sponsor",
            },
            {
              href: GITHUB_REPO_URL,
              eyebrow: "SOURCE CODE",
              title: "Build in public",
              body: "Read the source, inspect the curriculum, and star the repo so learners, teachers, and Myanmar Unicode contributors can find the project.",
              action: "Browse source code",
            },
          ].map((item) => (
            <a
              key={item.eyebrow}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-surface mt-action flex h-full flex-col p-6 transition-colors hover:border-accent hover:bg-surface-2 focus-visible:border-accent focus-visible:bg-surface-2"
            >
              <div className="mt-eyebrow mb-3">{item.eyebrow}</div>
              <div className="mt-display text-2xl text-ink mb-2">
                {item.title}
              </div>
              <p className="text-xs leading-relaxed text-ink-soft">
                {item.body}
              </p>
              <div className="mt-auto pt-5">
                <div className="border-t border-dashed border-border-soft pt-3 text-xs tracking-widest text-accent uppercase">
                  ▸ {item.action}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="flex justify-between items-end mb-5">
      <div>
        <div className="mt-eyebrow mb-1">{eyebrow}</div>
        <div className="mt-display text-3xl text-ink">{title}</div>
      </div>
    </div>
  );
}
