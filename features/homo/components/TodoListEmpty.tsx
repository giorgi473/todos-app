import { Inbox } from 'lucide-react';

interface TodoListEmptyProps {
  search: string;
}

export function TodoListEmpty({ search }: TodoListEmptyProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-32 text-center">
      <div className="rounded-xs bg-linear-to-br from-muted to-muted/50 p-12">
        <Inbox className="h-20 w-20 text-muted-foreground/50 mx-auto" />
      </div>
      {search ? (
        <>
          <h2 className="text-3xl font-bold text-foreground">
            No results found
          </h2>
          <p className="text-xl text-muted-foreground/80 max-w-md">
            No todos match "{search}".
          </p>
        </>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-foreground">No todos yet</h2>
          <p className="text-xl text-muted-foreground/80 max-w-md">
            Click "New Todo" to add your first task.
          </p>
        </>
      )}
    </div>
  );
}
