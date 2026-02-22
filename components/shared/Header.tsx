'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UnderlinedFieldWrapper } from '@/components/shared/UnderlinedFieldWrapper';
import { UserMenuButton } from '@/components/shared/UserMenuButton';

const searchSchema = z.object({
  search: z.string(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [q] = useQueryState('search');

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: q ?? '',
    },
  });

  const handleSearchSubmit = (values: SearchFormValues) => {
    if (values.search.trim()) {
      router.push(`/todos?search=${encodeURIComponent(values.search)}`);
    } else {
      router.push('/todos');
    }
  };

  // Hide header on auth pages
  if (pathname === '/sign-up' || pathname === '/sign-in') {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 border-b bg-white dark:bg-black">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4">
        <h1 className="text-lg font-bold tracking-tight shrink-0">My Todos</h1>
        <Form {...form}>
          <form
            className="flex-1"
            onSubmit={form.handleSubmit(handleSearchSubmit)}
          >
            <FormField
              control={form.control}
              name="search"
              render={({ field, fieldState }) => (
                <FormItem className="space-y-0">
                  <FormControl>
                    <UnderlinedFieldWrapper
                      icon={
                        <button
                          type="submit"
                          className="flex items-center justify-center cursor-pointer"
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      }
                      error={!!fieldState.error}
                    >
                      <Input
                        {...field}
                        placeholder="Search todos..."
                        autoComplete="search"
                        className="h-10 w-full border-none rounded-none pl-0 pr-7 text-[8px] font-medium
                          bg-white dark:bg-black
                          text-neutral-900 dark:text-neutral-100
                          placeholder:text-neutral-400 dark:placeholder:text-neutral-600
                          focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </UnderlinedFieldWrapper>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="flex gap-2 shrink-0">
          <ModeToggle />
          <Button
            variant={'orange'}
            onClick={() => router.push('/todos/new')}
            className="gap-1.5 cursor-pointer rounded-none hover:bg-amber-500 transition-all duration-300 ease-in-out"
          >
            <Plus className="h-5 w-5" />
            New Todo
          </Button>
          <UserMenuButton />
        </div>
      </div>
    </header>
  );
}
