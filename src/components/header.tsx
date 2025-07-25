"use client";

import { ThemeToggle } from '@/components/theme-toggle';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <div className="font-bold text-[36px] tracking-[0.2em] leading-none">VISIG</div>
              <div className="text-xs text-muted-foreground">viral script generator</div>
            </div>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
