'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-red-600 dark:text-red-400">
            Oops!
          </h1>
          <h2 className="text-3xl font-bold text-foreground">
            Something went wrong
          </h2>
          <p className="text-lg text-muted-foreground">
            An unexpected error occurred. Please try again or go back.
          </p>
        </div>

        <div className="flex gap-3 flex-col sm:flex-row justify-center pt-4">
          <Button onClick={reset} className="gap-2" variant="default">
            Try Again
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/todos">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="pt-8 text-sm text-muted-foreground border-t">
            <p className="text-red-500 text-xs font-mono wrap-break-word">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
