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
  todos,
  onToggle,
  onDelete,
  isCompleted = false,
}: TodoSectionProps) {
  return (
    <section className="w-full space-y-4">
      <ul className={`w-full space-y-4 ${isCompleted ? 'opacity-70' : ''}`}>
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
