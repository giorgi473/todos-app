export function TodoListSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <div className="relative inline-flex items-center justify-center rounded-xl border border-border/70 bg-card/80 px-8 py-6 shadow-lg backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 rounded-xl border border-white/5" />
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 rounded-full border-2 border-muted" />
          <div className="absolute h-12 w-12 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-400 animate-spin" />
          <div className="absolute h-6 w-6 rounded-full bg-background" />
        </div>
        <div className="ml-4 space-y-1">
          <p className="text-xs font-semibold tracking-[0.22em] uppercase text-muted-foreground">
            Loading
          </p>
          <p className="text-xs text-muted-foreground/80">
            Fetching your todos…
          </p>
        </div>
      </div>
    </div>
  );
}
