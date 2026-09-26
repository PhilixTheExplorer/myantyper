import { AppLink } from "@/components/ui/AppLink";
import {
  GITHUB_ISSUES_URL,
  GITHUB_REPO_URL,
  GITHUB_SPONSOR_URL,
} from "@/lib/site";

const COLUMNS = [
  {
    heading: "Practise",
    links: [
      { href: "/lessons", label: "Lessons" },
      { href: "/free", label: "Free type" },
      { href: "/history", label: "History" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/guide", label: "Learner guide" },
      { href: "/about", label: "About" },
      { href: "/myanmar-unicode", label: "Myanmar Unicode" },
      { href: "/myanmar-keyboard", label: "Myanmar keyboard" },
    ],
  },
  {
    heading: "Project",
    links: [
      {
        href: GITHUB_REPO_URL,
        label: "Source code",
      },
      {
        href: GITHUB_ISSUES_URL,
        label: "Contribute",
      },
      {
        href: GITHUB_SPONSOR_URL,
        label: "Sponsor",
      },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-16 pt-8 border-t border-dashed border-border-soft">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
        <div>
          <div className="mt-display text-xl text-ink">MyanTyper</div>
          <p className="text-xs text-ink-soft mt-1.5 leading-relaxed max-w-55">
            A free, open-source touch-typing tutor for the Windows Myanmar
            (Visual order) keyboard.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <nav key={col.heading} className="flex flex-col gap-2">
            <div className="mt-eyebrow mb-1">{col.heading}</div>
            {col.links.map((l) =>
              l.href.startsWith("http") ? (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-soft hover:text-ink transition-colors"
                >
                  {l.label}
                </a>
              ) : (
                <AppLink
                  key={l.href}
                  href={l.href}
                  className="text-sm text-ink-soft hover:text-ink transition-colors"
                >
                  {l.label}
                </AppLink>
              ),
            )}
          </nav>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between text-xs text-ink-soft tracking-widest pt-5 border-t border-dashed border-border-soft">
        <span>&copy; 2026 PhilixTheExplorer</span>
        <div className="flex items-center gap-4">
          <AppLink href="/privacy" className="transition-colors hover:text-ink">
            Privacy
          </AppLink>
          <AppLink href="/terms" className="transition-colors hover:text-ink">
            Terms
          </AppLink>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-ink"
          >
            <GitHubMark />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

function GitHubMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 16 16"
      width="13"
      height="13"
      fill="currentColor"
    >
      <title>GitHub</title>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 3.5c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
