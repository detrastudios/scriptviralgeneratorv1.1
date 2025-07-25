"use client";

import { cn } from "@/lib/utils";

export function RocketLoader() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="w-24 h-24 relative">
        <svg
          viewBox="0 0 100 150"
          className="w-full h-full absolute top-0 left-0 animate-[launch_1.5s_ease-in-out_infinite]"
          style={{ animationName: "launch" }}
        >
          <g className="rocket-body">
            {/* Rocket Body */}
            <path
              d="M50 10 C 40 30, 40 70, 50 90 C 60 70, 60 30, 50 10 Z"
              className="fill-primary"
            />
            {/* Window */}
            <circle cx="50" cy="40" r="8" className="fill-background" />
            {/* Fins */}
            <path
              d="M50 90 C 35 110, 30 120, 30 120 L 40 95 Z"
              className="fill-primary-foreground/50"
            />
            <path
              d="M50 90 C 65 110, 70 120, 70 120 L 60 95 Z"
              className="fill-primary-foreground/50"
            />
            {/* Flame */}
            <path
              d="M42 90 C 38 110, 50 130, 50 130 C 50 130, 62 110, 58 90 Z"
              className="fill-destructive"
            />
          </g>
        </svg>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-24">
          <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-muted smoke smoke-1"></div>
          <div className="absolute bottom-[-20px] left-[45%] -translate-x-1/2 w-3 h-3 rounded-full bg-muted smoke smoke-2"></div>
          <div className="absolute bottom-[-20px] left-[55%] -translate-x-1/2 w-2 h-2 rounded-full bg-muted smoke smoke-3"></div>
          <div className="absolute bottom-[-25px] left-[50%] -translate-x-1/2 w-4 h-4 rounded-full bg-muted smoke smoke-4"></div>
          <div className="absolute bottom-[-25px] left-[40%] -translate-x-1/2 w-3 h-3 rounded-full bg-muted smoke smoke-5"></div>
        </div>
      </div>
      <p className="text-lg font-semibold text-muted-foreground animate-pulse">
        Melesat ke Angkasa Ide...
      </p>
    </div>
  );
}
