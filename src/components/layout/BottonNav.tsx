"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function BottomNav() {
  const pathname = usePathname();

  // Helper to check active state
  const isActive = (path: string) => 
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 border-t border-white/10 bg-background/95 backdrop-blur-xl pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.3)]">
      <div className="max-w-xl mx-auto flex items-center justify-center h-18 sm:h-16 gap-2 sm:gap-6 px-2 sm:px-4">
        
        {/* Route 1: Log */}
        <Link 
          href="/" 
          className={`
            flex-1 sm:flex-none text-center text-sm font-medium tracking-wide 
            transition-all duration-300 px-3 py-3 sm:py-2 rounded-lg sm:rounded-none
            active:scale-95 sm:active:scale-100
            ${isActive("/") 
              ? "text-foreground bg-white/5 sm:bg-transparent" 
              : "text-muted-foreground/50 hover:text-muted-foreground/70 hover:bg-white/3 sm:hover:bg-transparent"
            }
          `}
        >
          Log
        </Link>

        {/* Quiet Divider */}
        <div className="hidden sm:block w-px h-4 bg-white/8" />

        {/* Route 2: Today */}
        <Link 
          href="/analytics/today" 
          className={`
            flex-1 sm:flex-none text-center text-sm font-medium tracking-wide 
            transition-all duration-300 px-3 py-3 sm:py-2 rounded-lg sm:rounded-none
            active:scale-95 sm:active:scale-100
            ${isActive("/analytics/today") 
              ? "text-foreground bg-white/5 sm:bg-transparent" 
              : "text-muted-foreground/50 hover:text-muted-foreground/70 hover:bg-white/3 sm:hover:bg-transparent"
            }
          `}
        >
          Reflection
        </Link>

        {/* Quiet Divider */}
        <div className="hidden sm:block w-px h-4 bg-white/8" />

        {/* Route 3: Weekly */}
        <Link 
          href="/analytics/week" 
          className={`
            flex-1 sm:flex-none text-center text-sm font-medium tracking-wide 
            transition-all duration-300 px-3 py-3 sm:py-2 rounded-lg sm:rounded-none
            active:scale-95 sm:active:scale-100
            ${isActive("/analytics/week") 
              ? "text-foreground bg-white/5 sm:bg-transparent" 
              : "text-muted-foreground/50 hover:text-muted-foreground/70 hover:bg-white/3 sm:hover:bg-transparent"
            }
          `}
        >
          Pattern
        </Link>

      </div>
    </nav>
  );
}