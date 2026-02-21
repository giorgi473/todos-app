'use client';

import { Fragment } from 'react';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

function getPageNumbers(page: number, totalPages: number) {
  const delta = 2;
  const range: (number | '...')[] = [];
  const rangeWithDots: (number | '...')[] = [];

  if (totalPages <= 1) return [1];

  for (
    let i = Math.max(2, page - delta);
    i <= Math.min(totalPages - 1, page + delta);
    i++
  ) {
    range.push(i);
  }

  if (page - delta > 2) {
    rangeWithDots.push(1, '...');
  } else {
    rangeWithDots.push(1);
  }

  rangeWithDots.push(...range);

  if (page + delta < totalPages - 1) {
    rangeWithDots.push('...', totalPages);
  } else {
    if (totalPages > 1) rangeWithDots.push(totalPages);
  }

  return rangeWithDots;
}

export function Pagination({
  page,
  total,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = getPageNumbers(page, totalPages);

  if (totalPages <= 1) return null;

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    onPageChange(p);
  };

  return (
    <div className="select-none">
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xs text-sm transition-colors cursor-pointer',
            'dark:bg-[#171717] bg-zinc-200 text-zinc-700 dark:text-[#6b6b6b]',
            'disabled:opacity-70',
          )}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        {pageNumbers.map((p, i) => (
          <Fragment key={`${p}-${i}`}>
            {p === '...' ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#171717] text-[#6b6b6b] text-sm">
                ...
              </div>
            ) : (
              <button
                onClick={() => goToPage(p as number)}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xs text-sm font-semibold transition-colors cursor-pointer',
                  p === page
                    ? 'bg-[#ff9D4D] text-black'
                    : 'dark:bg-[#171717] bg-zinc-200 text-[#7d7d7d]',
                )}
              >
                {p}
              </button>
            )}
          </Fragment>
        ))}
        <button
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xs text-sm transition-colors cursor-pointer',
            'dark:bg-[#171717] bg-zinc-200 text-zinc-700 dark:text-[#6b6b6b]',
            'disabled:opacity-70',
          )}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
