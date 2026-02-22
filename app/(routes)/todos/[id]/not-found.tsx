'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-orange-600 dark:text-orange-400">
            404
          </h1>
          <h2 className="text-3xl font-bold text-foreground">Todo Not Found</h2>
          <p className="text-lg text-muted-foreground">
            Sorry, the todo you're looking for doesn't exist or has been
            deleted.
          </p>
        </div>
        <div className="flex gap-3 flex-col justify-center pt-4">
          <Button asChild className="gap-2" variant="default">
            <Link href="/todos">
              <Home className="h-4 w-4" />
              Back to Todos
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <button onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </button>
          </Button>
        </div>
      </div>
    </div>
  );
}
