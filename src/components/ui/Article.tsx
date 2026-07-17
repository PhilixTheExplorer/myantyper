import Link from "next/link";

export function Article({ children }: { children: React.ReactNode }) {
  return <main className="max-w-180">{children}</main>;
}

export function ArticleHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-9">
      <div className="mt-eyebrow mb-2">{eyebrow}</div>
      <h1 className="mt-display text-4xl leading-none text-ink text-balance">
        {title}
      </h1>
      {lead && (
        <p className="mt-4 text-sm sm:text-base text-ink-soft leading-relaxed">
          {lead}
        </p>
      )}
    </header>
  );
}

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="mt-display text-2xl text-ink mb-3">{title}</h2>
      <div className="text-sm text-ink-soft leading-relaxed flex flex-col gap-3 [&_strong]:text-ink [&_strong]:font-normal">
        {children}
      </div>
    </section>
  );
}

export function A({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  const cls = "text-accent underline underline-offset-2 hover:opacity-80";
  return external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ) : (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

export function ArticleCTA({
  href,
  label,
  note,
}: {
  href: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="mt-10 pt-6 border-t border-dashed border-border-soft flex flex-wrap items-center gap-4">
      <Link
        href={href}
        className="mt-action mt-action-primary inline-flex items-center px-4 py-2 text-xs tracking-widest uppercase bg-accent text-accent-ink border border-accent"
      >
        ▸ {label}
      </Link>
      {note && <span className="text-xs text-ink-soft">{note}</span>}
    </div>
  );
}
