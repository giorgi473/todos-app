'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import Wrapper from '@/components/shared/Wrapper';
import { Loading } from '@/components/shared/Loading';
import { SessionManager } from '@/features/settings/components/SessionManager';

export default function SettingsList() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (!storedUserId) {
      router.push('/sign-in');
      return;
    }

    setUserId(storedUserId);
    setUserName(storedUserName || '');
    setUserEmail(storedUserEmail || '');
    setIsLoading(false);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    toast.success('Signed out successfully');
    router.push('/sign-in');
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }

  return (
    <div className="w-full">
      <Wrapper className="mx-auto w-full py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings & Security</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account and security preferences
          </p>
        </div>

        <div className="grid gap-8">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Name
                </span>
                <p className="text-lg">{userName || 'Not set'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email
                </span>
                <p className="text-lg">{userEmail}</p>
              </div>
            </CardContent>
          </Card>

          {/* Sessions Management */}
          <SessionManager userId={userId} />

          {/* Sign Out */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Immediate actions that affect your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out from Current Device
              </Button>
            </CardContent>
          </Card>
        </div>
      </Wrapper>
    </div>
  );
}
