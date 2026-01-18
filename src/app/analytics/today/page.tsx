"use client";

import Link from "next/link";
import { useTodayAnalytics } from "@/hooks/useTodayAnalytics";
import { EnergyType } from "@/lib/energy";
import SignOutButton from "@/components/ui/SignOutButton";
import MatrixGrid from "@/components/analytics/MatrixGrid";
import { generateMatrixInterpretation } from "@/lib/matrix";

interface EnergyStats {
  Physical: number;
  Mental: number;
  Emotional: number;
  Spiritual: number;
}

interface TodayStats {
  totalSlots: number;
  important: number;
  urgent: number;
  energy: EnergyStats;
  dominantEnergy: EnergyType | null;
  topTasks: [string, number][];
  topPlaces: [string, number][];
  matrix: import("@/lib/matrix").MatrixStats;
}

export default function TodayAnalytics() {
  const dateKey = new Date().toISOString().split("T")[0];
  const { loading, stats } = useTodayAnalytics(dateKey);

  if (loading || !stats) {
    return <div className="min-h-screen bg-background" />;
  }

  const typedStats = stats as TodayStats;

  const maxEnergy = Math.max(
    typedStats.energy.Physical,
    typedStats.energy.Mental,
    typedStats.energy.Emotional,
    typedStats.energy.Spiritual
  );

  return (
    <main className="min-h-screen w-full flex justify-center bg-background px-3 sm:px-4 pb-32 sm:pb-24">
      <div className="w-full max-w-xl pt-8 sm:pt-12 space-y-12 sm:space-y-14">

        {/* HEADER */}
        <header className="pl-1 sm:pl-2 flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-xl font-medium tracking-tight text-foreground/95">
              Reflection
            </h1>
            <p className="text-sm text-muted-foreground/60 mt-1.5">
              Today, as it unfolded.
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
                href="/analytics/week"
                className="text-xs text-muted-foreground/50 hover:text-muted-foreground/70 transition-colors active:opacity-70"
              >
                View Weekly Pattern →
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

        {/* IMPORTANT-URGENT MATRIX */}
        <section className="space-y-5">
          <div>
            <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-3 pl-1 sm:pl-2 font-medium">
              Where Your Time Went
            </h2>
            <MatrixGrid stats={typedStats.matrix} />
          </div>
          
          {/* Interpretation */}
          <p className="text-sm sm:text-base text-foreground/85 italic pl-1 sm:pl-2 leading-relaxed">
            {generateMatrixInterpretation(typedStats.matrix)}
          </p>
        </section>

        {/* FLOW */}
        <section className="bg-white/[0.03] rounded-2xl p-5 sm:p-6 border border-white/10 shadow-sm">
          <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-5 font-medium">
            Flow
          </h2>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-3xl sm:text-4xl font-light text-foreground/95">
              {typedStats.totalSlots}
            </span>
            <span className="text-sm text-muted-foreground/60">
              slots logged
            </span>
          </div>

          <div className="text-xs text-muted-foreground/50">
            Important: {typedStats.important} · Urgent: {typedStats.urgent}
          </div>
        </section>

        {/* ENERGY REFLECTION */}
        <section className="pt-8 border-t border-white/10">
          <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-6 pl-1 sm:pl-2 font-medium">
            Energy Profile
          </h2>

          {typedStats.dominantEnergy && (
            <p className="text-sm sm:text-base text-foreground/85 italic mb-6 pl-1 sm:pl-2 leading-relaxed">
              Today leaned{" "}
              <span className="text-teal-400/90 font-medium">
                {typedStats.dominantEnergy.toLowerCase()}
              </span>.
            </p>
          )}

          <div className="space-y-4">
            {(Object.entries(typedStats.energy) as [EnergyType, number][]).map(
              ([type, score]) => (
                <div key={type} className="flex items-center gap-3 sm:gap-4 px-1 sm:px-2">
                  <span className="w-20 sm:w-24 text-xs sm:text-sm text-muted-foreground/70 font-medium">
                    {type}
                  </span>

                  <div className="flex-1 h-2 bg-white/[0.03] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-muted-foreground/35 to-muted-foreground/25 rounded-full transition-all duration-700 ease-out"
                      style={{
                        width:
                          maxEnergy > 0
                            ? `${(score / maxEnergy) * 100}%`
                            : "0%",
                        opacity: score > 0 ? 1 : 0,
                      }}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* FOCUS (TASKS) */}
        {typedStats.topTasks.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-5 pl-1 sm:pl-2 font-medium">
              Focus
            </h2>

            <ul className="space-y-2.5">
              {typedStats.topTasks.map(([task, count]) => (
                <li
                  key={task}
                  className="flex justify-between items-center px-1 sm:px-2 py-1.5 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm sm:text-base text-foreground/80 capitalize">{task}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground/50 font-medium tabular-nums">×{count}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* PLACES */}
        {typedStats.topPlaces.length > 0 && (
          <section>
            <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-4 pl-1 sm:pl-2 font-medium">
              Where
            </h2>

            <div className="flex flex-wrap gap-2 pl-1 sm:pl-2">
              {typedStats.topPlaces.map(([place, count]) => (
                <span
                  key={place}
                  className="px-3 py-1.5 rounded-full text-xs sm:text-sm bg-white/[0.03] border border-white/10 text-muted-foreground/75 hover:bg-white/[0.05] transition-colors"
                >
                  {place} ×{count}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
