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
import { signUpSchema } from '../schemas/auth-schemas';

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const signUpMutation = useMutation(api.auth.signUp);
  const hashPasswordAction = useAction(api.auth.hashPasswordAction);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: SignUpFormValues) {
    try {
      setIsLoading(true);
      const hashedPassword = await hashPasswordAction({
        password: values.password,
      });

      const result = await signUpMutation({
        email: values.email,
        password: values.password,
        name: values.name,
        hashedPassword,
      });

      if (result.userId) {
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userEmail', result.email);
        localStorage.setItem('userName', result.name || '');
      }

      toast.success('Account created successfully!');
      router.push('/todos');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full md:max-w-xl mx-auto min-h-screen flex items-center justify-center">
      <Card className="bg-transparent rounded-none border-none shadow-none w-full">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
          <CardDescription>Join our modern todo app today</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repeat your password"
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
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{' '}
            </span>
            <Link
              href="/sign-in"
              className="font-medium text-[#FF9D4D] hover:text-[#FF8D3D] transition-colors"
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
