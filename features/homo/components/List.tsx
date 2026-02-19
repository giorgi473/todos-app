"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { format } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryState } from "nuqs";
import {
  CheckCircle2,
  Circle,
  Trash2,
  CalendarDays,
  Inbox,
  Loader2,
} from "lucide-react";

const priorityConfig = {
  low:    { label: "Low",    dot: "bg-emerald-400", badge: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  medium: { label: "Medium", dot: "bg-amber-400",   badge: "text-amber-600 bg-amber-50 border-amber-200"     },
  high:   { label: "High",   dot: "bg-rose-400",    badge: "text-rose-600 bg-rose-50 border-rose-200"        },
} as const;

export default function List() {
  const todos = useQuery(api.todos.list, {});
  const toggleComplete = useMutation(api.todos.toggleComplete);
  const remove = useMutation(api.todos.remove);
  const [q] = useQueryState("search");
  const search = q?.toLowerCase() ?? "";

  const handleToggle = async (id: Id<"todos">) => {
    try {
      await toggleComplete({ id });
    } catch {
      toast.error("Failed to update todo.");
    }
  };

  const handleDelete = async (id: Id<"todos">) => {
    try {
      await remove({ id });
      toast.success("Todo deleted.");
    } catch {
      toast.error("Failed to delete todo.");
    }
  };

  const filtered = todos?.filter((t) =>
    t.title.toLowerCase().includes(search) ||
    t.description?.toLowerCase().includes(search)
  ) ?? [];

  const pending = filtered.filter((t) => !t.completed);
  const completed = filtered.filter((t) => t.completed);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl py-6 space-y-8">

        {/* ── Stats ── */}
        {todos !== undefined && (
          <p className="text-xs text-muted-foreground">
            {pending.length} remaining · {completed.length} done
            {search && (
              <span className="ml-1 text-muted-foreground/60">
                · &quot;{search}&quot; filtered
              </span>
            )}
          </p>
        )}

        {/* ── Loading ── */}
        {todos === undefined && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* ── Empty State ── */}
        {todos !== undefined && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <div className="rounded-full bg-muted p-4">
              <Inbox className="h-6 w-6 text-muted-foreground" />
            </div>
            {search ? (
              <>
                <p className="font-medium">No results found</p>
                <p className="text-sm text-muted-foreground">
                  No todos match &quot;{search}&quot;.
                </p>
              </>
            ) : (
              <>
                <p className="font-medium">No todos yet</p>
                <p className="text-sm text-muted-foreground">
                  Click &quot;New Todo&quot; to add your first task.
                </p>
              </>
            )}
          </div>
        )}

        {/* ── Pending Todos ── */}
        {pending.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
              Pending · {pending.length}
            </h2>
            <ul className="space-y-2">
              {pending.map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </section>
        )}

        {/* ── Completed Todos ── */}
        {completed.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-1">
              Completed · {completed.length}
            </h2>
            <ul className="space-y-2 opacity-60">
              {completed.map((todo) => (
                <TodoCard
                  key={todo._id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}

interface Todo {
  _id: Id<"todos">;
  title: string;
  description?: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  dueDate?: number;
  createdAt: number;
}

function TodoCard({
  todo,
  onToggle,
  onDelete,
}: {
  todo: Todo;
  onToggle: (id: Id<"todos">) => void;
  onDelete: (id: Id<"todos">) => void;
}) {
  const p = priorityConfig[todo.priority];
  const isOverdue = !todo.completed && todo.dueDate && todo.dueDate < Date.now();

  return (
    <li className="group flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      {/* Toggle */}
      <button
        onClick={() => onToggle(todo._id)}
        className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Toggle complete"
      >
        {todo.completed ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "font-medium leading-snug truncate",
            todo.completed && "line-through text-muted-foreground"
          )}
        >
          {todo.title}
        </p>
        {todo.description && (
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
            {todo.description}
          </p>
        )}
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {/* Priority badge */}
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium",
              p.badge
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", p.dot)} />
            {p.label}
          </span>

          {/* Due date */}
          {todo.dueDate && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-xs",
                isOverdue ? "text-rose-500 font-medium" : "text-muted-foreground"
              )}
            >
              <CalendarDays className="h-3 w-3" />
              {format(new Date(todo.dueDate), "dd MMM yyyy")}
              {isOverdue && " · Overdue"}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(todo._id)}
        className="mt-0.5 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-rose-500 transition-all"
        aria-label="Delete todo"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </li>
  );
}