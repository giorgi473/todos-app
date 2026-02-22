'use client';

import Header from '@/components/shared/Header';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <ProtectedRoute>{children}</ProtectedRoute>
    </>
  );
}
