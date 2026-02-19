"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UnderlinedFieldWrapper } from "@/components/shared/UnderlinedFieldWrapper";

const searchSchema = z.object({
  search: z.string(),
});

type SearchFormValues = z.infer<typeof searchSchema>;

export default function Header() {
  const router = useRouter();
  const [q, setQ] = useQueryState("search");

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      search: q ?? "",
    },
  });

  return (
    <header className="sticky top-0 z-10 border-b">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-4">
        <h1 className="text-xl font-bold tracking-tight shrink-0">My Todos</h1>

        <Form {...form}>
          <form
            className="flex-1"
            onSubmit={(e) => e.preventDefault()}
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
                          type="button"
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
                        onChange={(e) => {
                          field.onChange(e);
                          setQ(e.target.value || null);
                        }}
                        className="h-10 w-full border-none rounded-none pl-0 pr-7 text-xs md:text-sm font-medium
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
            onClick={() => router.push("/new")}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New Todo
          </Button>
        </div>
      </div>
    </header>
  );
}