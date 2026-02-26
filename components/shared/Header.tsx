'use client';

import { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ModeToggle';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UnderlinedFieldWrapper } from '@/components/shared/UnderlinedFieldWrapper';
import { UserMenuButton } from '@/components/shared/UserMenuButton';
import AskAi from '@/components/shared/AskAi';

const searchSchema = z.object({
  search: z.string(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [q] = useQueryState('search');

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement | null>(null);

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
    setIsMobileSearchOpen(false);
  };

  if (pathname === '/sign-up' || pathname === '/sign-in') {
    return null;
  }

  useEffect(() => {
    if (isMobileSearchOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  return (
    <>
      <header className="sticky top-0 z-20 border-b-2 bg-white dark:bg-black py-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-1 md:gap-4 px-4 py-4">
          <h1 className="text-lg font-bold tracking-tight shrink-0">
            My Todos
          </h1>

          {/* MOBILE SEARCH ICON */}
          <div className="flex flex-1 items-center justify-end md:hidden">
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(true)}
              className="flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Search className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* DESKTOP SEARCH */}
          <Form {...form}>
            <form
              className="hidden md:flex flex-1 px-10"
              onSubmit={form.handleSubmit(handleSearchSubmit)}
            >
              <FormField
                control={form.control}
                name="search"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-0 flex-1">
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
                          className="h-10 w-full border-none hidden md:flex rounded-none pl-0 pr-7 text-[8px] font-medium
                            bg-white dark:bg-black
                            text-neutral-900 dark:text-neutral-100
                            placeholder:text-neutral-400 dark:placeholder:text-neutral-600
                            focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none"
                        />
                      </UnderlinedFieldWrapper>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="flex items-center gap-2 shrink-0">
            <div>
              <AskAi isOpen={isAskAiOpen} onOpenChange={setIsAskAiOpen} />
            </div>
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

      {/* MOBILE SEARCH OVERLAY */}
      <div
        className={`
          fixed inset-x-0 top-0 z-30 md:hidden
          transform transition-transform duration-300
          ${isMobileSearchOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="bg-black border-b-2 backdrop-blur-sm min-h-40 pb-4">
          <div className="mx-auto max-w-2xl px-4 pt-14">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSearchSubmit)}
                className="flex items-center gap-2"
              >
                <button
                  type="button"
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-0">
                      <FormControl>
                        <UnderlinedFieldWrapper>
                          <Input
                            {...field}
                            ref={mobileInputRef}
                            placeholder="Search todos..."
                            autoComplete="search"
                            className="
                              h-12 w-full rounded-sm border-none active:border-none
                              bg-white text-sm
                              text-neutral-900 placeholder:text-neutral-400
                              dark:bg-neutral-900 dark:text-neutral-50 dark:placeholder:text-neutral-400
                              focus:outline-none focus:border-none hover:border-none focus-visible:ring-0 focus-visible:ring-offset-0
                            "
                          />
                        </UnderlinedFieldWrapper>
                      </FormControl>
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  className="flex w-9 h-9 items-center justify-center rounded-full bg-[#ff9D4D] text-white hover:bg-[#ff9D4D]/90"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}
