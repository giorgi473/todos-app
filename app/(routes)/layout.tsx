'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AskAi from '@/components/shared/AskAi';
import SnowCanvas from '@/components/SnowCanvas';
import { Particles } from '@/components/ui/particles';

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAskAiOpen, setIsAskAiOpen] = useState(false);

  return (
    <>
      <Header isAskAiOpen={isAskAiOpen} setIsAskAiOpen={setIsAskAiOpen} />
      <SnowCanvas />
      <div className="fixed top-20 hidden xl:inline-block h-auto w-full overflow-hidden -z-10">
        <Particles />
      </div>
      <aside className="relative">
        <div
          className={`fixed bottom-10 right-10 z-50 ${isAskAiOpen ? 'hidden' : 'flex'}`}
        >
          <AskAi isOpen={isAskAiOpen} onOpenChange={setIsAskAiOpen} label="" />
        </div>
      </aside>
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
