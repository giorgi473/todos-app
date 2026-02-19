'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQueryState } from 'nuqs';
import { TodoListSkeleton } from '@/features/homo/components/TodoListSkeleton';
import { TodoListEmpty } from '@/features/homo/components/TodoListEmpty';
import { TodoSection } from '@/features/homo/components/TodoSection';
import { TodoStats } from '@/features/homo/components/TodoStats';
import { toast } from 'sonner';

export default function TodoList() {
  const todos = useQuery(api.todos.list, {});
  const toggleComplete = useMutation(api.todos.toggleComplete);
  const remove = useMutation(api.todos.remove);
  const [q] = useQueryState('search');
  const search = q?.toLowerCase() ?? '';

  const handleToggle = async (id: Id<'todos'>) => {
    try {
      await toggleComplete({ id });
    } catch {
      toast.error('Failed to update todo.');
    }
  };

  const handleDelete = async (id: Id<'todos'>) => {
    try {
      await remove({ id });
      toast.success('Todo deleted.');
    } catch {
      toast.error('Failed to delete todo.');
    }
  };

  const filtered =
    todos?.filter(
      (t) =>
        t.title.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search),
    ) ?? [];

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  return (
    <main className="min-h-screen">
      <div className="py-12 space-y-12">
        {todos !== undefined && (
          <TodoStats
            pending={pending.length}
            completed={completed.length}
            search={search}
          />
        )}
        {todos === undefined && <TodoListSkeleton />}
        {todos !== undefined && filtered.length === 0 && (
          <TodoListEmpty search={search} />
        )}
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
      </div>
    </main>
  );
}
