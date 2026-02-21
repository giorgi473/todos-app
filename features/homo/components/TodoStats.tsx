interface TodoStatsProps {
  pending: number;
  completed: number;
  search: string;
}

export function TodoStats({ pending, completed, search }: TodoStatsProps) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 pl-4 sm:p-6 mx-4 sm:mx-0 select-none">
      <p className="text-sm font-semibold text-muted-foreground tracking-wide">
        {pending} remaining · {completed} done
        {search && (
          <span className="ml-3 text-xs text-muted-foreground bg-muted px-3 py-1">
            &quot;{search}&quot; filtered
          </span>
        )}
      </p>
    </div>
  );
}
