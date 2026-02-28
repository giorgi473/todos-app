'use client';

import { useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryState } from 'nuqs';
import Link from 'next/link';
import { z } from 'zod';
import { Plus, Search, Menu } from 'lucide-react';
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

interface HeaderProps {
  isAskAiOpen: boolean;
  setIsAskAiOpen: (open: boolean) => void;
}

export default function Header({ isAskAiOpen, setIsAskAiOpen }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [q] = useQueryState('search');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    setIsMobileMenuOpen(false);
  };

  if (pathname === '/sign-up' || pathname === '/sign-in') {
    return null;
  }

  useEffect(() => {
    if (isMobileMenuOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b-2 bg-white dark:bg-black py-2">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-1 md:gap-4 px-4 py-4">
          {/* LOGO MOBILE */}
          <Link
            href="/todos"
            className="flex items-center gap-2 shrink-0 md:hidden"
          >
            <h1 className="text-lg font-bold tracking-tight shrink-0">
              My Todos
            </h1>
          </Link>

          {/* LOGO DESKTOP */}
          <Link
            href="/todos"
            className="hidden items-center gap-2 shrink-0 md:flex"
          >
            <h1 className="text-lg font-bold tracking-tight shrink-0">
              My Todos
            </h1>
          </Link>

          {/* MOBILE RIGHT SIDE - ASK AI, USER, HAMBURGER */}
          <div className="flex md:hidden items-center gap-1">
            <div className="flex items-center justify-center">
              <AskAi
                isOpen={isAskAiOpen}
                onOpenChange={setIsAskAiOpen}
                label=""
              />
            </div>
            <UserMenuButton />
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center rounded-xs p-2.5 hover:bg-neutral-100 dark:bg-neutral-950"
            >
              <Menu className="h-4 w-4" />
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

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div>
              <AskAi
                isOpen={isAskAiOpen}
                onOpenChange={setIsAskAiOpen}
                label="Ask Ai"
              />
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

      {/* MOBILE MENU OVERLAY */}
      <div
        className={`
          fixed inset-x-0 top-20 z-20 md:hidden 
          transform transition-all duration-300
          ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div className="bg-white dark:bg-black border-b-2 border-neutral-200 dark:border-neutral-800">
          <div className="mx-auto max-w-2xl px-4 py-4 space-y-4">
            {/* Search in menu */}
            <Form {...form}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit(handleSearchSubmit)();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <FormField
                  control={form.control}
                  name="search"
                  render={({ field }) => (
                    <FormItem className="flex-1 space-y-0">
                      <FormControl>
                        <UnderlinedFieldWrapper>
                          <Input
                            {...field}
                            placeholder="Search todos..."
                            autoComplete="search"
                            className="
                              h-10 w-full rounded-sm border-none active:border-none
                              bg-neutral-100 dark:bg-neutral-800 text-sm
                              text-neutral-900 placeholder:text-neutral-400
                              dark:text-neutral-50 dark:placeholder:text-neutral-500
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
                  className="flex w-8.5 h-8.5 items-center justify-center rounded-xs bg-zinc-800 text-white"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </Form>

            {/* Divider */}
            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

            {/* Menu items */}
            <div className="space-y-2">
              {/* New Todo */}
              <Button
                variant={'orange'}
                onClick={() => {
                  router.push('/todos/new');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full gap-1.5 cursor-pointer rounded-none hover:bg-amber-500 transition-all duration-300 ease-in-out"
              >
                <Plus className="h-5 w-5" />
                New Todo
              </Button>

              {/* Mode Toggle */}
              <div
                className="flex items-center justify-between py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="text-sm font-medium">Theme</span>
                <ModeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
