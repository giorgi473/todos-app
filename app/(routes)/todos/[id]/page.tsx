'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useRouter } from 'next/navigation';
import { notFound } from 'next/navigation';
import TodoForm from '@/features/homo/components/TodoForm';
import { ArrowLeft } from 'lucide-react';

type ParamsPromise = Promise<{ id: string }>;
function isValidConvexId(id: string): boolean {
  return /^[a-z0-9]{20,}$/.test(id);
}

export default function EditTodoPage({ params }: { params: ParamsPromise }) {
  const router = useRouter();
  const [resolvedId, setResolvedId] = React.useState<string | null>(null);
  const [isInvalidId, setIsInvalidId] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    (async () => {
      const { id } = await params;
      if (active) {
        if (!isValidConvexId(id)) {
          setIsInvalidId(true);
        } else {
          setResolvedId(id);
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [params]);

  if (isInvalidId) {
    notFound();
  }

  const todo = useQuery(
    api.todos.get,
    resolvedId
      ? {
          id: resolvedId as Id<'todos'>,
        }
      : 'skip',
  );

  if (!resolvedId || todo === undefined) return <div>Loading...</div>;
  if (!todo) {
    notFound();
  }

  return (
    <>
      <header className="bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex items-center gap-3 px-3 py-4 select-none">
          <button
            onClick={() => router.push('/todos')}
            aria-label="Back"
            className="cursor-pointer select-none"
          >
            <ArrowLeft className="h-5 w-5 mt-0.5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Update Todo</h1>
        </div>
      </header>
      <TodoForm
        mode="edit"
        todoId={todo._id}
        initialData={{
          title: todo.title,
          description: todo.description,
          priority: todo.priority,
          dueDate: todo.dueDate,
        }}
        onSuccess={() => router.push('/todos')}
      />
    </>
  );
}
