'use client';

import {
  createContext,
  useContext,
  useMemo,
  useTransition,
  ReactNode,
} from 'react';
import { useQueryStates, parseAsInteger, parseAsString } from 'nuqs';

type PaginationContextValue = {
  page: number;
  search: string;
  goToPage: (p: number, total: number, pageSize: number) => void;
  setSearch: (value: string) => void;
};

const PaginationContext = createContext<PaginationContextValue | null>(null);

export function PaginationProvider({ children }: { children: ReactNode }) {
  const [{ search, page }, setQuery] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
  });

  const [, startTransition] = useTransition();

  const value = useMemo<PaginationContextValue>(
    () => ({
      page,
      search,
      goToPage: (p: number, total: number, pageSize: number) => {
        const totalPages = Math.max(1, Math.ceil(total / pageSize));
        if (p < 1 || p > totalPages) return;

        startTransition(() => {
          setQuery({ page: p });
        });
      },
      setSearch: (value: string) => {
        startTransition(() => {
          setQuery({ search: value, page: 1 });
        });
      },
    }),
    [page, search, setQuery],
  );

  return (
    <PaginationContext.Provider value={value}>
      {children}
    </PaginationContext.Provider>
  );
}

export function usePagination() {
  const ctx = useContext(PaginationContext);
  if (!ctx) {
    throw new Error('usePagination must be used within PaginationProvider');
  }
  return ctx;
}
