'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {

  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      router.push('/todos');
    } else {
      router.push('/sign-up');
    }
  }, [router]);

  return null;
  
}
