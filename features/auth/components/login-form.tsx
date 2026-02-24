'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
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
import { signInSchema } from '../schemas/auth-schemas';

type SignInFormValues = z.infer<typeof signInSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const signInMutation = useMutation(api.auth.signIn);
  const hashPasswordAction = useAction(api.auth.hashPasswordAction);
  const generateTokenAction = useAction(api.auth.generateTokenAction);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: SignInFormValues) {
    try {
      setIsLoading(true);

      const hashedPassword = await hashPasswordAction({
        password: values.password,
      });
      const token = await generateTokenAction();

      const result = await signInMutation({
        email: values.email,
        password: values.password,
        hashedPassword,
        token,
      });

      if (!result.success) {
        toast.error(result.error ?? 'Invalid email or password');
        return;
      }

      const { userId, email, name, token: authToken } = result;
      localStorage.setItem('userId', String(userId));
      localStorage.setItem('userEmail', email ?? '');
      localStorage.setItem('userName', name ?? '');
      localStorage.setItem('token', authToken ?? '');

      toast.success('Welcome back!');
      router.push('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sign in failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full md:max-w-xl mx-auto min-h-screen flex items-center justify-center">
      <Card className="bg-transparent rounded-none border-none shadow-none w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
          <CardDescription>Sign in to your todo account</CardDescription>
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
                        placeholder="Enter your email"
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
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
              <div className="text-gray-200 flex justify-end">
                  <Link
                    href="/reset-password"
                    className="cursor-pointer text-[15px] text-zinc-900 dark:text-[#FF9D4D] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                {/* Submit Button */}
                <div className="grid grid-cols-2 gap-3 sm:gap-7 items-center">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-13 mt-4 bg-[#FF9D4D] text-white rounded-sm hover:bg-[#FF8D3D] transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  <Link
                    // href={nextParam ? `/register?next=${encodeURIComponent(nextParam)}` : "/register"}
                    href="/sign-up"
                    className="text-[#FF9D4D] hover:text-[#FF8D3D] transition-colors duration-200 font-medium"
                    // onClick={() => onClose?.()}
                  >
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full h-13.5 mt-4 bg-gray-900 text-white rounded-sm hover:bg-gray-900 transition-all duration-200 font-semibold text-base shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Sign up
                    </Button>
                  </Link>
                </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <span className="text-zinc-600 dark:text-zinc-400">
              Don't have an account?{' '}
            </span>
            <Link
              href="/sign-up"
              className="font-medium text-[#FF9D4D] hover:text-[#FF8D3D] transition-colors"
            >
              Create Account
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
