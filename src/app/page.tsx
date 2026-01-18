"use client";

import Link from "next/link";
import TimeLogRow from "@/components/log/TimeLogRow";
import { useDailyLogSync } from "@/hooks/useDailyLogSync"; // <--- Fixed: Added { }
import SignOutButton from "@/components/ui/SignOutButton";

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
  const todayKey = new Date().toISOString().split('T')[0];
  
  // Use the Sync hook instead of the Local one
  const { log, updateEntry, isLoaded } = useDailyLogSync(todayKey); 

  const todayDisplay = new Date().toLocaleDateString("en-US", { 
    weekday: "long", month: "short", day: "numeric" 
  });

  if (!isLoaded) return <div className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen w-full flex justify-center bg-background px-4 pb-32">
      <div className="w-full max-w-xl pt-12">
        <header className="mb-12 pl-2 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-medium tracking-tight text-foreground/90">{todayDisplay}</h1>
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