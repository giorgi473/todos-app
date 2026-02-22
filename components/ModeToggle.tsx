'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ModeToggle() {
  const { setTheme } = useTheme();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger
        asChild
        className="cursor-pointer rounded-none border-none"
      >
        <Button variant="outline" size="icon">
          <Sun className="h-[1.6rem] w-[1.6rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.6rem] w-[1.6rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="cursor-pointer select-none border-xs rounded-none shadow-none"
      >
        <DropdownMenuItem
          onClick={() => setTheme('light')}
          className="focus:rounded-none cursor-pointer"
        >
          <Sun size={15} /> Light
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('dark')}
          className="focus:rounded-none cursor-pointer"
        >
          <Moon size={15} /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme('system')}
          className="focus:rounded-none cursor-pointer"
        >
          <Monitor size={15} /> System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
