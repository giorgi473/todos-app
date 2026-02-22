'use client';

import { Id } from '@/convex/_generated/dataModel';
import { useMemo } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  MoreVertical,
  Edit3,
  Trash2,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { priorityConfig } from '@/constants/priorityConfig';

interface Todo {
  _id: Id<'todos'>;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: number;
  createdAt: number;
}

interface TodoCardProps {
  todo: Todo;
  onToggle: (id: Id<'todos'>) => void;
  onDelete: (id: Id<'todos'>) => void;
}

export function TodoCard({ todo, onToggle, onDelete }: TodoCardProps) {
  const p = priorityConfig[todo.priority];
  const isOverdue = useMemo(
    () => !todo.completed && todo.dueDate && todo.dueDate < Date.now(), // eslint-disable-line react-hooks/purity
    [todo.completed, todo.dueDate],
  );

  return (
    <li className="group flex items-start gap-4 border-b-2 px-4 md:px-0 py-5 select-none">
      <button
        onClick={() => onToggle(todo._id)}
        className="mt-1 cursor-pointer"
        aria-label="Toggle complete"
      >
        {todo.completed ? (
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        ) : (
          <Circle className="h-6 w-6" />
        )}
      </button>

      <div className="flex-1 md:w-305">
        <p
          className={cn(
            'text-lg font-bold leading-tight truncate text-wrap',
            todo.completed && 'line-through text-muted-foreground/70',
          )}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="mt-2 text-base text-muted-foreground/80 leading-relaxed">
            {todo.description}
          </p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center gap-2 rounded-xs px-4 py-1.5 text-sm font-bold shadow-none',
              p.badge,
            )}
          >
            <span className={cn('h-2 w-2 rounded-full', p.dot)} />
            {p.label}
          </span>
          {todo.dueDate && (
            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-xs px-3 py-1.5 text-sm font-semibold ring-1 ring-white/10 transition-all',
                isOverdue
                  ? 'bg-rose text-rose-500 border-rose-200/50 hover:bg-rose/20'
                  : 'bg-muted text-muted-foreground border-border/50 hover:bg-accent/50',
              )}
            >
              <CalendarDays className="h-4 w-4" />
              {format(new Date(todo.dueDate), 'dd MMM yyyy')}
              {isOverdue && (
                <span className="ml-1 rounded-full bg-rose/20 px-2 py-0.5 text-xs font-bold text-rose-500">
                  Overdue
                </span>
              )}
            </span>
          )}
        </div>
      </div>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-1 rounded-xs cursor-pointer bg-zinc-100 dark:bg-zinc-800 p-1 hover:bg-accent transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="rounded-none border-border/50 backdrop-blur-xl bg-card/95 shadow-none"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuItem asChild className="rounded-none">
            <Link
              href={`/todos/${todo._id}`}
              className="w-full flex items-center gap-3 text-sm font-semibold rounded-none text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <Edit3 className="h-4 w-4" />
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="w-full flex items-center text-sm font-semibold rounded-none text-muted-foreground hover:text-foreground cursor-pointer"
            onClick={() => onDelete(todo._id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
}
