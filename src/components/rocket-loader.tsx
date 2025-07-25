"use client";

import { Sparkles } from "lucide-react";

export function RocketLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="flex items-center justify-center space-x-2">
        <Sparkles className="h-12 w-12 text-primary animate-pulse-star" style={{ animationDelay: '0s' }} />
        <Sparkles className="h-12 w-12 text-primary animate-pulse-star" style={{ animationDelay: '0.2s' }} />
        <Sparkles className="h-12 w-12 text-primary animate-pulse-star" style={{ animationDelay: '0.4s' }} />
      </div>
      <p className="text-lg font-semibold text-muted-foreground animate-pulse">
        Meracik Keajaiban...
      </p>
    </div>
  );
}
