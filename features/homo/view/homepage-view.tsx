import Wrapper from '@/components/shared/Wrapper';
import TodoList from '@/features/homo/components/TodoList';

function HomePage() {
  return (
    <div>
      <Wrapper className="mx-auto max-w-2xl">
        <TodoList />
      </Wrapper>
    </div>
  );
}

export default HomePage;
