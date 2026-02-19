'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import TodoForm from '@/features/homo/components/TodoForm';

export default function NewTodoPage() {
  const router = useRouter();

  return (
    <React.Fragment>
      <header className="bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex items-center gap-3 px-3 py-4 select-none">
          <button
            onClick={() => router.push('/')}
            aria-label="Back"
            className="cursor-pointer select-none"
          >
            <ArrowLeft className="h-5 w-5 mt-0.5" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">New Todo</h1>
        </div>
      </header>
      <TodoForm mode="create" onSuccess={() => router.push('/')} />
    </React.Fragment>
  );
}
