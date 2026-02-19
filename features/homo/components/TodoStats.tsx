interface TodoStatsProps {
  pending: number;
  completed: number;
  search: string;
}

export function TodoStats({ pending, completed, search }: TodoStatsProps) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 p-6 select-none">
      <p className="text-sm font-semibold text-muted-foreground tracking-wide">
        {pending} remaining · {completed} done
        {search && (
          <span className="ml-3 text-xs text-muted-foreground bg-muted px-3 py-1">
            "{search}" filtered
          </span>
        )}
      </p>
    </div>
  );
}
