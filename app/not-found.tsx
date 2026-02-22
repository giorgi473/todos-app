'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400">
            404
          </h1>
          <h2 className="text-3xl font-bold text-foreground">Page Not Found</h2>
          <p className="text-lg text-muted-foreground">
            Sorry, the page you're looking for doesn't exist.
          </p>
        </div>
        <div className="flex gap-3 flex-col sm:flex-row justify-center pt-4">
          <Button asChild className="gap-2" variant="default">
            <Link href="/todos">
              <Home className="h-4 w-4" />
              Go to Home
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </Button>
        </div>
        <div className="pt-8 text-sm text-muted-foreground">
          <p>Error Code: 404</p>
          <p className="text-xs mt-2">Page not found</p>
        </div>
      </div>
    </div>
  );
}
