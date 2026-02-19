export function TodoListSkeleton() {
  return (
    <div className="flex justify-center py-32">
      <div className="rounded-sm bg-card/50 backdrop-blur-xl p-8 border select-none animate-pulse">
        <div className="h-12 w-12 bg-muted rounded-full mx-auto" />
      </div>
    </div>
  );
}
