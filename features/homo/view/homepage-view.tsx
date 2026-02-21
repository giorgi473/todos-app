import { Suspense } from 'react';
import Wrapper from '@/components/shared/Wrapper';
import TodoList from '@/features/homo/components/TodoList';
import { TodoListSkeleton } from '@/features/homo/components/TodoListSkeleton';

function HomePage() {
  return (
    <div>
      <Wrapper className="mx-auto max-w-2xl">
        <Suspense fallback={<TodoListSkeleton />}>
          <TodoList />
        </Suspense>
      </Wrapper>
    </div>
  );
}

export default HomePage;
