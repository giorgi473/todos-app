'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
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
import { CalendarIcon, Loader2, Sparkles, Upload, X } from 'lucide-react';
import { formSchema } from '@/features/homo/schema/formSchema';
import { priorityConfig } from '@/features/homo/lib/priority-config';

type FormValues = z.infer<typeof formSchema>;

interface TodoFormProps {
  mode: 'create' | 'edit';
  todoId?: Id<'todos'>;
  initialData?: {
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    dueDate?: number;
    imageUrl?: string;
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
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null,
  );
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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
      imageUrl: initialData?.imageUrl ?? '',
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description ?? '',
        priority: initialData.priority,
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate)
          : undefined,
        imageUrl: initialData.imageUrl ?? '',
      });
      setImagePreview(initialData.imageUrl || null);
    }
  }, [initialData, form]);

  const isSubmitting = form.formState.isSubmitting;
  const selectedPriority = form.watch('priority');
  const activeConfig = priorityConfig.find((p) => p.value === selectedPriority);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-todo-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      form.setValue('imageUrl', data.url);
      setImagePreview(data.url);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image',
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

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
          imageUrl: values.imageUrl || undefined,
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
            imageUrl: values.imageUrl || undefined,
          },
        });
        toast.success('Todo updated!');
      }

      form.reset();
      setImagePreview(null);
      onSuccess?.();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.';
      toast.error(errorMessage);
    }
  }

  return (
    <div className="w-full mb-20">
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

          {/* Image Upload */}
          <FormField
            control={form.control}
            name="imageUrl"
            render={() => (
              <FormItem>
                <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Image{' '}
                  <span className="normal-case font-normal text-muted-foreground/70">
                    (optional)
                  </span>
                </FormLabel>
                <div className="space-y-3">
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="relative w-full rounded-sm overflow-hidden bg-muted/40 aspect-video">
                      <Image
                        src={imagePreview}
                        alt="Todo preview"
                        fill
                        className="object-cover"
                        quality={85}
                        priority={false}
                        sizes="(max-width: 640px) 100vw, 800px"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          form.setValue('imageUrl', '');
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-[#FF9D4D] hover:bg-[#FF9D4D] cursor-pointer rounded-sm text-white transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {/* Upload Input */}
                  {!imagePreview && (
                    <FormControl>
                      <label className="relative block w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-3 w-full h-32 rounded-lg border-2 border-dashed border-border/50 bg-muted/40 hover:bg-muted/60 cursor-pointer transition-all hover:border-border disabled:opacity-50 disabled:cursor-not-allowed">
                          {isUploadingImage ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Uploading...
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Click to upload image
                              </span>
                            </>
                          )}
                        </div>
                      </label>
                    </FormControl>
                  )}
                </div>
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
