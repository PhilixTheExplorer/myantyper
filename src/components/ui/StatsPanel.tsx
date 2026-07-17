interface Stat {
  label: string;
  value: string;
  sub?: string;
}

export function StatsPanel({ stats }: { stats: Stat[] }) {
  return (
    <div
      data-stat-cols={stats.length}
      className="grid mt-surface overflow-hidden"
      style={{
        gridTemplateColumns: "repeat(var(--stat-cols, 2), minmax(0, 1fr))",
      }}
    >
      <style>{`@media (min-width:640px){[data-stat-cols="${stats.length}"]{--stat-cols:${stats.length}}}`}</style>
      {stats.map((s) => (
        <div
          key={s.label}
          className="px-4 sm:px-5 py-3.5 border-r border-b border-dashed border-border-soft"
        >
          <div className="mt-eyebrow">{s.label}</div>
          <div
            className="mt-display text-3xl sm:text-4xl leading-tight mt-0.5 tabular-nums"
            style={{
              textShadow:
                "0 0 14px color-mix(in srgb, var(--mt-accent) calc(var(--mt-glow) * 40%), transparent)",
            }}
          >
            {s.value}
          </div>
          {s.sub && (
            <div className="text-xs text-ink-soft italic mt-0.5">{s.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}
