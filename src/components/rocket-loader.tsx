"use client";

import { Wand2 } from "lucide-react";

export function RocketLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16">
      <div className="w-28 h-28 relative">
        {/* Main large star */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full absolute top-0 left-0 animate-twinkle"
        >
          <path
            d="M50 0 L61.2 35.5 H98 L70.6 57.5 L81.2 93 L50 71 L18.8 93 L29.4 57.5 L2 35.5 H38.8 Z"
            className="fill-primary/80"
          />
        </svg>

        {/* Small sparkling stars */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-[10%] left-[15%] w-3 h-3 animate-sparkle" style={{ animationDelay: "0s" }}>
             <svg viewBox="0 0 10 10"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" className="fill-accent/90" /></svg>
          </div>
          <div className="absolute top-[20%] right-[10%] w-4 h-4 animate-sparkle" style={{ animationDelay: "-0.2s" }}>
            <svg viewBox="0 0 10 10"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" className="fill-accent" /></svg>
          </div>
          <div className="absolute bottom-[15%] left-[20%] w-2 h-2 animate-sparkle" style={{ animationDelay: "-0.5s" }}>
             <svg viewBox="0 0 10 10"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" className="fill-primary-foreground/70" /></svg>
          </div>
          <div className="absolute bottom-[25%] right-[25%] w-3 h-3 animate-sparkle" style={{ animationDelay: "-0.8s" }}>
             <svg viewBox="0 0 10 10"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" className="fill-accent/80" /></svg>
          </div>
           <div className="absolute top-[50%] left-[5%] w-2 h-2 animate-sparkle" style={{ animationDelay: "-1.1s" }}>
             <svg viewBox="0 0 10 10"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" className="fill-primary-foreground/90" /></svg>
          </div>
        </div>
      </div>
      <p className="text-lg font-semibold text-muted-foreground animate-pulse">
        Meracik Keajaiban...
      </p>
    </div>
  );
}
