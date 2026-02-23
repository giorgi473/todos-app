import { Suspense } from 'react';
import Wrapper from '@/components/shared/Wrapper';
import TodoList from '@/features/homo/components/TodoList';
import { TodoListSkeleton } from '@/features/homo/components/TodoListSkeleton';

function HomePage() {
  return (
    <div className="w-full">
      <Wrapper className="mx-auto w-full max-w-4xl">
        <Suspense fallback={<TodoListSkeleton />}>
          <TodoList />
        </Suspense>
      </Wrapper>
    </div>
  );
}

export default HomePage;
