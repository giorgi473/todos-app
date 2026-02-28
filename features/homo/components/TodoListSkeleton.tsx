export function TodoListSkeleton() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background overflow-hidden">
      <div className="relative flex text-center flex-col items-center justify-center px-8 py-6">
        <div className="pointer-events-none absolute inset-0" />
        <div className="relative flex flex-col items-center justify-center mb-3">
          <div className="h-12 w-12 rounded-full border-2 border-muted" />
          <div className="absolute h-12 w-12 rounded-full border-2 border-transparent border-t-[#FF9D4D] border-r-[#FF9D4D] animate-spin" />
          <div className="absolute h-4 w-4 rounded-full bg-[#FF9D4D]" />
        </div>
        <div className="space-y-1">
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
