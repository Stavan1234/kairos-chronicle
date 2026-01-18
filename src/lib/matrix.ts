import { LogEntry } from "@/types";

export interface MatrixQuadrants {
  q1: number; // Important + Urgent (Crisis/Firefighting)
  q2: number; // Important + Not Urgent (Growth/Compounding)
  q3: number; // Not Important + Urgent (Distraction/Noise)
  q4: number; // Not Important + Not Urgent (Time Waste)
}

export interface MatrixStats extends MatrixQuadrants {
  total: number;
  percentages: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
}

/**
 * Calculate Important-Urgent matrix quadrants for a single entry
 */
function getQuadrant(entry: LogEntry): keyof MatrixQuadrants {
  if (entry.important && entry.urgent) return "q1";
  if (entry.important && !entry.urgent) return "q2";
  if (!entry.important && entry.urgent) return "q3";
  return "q4";
}

/**
 * Calculate matrix statistics from an array of log entries
 * Only counts entries that have at least one task (logged slots)
 */
export function calculateMatrix(entries: LogEntry[]): MatrixStats {
  const quadrants: MatrixQuadrants = {
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
  };

  // Only count entries with tasks (logged slots)
  const loggedEntries = entries.filter((e) => e.tasks.length > 0);

  loggedEntries.forEach((entry) => {
    const quadrant = getQuadrant(entry);
    quadrants[quadrant]++;
  });

  const total = loggedEntries.length;

  // Calculate percentages, ensuring they sum to 100%
  const percentages = {
    q1: total > 0 ? Math.round((quadrants.q1 / total) * 100) : 0,
    q2: total > 0 ? Math.round((quadrants.q2 / total) * 100) : 0,
    q3: total > 0 ? Math.round((quadrants.q3 / total) * 100) : 0,
    q4: total > 0 ? Math.round((quadrants.q4 / total) * 100) : 0,
  };

  // Normalize percentages to sum to 100% (handle rounding errors)
  const sum = percentages.q1 + percentages.q2 + percentages.q3 + percentages.q4;
  if (sum !== 100 && total > 0) {
    const diff = 100 - sum;
    // Add the difference to the largest quadrant
    const largest = Object.entries(percentages).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0] as keyof typeof percentages;
    percentages[largest] += diff;
  }

  return {
    ...quadrants,
    total,
    percentages,
  };
}

/**
 * Generate calm, reflective interpretation text based on matrix distribution
 */
export function generateMatrixInterpretation(stats: MatrixStats): string {
  if (stats.total === 0) {
    return "No logged time yet today.";
  }

  const { q1, q2, q3, q4 } = stats.percentages;

  // Q2 (Important + Not Urgent) is the ideal quadrant - Growth/Compounding
  if (q2 >= 40) {
    return "Most of your time went into important but not urgent work — this compounds.";
  }

  // Q1 (Important + Urgent) - Crisis mode
  if (q1 >= 40) {
    return "Urgency dominated today. This often feels productive, but rarely is.";
  }

  // Q3 (Not Important + Urgent) - Distraction
  if (q3 >= 40) {
    return "Much of today was urgent but not important — noise disguised as action.";
  }

  // Q4 (Not Important + Not Urgent) - Time waste
  if (q4 >= 40) {
    return "A significant portion of today went to neither important nor urgent work.";
  }

  // Balanced or mixed distribution
  const maxQuadrant = Math.max(q1, q2, q3, q4);
  if (maxQuadrant === q2) {
    return "Today leaned toward important, non-urgent work — a good sign.";
  }
  if (maxQuadrant === q1) {
    return "Today was heavy on urgent and important work — firefighting mode.";
  }
  if (maxQuadrant === q3) {
    return "Today was marked by urgent distractions.";
  }

  return "A balanced mix across all quadrants today.";
}

