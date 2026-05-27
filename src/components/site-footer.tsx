export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <span>Built for prompt creators who want feedback fast.</span>
        <span>VibeDrop MVP • Next.js + Supabase</span>
      </div>
    </footer>
  );
}
