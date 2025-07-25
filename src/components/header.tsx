"use client";

import { ThemeToggle } from '@/components/theme-toggle';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 max-w-screen-2xl items-center">
        <a href="/" className="mr-6 flex items-center space-x-3">
          <div className="bg-primary/20 p-2 rounded-lg">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg">VISIG</span>
        </a>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
