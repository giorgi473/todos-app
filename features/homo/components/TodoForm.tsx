'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Maximum 100 characters'),
  description: z.string().max(500, 'Maximum 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const priorityConfig = [
  {
    value: 'low',
    label: 'Low',
    dot: 'bg-emerald-400',
    submit: 'bg-emerald-500 hover:bg-emerald-600 text-white',
  },
  {
    value: 'medium',
    label: 'Medium',
    dot: 'bg-amber-400',
    submit: 'bg-amber-500 hover:bg-amber-600 text-white',
  },
  {
    value: 'high',
    label: 'High',
    dot: 'bg-rose-400',
    submit: 'bg-rose-500 hover:bg-rose-600 text-white',
  },
] as const;

interface TodoFormProps {
  mode: 'create' | 'edit';
  todoId?: Id<'todos'>;
  initialData?: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: number;
  };
  onSuccess?: () => void;
}

export default function TodoForm({
  mode,
  todoId,
  initialData,
  onSuccess,
}: TodoFormProps) {
  const create = useMutation(api.todos.create);
  const update = useMutation(api.todos.update);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      priority: initialData?.priority ?? 'medium',
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate) : undefined,
    },
  });

  // როცა initialData მოგვიანებით მოვა
  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description ?? '',
        priority: initialData.priority,
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate)
          : undefined,
      });
    }
  }, [initialData, form]);

  const isSubmitting = form.formState.isSubmitting;
  const selectedPriority = form.watch('priority');
  const activeConfig = priorityConfig.find((p) => p.value === selectedPriority);

  async function onSubmit(values: FormValues) {
    try {
      if (mode === 'create') {
        if (!userId) {
          toast.error('User ID not found. Please log in again.');
          return;
        }
        await create({
          title: values.title,
          description: values.description || undefined,
          priority: values.priority,
          dueDate: values.dueDate ? values.dueDate.getTime() : undefined,
          userId,
        });
        toast.success('Todo added successfully! ✓');
      } else if (mode === 'edit' && todoId) {
        await update({
          id: todoId,
          patch: {
            title: values.title,
            description: values.description || undefined,
            priority: values.priority,
            dueDate: values.dueDate ? values.dueDate.getTime() : undefined,
          },
        });
        toast.success('Todo updated!');
      }

      form.reset();
      onSuccess?.();
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="w-full max-w-2xl px-5 md:px-0">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {mode === 'create' ? 'New Task' : 'Edit Task'}
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          {mode === 'create' ? 'Create a Todo' : 'Update Todo'}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="What needs to be done?"
                    className="h-11 bg-muted/40 border-transparent focus:border-foreground/20 focus:bg-background transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Description{' '}
                  <span className="normal-case font-normal text-muted-foreground/70">
                    (optional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add any extra details..."
                    className="resize-none min-h-22 bg-muted/40 border-transparent focus:border-foreground/20 focus:bg-background transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Priority */}
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Priority
                </FormLabel>
                <FormControl>
                  <div className="grid grid-cols-3 gap-2">
                    {priorityConfig.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => field.onChange(p.value)}
                        className={cn(
                          'flex flex-col items-center gap-2 rounded-xl border-2 py-3 px-2 text-sm font-medium transition-all duration-150',
                          field.value === p.value
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-transparent bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                        )}
                      >
                        <span
                          className={cn('h-2.5 w-2.5 rounded-full', p.dot)}
                        />
                        {p.label}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Due Date */}
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Due Date{' '}
                  <span className="normal-case font-normal text-muted-foreground/70">
                    (optional)
                  </span>
                </FormLabel>
                <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          'w-full h-11 justify-start bg-muted/40 border-transparent hover:bg-muted font-normal transition-all',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                        {field.value
                          ? format(field.value, 'dd MMMM, yyyy')
                          : 'Pick a date'}
                        {field.value && (
                          <span
                            role="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              field.onChange(undefined);
                            }}
                            className="ml-auto text-muted-foreground hover:text-foreground text-xs"
                          >
                            ✕
                          </span>
                        )}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date ?? undefined);
                        setCalendarOpen(false);
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full h-11 font-semibold transition-all duration-200',
              activeConfig?.submit,
            )}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === 'create' ? 'Adding...' : 'Saving...'}
              </>
            ) : mode === 'create' ? (
              'Add Todo →'
            ) : (
              'Save changes →'
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
