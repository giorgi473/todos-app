'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LogOut, Settings } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { UserProfileDialog } from './UserProfileDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

export function UserMenuButton() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

  const user = useQuery(api.auth.getUserProfile, userId ? { userId } : 'skip');

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedEmail = localStorage.getItem('userEmail');
    setUserId(storedUserId);
    setUserEmail(storedEmail);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userProfileImage');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    router.push('/sign-in');
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8.5 w-8.5 cursor-pointer ring-2 ring-[#ff9D4D]">
            {user?.profileImage && (
              <AvatarImage
                src={user.profileImage}
                alt={user.name || 'Avatar'}
              />
            )}
            <AvatarFallback className="bg-linear-to-br from-primary to-primary/60 text-white font-medium">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={24}
          className="w-56 rounded-xs"
        >
          {userId && user?.name ? (
            <>
              <div className="flex gap-3 px-2 py-2 items-center">
                <Avatar className="h-10 w-10 shrink-0 ring-2 ring-[#ff9D4D]">
                  {user?.profileImage && (
                    <AvatarImage
                      src={user.profileImage}
                      alt={user.name || 'Avatar'}
                    />
                  )}
                  <AvatarFallback className="bg-linear-to-br from-primary to-primary/60 text-white font-medium text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium leading-none truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsProfileDialogOpen(true)}
                className="cursor-pointer text-zinc-900 dark:text-zinc-200 rounded-xs gap-2"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-[#ff9D4D] rounded-xs gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </>
          ) : (
            <div className="px-2 py-1.5">
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        userId={userId}
        userName={user?.name || null}
        userEmail={user?.email || null}
        profileImage={user?.profileImage || null}
      />
    </>
  );
}
