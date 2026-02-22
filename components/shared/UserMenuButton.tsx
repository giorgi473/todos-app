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
  const [mounted, setMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setUserName(localStorage.getItem('userName'));
    setUserId(localStorage.getItem('userId'));
    setUserEmail(localStorage.getItem('userEmail'));
    setMounted(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    router.push('/sign-in');
  };

  if (!mounted || !userId || !userName) {
    return null;
  }

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
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium leading-none">{userName}</p>
          <p className="text-xs text-muted-foreground">{userEmail}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 dark:text-red-400 rounded-xs focus:bg-red-50 dark:focus:bg-red-950"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
