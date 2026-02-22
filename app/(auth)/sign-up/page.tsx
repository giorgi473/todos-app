import { Suspense } from "react";
import RegisterForm from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div>
      <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center" />}>
        <RegisterForm />
      </Suspense>
    </div>
  );
}