import { Suspense } from 'react';
import LoginForm from '@/features/auth/components/login-form';

export default function LoginPage() {
  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-100 flex items-center justify-center" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
