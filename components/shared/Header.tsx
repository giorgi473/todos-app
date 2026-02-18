"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Component ────────────────────────────────────────────────────────────────

export default function Header() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold tracking-tight">My Todos</h1>
        <Button
          onClick={() => router.push("/new")}
          size="sm"
          className="gap-1.5"
        >
          <Plus className="h-4 w-4" />
          New Todo
        </Button>
      </div>
    </header>
  );
}