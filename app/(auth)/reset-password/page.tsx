import { Suspense } from 'react';
import ForgotPasswordForm from '@/features/auth/components/forgot-password-form';
import ResetPasswordForm from '@/features/auth/components/reset-password-form';

interface PageProps {
  searchParams?: { token?: string };
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  // searchParams is a Promise in Next.js. Await it before accessing properties.
  const params = await searchParams;
  const token = params?.token;

  return (
    <div>
      <Suspense
        fallback={
          <div className="min-h-100 flex items-center justify-center" />
        }
      >
        {token ? <ResetPasswordForm token={token} /> : <ForgotPasswordForm />}
      </Suspense>
    </div>
  );
}
