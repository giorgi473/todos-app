'use client';

import { Id } from '@/convex/_generated/dataModel';
import { useMemo, useState } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const p = priorityConfig[todo.priority];
  const isOverdue = useMemo(
    () => !todo.completed && todo.dueDate && todo.dueDate < Date.now(), // eslint-disable-line react-hooks/purity
    [todo.completed, todo.dueDate],
  );

  return (
    <li className="w-full list-none">
      <Card className="group flex w-full flex-col gap-4 border-zinc-200 bg-zinc-200 rounded-md px-4 py-5 shadow-md shadow-zinc-300/60 ring-1 ring-zinc-200/80 dark:border-border dark:bg-card dark:shadow-sm dark:shadow-transparent dark:ring-0 md:px-6 select-none">
        <div className="flex flex-row items-start gap-4">
          <button
            onClick={() => onToggle(todo._id)}
            className="mt-0.5 shrink-0 cursor-pointer"
            aria-label="Toggle complete"
          >
            {todo.completed ? (
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
            ) : (
              <Circle className="h-6 w-6" />
            )}
          </button>

          <CardHeader className="flex-1 min-w-0 gap-2 p-0">
            <CardTitle
              className={cn(
                'text-lg font-bold leading-tight truncate text-wrap text-zinc-900 dark:text-card-foreground',
                todo.completed &&
                  'line-through text-zinc-500 dark:text-muted-foreground/70',
              )}
            >
              {todo.title}
            </CardTitle>
            {todo.description && (
              <CardDescription className="mt-1 text-base leading-relaxed text-zinc-600 dark:text-muted-foreground">
                {todo.description}
              </CardDescription>
            )}
            <CardAction className="shrink-0">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 rounded-xs cursor-pointer bg-zinc-200/80 p-1 hover:bg-zinc-300/80 dark:bg-zinc-800 dark:hover:bg-accent transition-colors">
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
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardAction>
          </CardHeader>
        </div>

        <CardContent className="flex flex-wrap items-center gap-3 px-0 pt-0">
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
                'inline-flex items-center gap-2 rounded-xs px-3 py-1.5 text-sm font-semibold ring-1 transition-all',
                isOverdue
                  ? 'bg-rose text-rose-500 ring-rose-200/50 hover:bg-rose/20 dark:ring-white/10'
                  : 'bg-zinc-200/70 text-zinc-600 ring-zinc-300/60 hover:bg-zinc-300/70 dark:bg-muted dark:text-muted-foreground dark:ring-border/50 dark:hover:bg-accent/50',
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
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Do you want to delete?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. &quot;{todo.title}&quot; will be
              permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-4">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={() => {
                onDelete(todo._id);
                setDeleteDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </li>
  );
}
