import type { Metadata } from 'next';
import '../../globals.css';
import Wrapper from '@/components/shared/Wrapper';

export const metadata: Metadata = {
  title: 'My Todos',
  description: 'Manage your todos',
};

export default function TodosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen">
      <Wrapper className="mx-auto flex flex-col items-center justify-start">
        {children}
      </Wrapper>
    </div>
  );
}
