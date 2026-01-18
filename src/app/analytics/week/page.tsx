"use client";

import Link from "next/link";
import { useWeeklyHistory } from "@/hooks/useWeeklyHistory";
import { calculateDailyEnergy, getDominantEnergy, EnergyType } from "@/lib/energy";
import { useMemo } from "react";
import SignOutButton from "@/components/ui/SignOutButton";
import { calculateMatrix, generateMatrixInterpretation } from "@/lib/matrix";
import { LogEntry } from "@/types";
import MatrixGrid from "@/components/analytics/MatrixGrid";

export default function WeeklyAnalytics() {
  const { history, loading } = useWeeklyHistory();

  const stats = useMemo(() => {
    let totalSlots = 0;
    const weeklyEnergy: Record<EnergyType, number> = { Physical: 0, Mental: 0, Emotional: 0, Spiritual: 0 };
    const taskFrequency: Record<string, number> = {};
    const days: { date: string; slotsLogged: number; dominantEnergy: EnergyType | null }[] = [];
    const allEntries: LogEntry[] = [];

    // Process each day
    history.forEach(({ date, log }) => {
      const entries = Object.values(log);
      const slotsLogged = entries.filter(e => e.tasks.length > 0).length;
      totalSlots += slotsLogged;

      // Collect all entries for weekly matrix calculation
      entries.forEach(entry => {
        if (entry.tasks.length > 0) {
          allEntries.push(entry);
        }
      });

      // Calculate Day's Energy
      const dayScores: Record<EnergyType, number> = { Physical: 0, Mental: 0, Emotional: 0, Spiritual: 0 };
      
      entries.forEach(entry => {
        // Energy
        const entryEnergy = calculateDailyEnergy(entry.tasks, entry.important, entry.urgent);
        (Object.keys(entryEnergy) as EnergyType[]).forEach(k => {
          dayScores[k] += entryEnergy[k];
          weeklyEnergy[k] += entryEnergy[k];
        });

        // Tasks
        entry.tasks.forEach(t => {
          const label = t.label.toLowerCase().trim();
          taskFrequency[label] = (taskFrequency[label] || 0) + 1;
        });
      });

      days.push({
        date,
        slotsLogged,
        dominantEnergy: getDominantEnergy(dayScores)
      });
    });

    // Repeating Tasks (>= 3 times)
    const repeatingTasks = Object.entries(taskFrequency)
      .filter(([, count]) => count >= 3)
      .sort(([, a], [, b]) => b - a)
      .map(([label]) => label);

    // Weekly Dominant
    const weeklyDominant = getDominantEnergy(weeklyEnergy);

    // Calculate Weekly Matrix
    const weeklyMatrix = calculateMatrix(allEntries);

    return { days, weeklyEnergy, repeatingTasks, weeklyDominant, totalSlots, weeklyMatrix };
  }, [history]);

  if (loading) return <div className="min-h-screen bg-background" />;

  return (
    <main className="min-h-screen w-full flex justify-center bg-background px-3 sm:px-4 pb-32 sm:pb-24">
      <div className="w-full max-w-xl pt-8 sm:pt-12">
        
        {/* Header */}
        <header className="mb-10 sm:mb-12 pl-1 sm:pl-2 flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-xl font-medium tracking-tight text-foreground/95">Weekly Pattern</h1>
            <p className="text-sm text-muted-foreground/60 mt-1.5">
              The last 7 days.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
              <Link
                href="/"
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors active:opacity-70"
              >
                ← Back to Log
              </Link>
              <span className="text-xs text-muted-foreground/25">·</span>
              <Link
                href="/analytics/today"
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors active:opacity-70"
              >
                Today Reflection →
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/settings"
              className="text-xs font-medium text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors tracking-wide uppercase active:opacity-70"
            >
              Settings
            </Link>
            <SignOutButton />
          </div>
        </header>

        <div className="space-y-10 sm:space-y-12">
          
          {/* 1. Weekly Matrix */}
          {stats.weeklyMatrix.total > 0 && (
            <section className="space-y-5">
              <div>
                <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-3 pl-1 sm:pl-2 font-medium">
                  Weekly Pattern
                </h2>
                <MatrixGrid stats={stats.weeklyMatrix} />
              </div>
              
              {/* Interpretation */}
              <p className="text-sm sm:text-base text-foreground/85 italic pl-1 sm:pl-2 leading-relaxed">
                {generateMatrixInterpretation(stats.weeklyMatrix)}
              </p>
            </section>
          )}

          {/* 2. Days Overview */}
          <section className="space-y-2.5">
            {stats.days.map((day) => {
              const dateObj = new Date(day.date);
              const isToday = day.date === new Date().toISOString().split('T')[0];
              const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
              const dateNum = dateObj.getDate();

              return (
                <div 
                  key={day.date}
                  className={`
                    flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all
                    hover:bg-white/[0.03] active:bg-white/[0.04]
                    ${day.slotsLogged > 0 
                      ? "bg-white/[0.03] border-white/10" 
                      : "bg-transparent border-white/5 opacity-60"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex flex-col items-center w-9 sm:w-10">
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">{dayName}</span>
                      <span className={`text-sm sm:text-base font-medium ${isToday ? "text-teal-400/90" : "text-foreground/90"}`}>
                        {dateNum}
                      </span>
                    </div>
                    
                    <div className="h-8 w-px bg-white/8" />
                    
                    <div>
                       {day.slotsLogged > 0 ? (
                         <div className="text-sm sm:text-base text-foreground/85">
                           {day.slotsLogged} <span className="text-muted-foreground/50 text-xs">slots</span>
                         </div>
                       ) : (
                         <div className="text-xs text-muted-foreground/40 italic">No logs</div>
                       )}
                    </div>
                  </div>

                  {/* Dominant Energy Tag */}
                  {day.dominantEnergy && (
                    <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wide px-2.5 py-1 bg-white/5 rounded-md border border-white/10">
                      {day.dominantEnergy}
                    </span>
                  )}
                </div>
              );
            })}
          </section>

          {/* 3. Weekly Balance */}
          {stats.totalSlots > 0 && (
            <section className="pt-8 border-t border-white/10">
              <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-6 pl-1 sm:pl-2 font-medium">
                Balance
              </h2>
              {stats.weeklyDominant && (
                <p className="text-sm sm:text-base text-foreground/85 mb-6 pl-1 sm:pl-2 italic leading-relaxed">
                  &ldquo;This week leaned heavily <span className="text-teal-400/90 font-medium">{stats.weeklyDominant.toLowerCase()}</span>.&rdquo;
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(stats.weeklyEnergy) as [string, number][]).map(([type, score]) => (
                   <div key={type} className="p-3.5 sm:p-4 bg-white/[0.03] rounded-lg border border-white/10 flex justify-between items-center hover:bg-white/[0.05] transition-colors">
                      <span className="text-xs sm:text-sm text-muted-foreground/70 font-medium">{type}</span>
                      <div className="flex gap-1">
                        {/* Render simple dots for weight */}
                        {Array.from({ length: Math.min(Math.round(score / 5), 5) }).map((_, i) => (
                           <div key={i} className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
                        ))}
                      </div>
                   </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. Repeating Tasks */}
          {stats.repeatingTasks.length > 0 && (
            <section>
              <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-4 pl-1 sm:pl-2 font-medium">
                Repeating
              </h2>
              <div className="flex flex-wrap gap-2 pl-1 sm:pl-2">
                {stats.repeatingTasks.map(task => (
                  <span key={task} className="px-3 py-1.5 bg-white/[0.03] border border-white/10 rounded-full text-xs sm:text-sm text-muted-foreground/75 hover:bg-white/[0.05] transition-colors capitalize">
                    {task}
                  </span>
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </main>
  );
}