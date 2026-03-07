'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import AskAi from '@/components/shared/AskAi';
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
      <div className="fixed top-20 h-auto w-full overflow-hidden -z-10">
          <Particles/>
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
