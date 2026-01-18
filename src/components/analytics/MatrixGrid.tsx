"use client";

import { MatrixStats } from "@/lib/matrix";

interface MatrixGridProps {
  stats: MatrixStats;
  showInterpretation?: boolean;
}

export default function MatrixGrid({ stats, showInterpretation = true }: MatrixGridProps) {
  const { q1, q2, q3, q4, percentages } = stats;

  // Determine dominant quadrant for subtle highlight
  const dominantQuadrant = Math.max(percentages.q1, percentages.q2, percentages.q3, percentages.q4);
  const getQuadrantHighlight = (pct: number) => {
    if (pct === dominantQuadrant && pct > 0) {
      return "bg-white/[0.04] border-white/10";
    }
    return "bg-white/[0.02] border-white/5";
  };

  return (
    <div className="space-y-5">
      {/* Enhanced 2x2 Grid */}
      <div className="grid grid-cols-2 gap-0.5 bg-white/5 rounded-xl overflow-hidden border border-white/8 p-0.5">
        {/* Q1: Important + Urgent */}
        <div className={`${getQuadrantHighlight(percentages.q1)} p-5 sm:p-6 rounded-lg transition-all duration-300 hover:bg-white/[0.06]`}>
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-3 font-medium">
            Q1
          </div>
          <div className="text-3xl sm:text-4xl font-light text-foreground mb-1.5 leading-none">{q1}</div>
          <div className="text-sm text-muted-foreground/60 mb-3">
            {percentages.q1}%
          </div>
          <div className="text-[11px] text-muted-foreground/50 leading-relaxed">
            Important + Urgent
          </div>
        </div>

        {/* Q2: Important + Not Urgent */}
        <div className={`${getQuadrantHighlight(percentages.q2)} p-5 sm:p-6 rounded-lg transition-all duration-300 hover:bg-white/[0.06]`}>
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-3 font-medium">
            Q2
          </div>
          <div className="text-3xl sm:text-4xl font-light text-foreground mb-1.5 leading-none">{q2}</div>
          <div className="text-sm text-muted-foreground/60 mb-3">
            {percentages.q2}%
          </div>
          <div className="text-[11px] text-muted-foreground/50 leading-relaxed">
            Important + Not Urgent
          </div>
        </div>

        {/* Q3: Not Important + Urgent */}
        <div className={`${getQuadrantHighlight(percentages.q3)} p-5 sm:p-6 rounded-lg transition-all duration-300 hover:bg-white/[0.06]`}>
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-3 font-medium">
            Q3
          </div>
          <div className="text-3xl sm:text-4xl font-light text-foreground mb-1.5 leading-none">{q3}</div>
          <div className="text-sm text-muted-foreground/60 mb-3">
            {percentages.q3}%
          </div>
          <div className="text-[11px] text-muted-foreground/50 leading-relaxed">
            Not Important + Urgent
          </div>
        </div>

        {/* Q4: Not Important + Not Urgent */}
        <div className={`${getQuadrantHighlight(percentages.q4)} p-5 sm:p-6 rounded-lg transition-all duration-300 hover:bg-white/[0.06]`}>
          <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/50 mb-3 font-medium">
            Q4
          </div>
          <div className="text-3xl sm:text-4xl font-light text-foreground mb-1.5 leading-none">{q4}</div>
          <div className="text-sm text-muted-foreground/60 mb-3">
            {percentages.q4}%
          </div>
          <div className="text-[11px] text-muted-foreground/50 leading-relaxed">
            Not Important + Not Urgent
          </div>
        </div>
      </div>

      {/* Enhanced progress bars */}
      {stats.total > 0 && (
        <div className="space-y-2 pl-1">
          {[
            { key: "q1", label: "Q1", value: q1, pct: percentages.q1 },
            { key: "q2", label: "Q2", value: q2, pct: percentages.q2 },
            { key: "q3", label: "Q3", value: q3, pct: percentages.q3 },
            { key: "q4", label: "Q4", value: q4, pct: percentages.q4 },
          ].map(({ key, label, value, pct }) => (
            <div key={key} className="flex items-center gap-3 group">
              <span className="text-[11px] text-muted-foreground/50 w-7 font-medium">
                {label}
              </span>
              <div className="flex-1 h-1 bg-white/[0.03] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-muted-foreground/25 to-muted-foreground/20 rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${pct}%`,
                    opacity: value > 0 ? 1 : 0,
                  }}
                />
              </div>
              <span className="text-[11px] text-muted-foreground/40 w-10 text-right font-medium tabular-nums">
                {pct}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

