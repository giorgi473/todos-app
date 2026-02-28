'use client';

import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

export function UserMenuButton() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem('userName'));
    setUserId(localStorage.getItem('userId'));
    setUserEmail(localStorage.getItem('userEmail'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    router.push('/sign-in');
  };

  const handleProfile = () => {
    router.push('/todos/profile');
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-xs border-none cursor-pointer"
        >
          <UserIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 rounded-xs">
        {userId && userName ? (
          <>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium leading-none">{userName}</p>
              <p className="text-xs text-muted-foreground">{userEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleProfile}
              className="cursor-pointer text-zinc-900 dark:text-zinc-200 rounded-xs"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-[#ff9D4D] rounded-xs"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </>
        ) : (
          <div className="px-2 py-1.5">
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
