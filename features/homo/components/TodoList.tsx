'use client';

import {
  useTransition,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';
import { toast } from 'sonner';
import { TodoSection } from '@/features/homo/components/TodoSection';
import { TodoStats } from '@/features/homo/components/TodoStats';
import { TodoListEmpty } from '@/features/homo/components/TodoListEmpty';
import { TodoListSkeleton } from '@/features/homo/components/TodoListSkeleton';
import { Pagination } from '@/components/shared/Pagination';

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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  const [{ search, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  });

  const searchStr = search.toLowerCase();
  const result =
    useQuery(api.todos.list, userId ? { page, userId } : 'skip') ?? undefined;

  const toggleComplete = useMutation(api.todos.toggleComplete);
  const remove = useMutation(api.todos.remove);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const hasOptimisticUpdate = useRef(false);

  useLayoutEffect(() => {
    if (!result) return;
    setTodos((result.todos ?? []) as Todo[]);
    setTotal(result.total ?? 0);
    setPageSize(result.pageSize ?? 10);
    hasOptimisticUpdate.current = false;
  }, [result]);

  // Smooth scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const [, startTransition] = useTransition();

  const handleToggle = (id: Id<'todos'>) => {
    hasOptimisticUpdate.current = true;
    setTodos((current) =>
      current.map((t) =>
        t._id === id ? { ...t, completed: !t.completed } : t,
      ),
    );

    toggleComplete({ id }).catch(() => {
      toast.error('Failed to update todo.');
      setTodos((current) =>
        current.map((t) =>
          t._id === id ? { ...t, completed: !t.completed } : t,
        ),
      );
    });
  };

  const handleDelete = (id: Id<'todos'>) => {
    hasOptimisticUpdate.current = true;
    setTodos((current) => current.filter((t) => t._id !== id));

    remove({ id })
      .then(() => {
        toast.success('Todo deleted.');
      })
      .catch(() => {
        toast.error('Failed to delete todo.');
      });
  };

  const goToPage = (p: number) => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (p < 1 || p > totalPages) return;

    startTransition(() => {
      setQuery({ page: p });
    });
  };

  const isLoading = userId == null || (userId && result === undefined);
  const displayTodos = hasOptimisticUpdate.current
    ? todos
    : result
      ? ((result.todos ?? []) as Todo[])
      : todos;
  const displayTotal = result ? (result.total ?? 0) : total;
  const displayPageSize = result ? (result.pageSize ?? 10) : pageSize;

  if (isLoading) {
    return (
      <main className="min-h-screen w-full">
        <TodoListSkeleton />
      </main>
    );
  }

  const totalPages = Math.max(1, Math.ceil(displayTotal / displayPageSize));

  const filtered =
    displayTodos.filter(
      (t) =>
        t.title.toLowerCase().includes(searchStr) ||
        t.description?.toLowerCase().includes(searchStr),
    ) ?? [];

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  return (
    <main className="min-h-screen w-full">
      <div className="w-full py-12 space-y-12">
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
          <Pagination
            page={page}
            total={displayTotal}
            pageSize={displayPageSize}
            onPageChange={goToPage}
          />
        )}
      </div>
    </main>
  );
}
