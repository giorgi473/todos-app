'use client';

import { useTransition, useOptimistic, useEffect, useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { TodoSection } from '@/features/homo/components/TodoSection';
import { TodoStats } from '@/features/homo/components/TodoStats';
import { TodoListEmpty } from '@/features/homo/components/TodoListEmpty';
import { TodoListSkeleton } from '@/features/homo/components/TodoListSkeleton';
import { toast } from 'sonner';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Priority = 'low' | 'medium' | 'high';
interface Todo {
  _id: Id<'todos'>;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: number;
  createdAt: number;
}

export default function TodoList() {
  const [{ search, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  });

  const searchStr = search.toLowerCase();

  const result = useQuery(api.todos.list, { page }) ?? undefined;

  const toggleComplete = useMutation(api.todos.toggleComplete);
  const remove = useMutation(api.todos.remove);

  const [lastResult, setLastResult] = useState<typeof result>(undefined);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (result) {
      setLastResult(result);
      setHasLoaded(true);
    }
  }, [result]);

  const activeResult = lastResult ?? result;
  const [optimisticTodos, updateOptimisticTodos] = useOptimistic(
    (activeResult?.todos ?? []) as Todo[],
    (
      current: Todo[],
      action:
        | { type: 'toggle'; id: Id<'todos'> }
        | { type: 'delete'; id: Id<'todos'> },
    ) => {
      switch (action.type) {
        case 'toggle':
          return current.map((t) =>
            t._id === action.id ? { ...t, completed: !t.completed } : t,
          );
        case 'delete':
          return current.filter((t) => t._id !== action.id);
        default:
          return current;
      }
    },
  );

  const [, startTransition] = useTransition();

  const handleToggle = async (id: Id<'todos'>) => {
    updateOptimisticTodos({ type: 'toggle', id });
    try {
      await toggleComplete({ id });
    } catch {
      toast.error('Failed to update todo.');
    }
  };

  const handleDelete = async (id: Id<'todos'>) => {
    updateOptimisticTodos({ type: 'delete', id });
    try {
      await remove({ id });
      toast.success('Todo deleted.');
    } catch {
      toast.error('Failed to delete todo.');
    }
  };

  const goToPage = (p: number) => {
    const total = activeResult?.total ?? 0;
    const pageSize = activeResult?.pageSize ?? 10;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (p < 1 || p > totalPages) return;

    startTransition(() => {
      setQuery({ page: p });
    });
  };

  if (!hasLoaded && !activeResult) {
    return (
      <main className="min-h-screen">
        <TodoListSkeleton />
      </main>
    );
  }

  if (!activeResult) {
    return null;
  }

  const todos = (optimisticTodos.length
    ? optimisticTodos
    : (activeResult.todos ?? [])) as Todo[];

  const total = activeResult.total ?? 0;
  const pageSize = activeResult.pageSize ?? 10;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const filtered =
    todos.filter(
      (t) =>
        t.title.toLowerCase().includes(searchStr) ||
        t.description?.toLowerCase().includes(searchStr),
    ) ?? [];

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <main className="min-h-screen">
      <div className="py-12 space-y-12">
        <TodoStats
          pending={pending.length}
          completed={completed.length}
          search={searchStr}
        />

        {filtered.length === 0 && <TodoListEmpty search={searchStr} />}

        {pending.length > 0 && (
          <TodoSection
            title="Pending"
            count={pending.length}
            todos={pending}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        )}

        {completed.length > 0 && (
          <TodoSection
            title="Completed"
            count={completed.length}
            todos={completed}
            onToggle={handleToggle}
            onDelete={handleDelete}
            isCompleted
          />
        )}

        {totalPages > 1 && (
          <div className="pt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => goToPage(page - 1)}
                    className={
                      page === 1
                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                        : ''
                    }
                  />
                </PaginationItem>

                {pageNumbers.map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      onClick={() => goToPage(p)}
                      isActive={p === page}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => goToPage(page + 1)}
                    className={
                      page === totalPages
                        ? 'pointer-events-none opacity-50 cursor-not-allowed'
                        : ''
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </main>
  );
}
