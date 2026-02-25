'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { forgotPasswordSchema } from '../schemas/auth-schemas';

type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

/**
 * Simple form that asks for an email address. Always returns a success
 * message even if the email isn't registered, to avoid leaking information.
 */
export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const requestReset = useMutation(api.auth.requestPasswordReset);

  const form = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: ForgotFormValues) {
    try {
      setIsLoading(true);
      const result = await requestReset({ email: values.email });
      // Construct link from token on frontend
      if (result.token) {
        const baseUrl =
          typeof window !== 'undefined'
            ? window.location.origin
            : 'http://localhost:3000';
        const link = `${baseUrl}/reset-password?token=${result.token}`;
        console.log('Reset link (dev only):', link);
        setDevLink(link);
      }

      // Inform the developer about the link display
      toast.success('Reset link generated and displayed below');
      form.reset();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto md:max-w-xl min-h-screen flex items-center justify-center">
      <Card className="bg-transparent rounded-none border-none shadow-none w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        disabled={isLoading}
                        className="h-13 w-full bg-[#101828] border-2 rounded-sm text-xs text-neutral-100 placeholder:text-neutral-400 focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                        style={{
                          boxShadow: 'inset 0 0 0 1000px #101828',
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-3 sm:gap-4 items-center">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/sign-in')}
                  className="w-full h-13.5 mt-4 bg-gray-900 cursor-pointer text-white rounded-sm hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 mt-4 bg-[#FF9D4D] cursor-pointer text-white rounded-sm hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </div>
            </form>
          </Form>
          {devLink && (
            <div className="mt-6 text-center">
              <a
                href={devLink}
                className="inline-block px-4 py-2 bg-[#FF9D4D] text-white rounded-sm hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-sm hover:shadow-lg"
              >
                Reset Password
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
