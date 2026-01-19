"use client";

import { useState } from "react"; // [NEW] Import useState
import Link from "next/link";
import TimeLogRow from "@/components/log/TimeLogRow";
import { useDailyLogSync } from "@/hooks/useDailyLogSync";
import SignOutButton from "@/components/ui/SignOutButton";
import { ChevronLeft, ChevronRight } from "lucide-react"; // [NEW] Icons

// ... keep your generateTimeSlots function exactly as it is ...
function generateTimeSlots() {
  const slots = [];
  // From 5:00 AM to 11:30 PM (current day)
  for (let i = 5; i <= 23; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
    slots.push(`${i.toString().padStart(2, '0')}:30`);
  }
  // From 0:00 AM to 4:30 AM (next day)
  for (let i = 0; i <= 4; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
    slots.push(`${i.toString().padStart(2, '0')}:30`);
  }
  return slots;
}

export default function Home() {
  const timeSlots = generateTimeSlots();
  
  // [NEW] State for the currently selected date
  // Initialize with today's date in YYYY-MM-DD format
  const [currentDate, setCurrentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  // [NEW] Navigation Handlers
  const changeDate = (days: number) => {
    const date = new Date(currentDate);
    date.setDate(date.getDate() + days);
    setCurrentDate(date.toISOString().split('T')[0]);
  };

  // Connect the hook to the dynamic currentDate, not a hardcoded one
  const { log, updateEntry, isLoaded } = useDailyLogSync(currentDate); 

  // [NEW] Dynamic Date Display
  const dateDisplay = new Date(currentDate).toLocaleDateString("en-US", { 
    weekday: "long", month: "short", day: "numeric" 
  });

  // Check if "today" is selected to disable the "Next" arrow (optional, but good UX)
  const isToday = currentDate === new Date().toISOString().split('T')[0];

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen w-full flex justify-center bg-background px-4 pb-32">
      <div className="w-full max-w-xl pt-12">
        <header className="mb-12 pl-2 flex justify-between items-start">
          <div>
            {/* [NEW] Navigation UI */}
            <div className="flex items-center gap-3 mb-1">
              <button 
                onClick={() => changeDate(-1)}
                className="p-1 -ml-1 text-muted-foreground/40 hover:text-foreground hover:bg-white/5 rounded transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              
              <h1 className="text-xl font-medium tracking-tight text-foreground/90">
                {dateDisplay}
              </h1>

              <button 
                onClick={() => changeDate(1)}
                disabled={isToday}
                className={`
                  p-1 text-muted-foreground/40 rounded transition-all
                  ${isToday 
                    ? "opacity-30 cursor-not-allowed" 
                    : "hover:text-foreground hover:bg-white/5"
                  }
                `}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <p className="text-sm text-muted-foreground/50 mt-1">Log what happened. Nothing more.</p>
            
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/analytics/today"
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
              >
                Today Reflection →
              </Link>
              <span className="text-xs text-muted-foreground/20">·</span>
              <Link
                href="/analytics/week"
                className="text-xs text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors"
              >
                Weekly Pattern →
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/settings"
              className="text-xs font-medium text-muted-foreground/30 hover:text-muted-foreground/50 transition-colors tracking-wide uppercase"
            >
              Settings
            </Link>
            <SignOutButton />
          </div>
        </header>

        <div className="flex flex-col">
          {timeSlots.map((slot) => (
            <TimeLogRow 
              key={slot} 
              timeLabel={slot} 
              entry={log[slot]} 
              onUpdate={(updates) => updateEntry(slot, updates)} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}