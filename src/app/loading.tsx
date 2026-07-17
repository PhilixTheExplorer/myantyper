export default function Loading() {
  return (
    <main className="min-h-[50vh] flex items-center justify-center">
      <div className="mt-surface px-8 py-10 flex flex-col items-center gap-4 text-center">
        <div className="mt-eyebrow">Please wait</div>
        <div className="flex items-end gap-2">
          <span className="mt-display text-3xl text-ink">Loading</span>
          <span
            aria-hidden
            className="inline-block w-3 h-7 bg-accent animate-pulse"
          />
        </div>
        <div className="text-xs text-ink-soft italic">
          Feeding the carriage…
        </div>
      </div>
    </main>
  );
}
