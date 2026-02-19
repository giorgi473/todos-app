'use client';

import { Id } from '@/convex/_generated/dataModel';
import { TodoCard } from '@/features/homo/components/TodoCard';

interface Todo {
  _id: Id<'todos'>;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: number;
  createdAt: number;
}

interface TodoSectionProps {
  title: string;
  count: number;
  todos: Todo[];
  onToggle: (id: Id<'todos'>) => void;
  onDelete: (id: Id<'todos'>) => void;
  isCompleted?: boolean;
}

export function TodoSection({
  title,
  count,
  todos,
  onToggle,
  onDelete,
  isCompleted = false,
}: TodoSectionProps) {
  return (
    <section className="space-y-4">
      <h2
        className={`flex items-center gap-2 text-2xl font-bold tracking-tight px-2 ${isCompleted ? 'text-foreground/70' : 'text-foreground'}`}
      >
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
        {title} · {count}
        <div className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
      </h2>
      <ul className={`space-y-4 ${isCompleted ? 'opacity-70' : ''}`}>
        {todos.map((todo) => (
          <TodoCard
            key={todo._id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </section>
  );
}
