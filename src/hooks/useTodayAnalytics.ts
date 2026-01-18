"use client";

import { useEffect, useState } from "react";
import { Task, LogEntry } from "@/types";
import { calculateDailyEnergy, getDominantEnergy, EnergyType } from "@/lib/energy";
import { fetchDayFromSupabase } from "@/lib/supabase/db";
import { calculateMatrix, MatrixStats } from "@/lib/matrix";

interface EnergyStats {
  Physical: number;
  Mental: number;
  Emotional: number;
  Spiritual: number;
}

export interface TodayAnalyticsStats {
  totalSlots: number;
  important: number;
  urgent: number;
  energy: EnergyStats;
  dominantEnergy: EnergyType | null;
  topTasks: [string, number][];
  topPlaces: [string, number][];
  matrix: MatrixStats;
}

export function useTodayAnalytics(dateKey: string) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TodayAnalyticsStats | null>(null);

  useEffect(() => {
    let active = true;

    async function run() {
      setLoading(true);

      const cloud = await fetchDayFromSupabase(dateKey);
      if (!cloud || !active) {
        setStats(null);
        setLoading(false);
        return;
      }

      const entries = cloud.time_entries ?? [];

      let important = 0;
      let urgent = 0;

      const energy: EnergyStats = {
        Physical: 0,
        Mental: 0,
        Emotional: 0,
        Spiritual: 0,
      };

      const taskFreq: Record<string, number> = {};
      const placeFreq: Record<string, number> = {};

      entries.forEach((entry) => {
        if (entry.important) important++;
        if (entry.urgent) urgent++;

        if (entry.place) {
          placeFreq[entry.place] = (placeFreq[entry.place] || 0) + 1;
        }

        const entryEnergy = calculateDailyEnergy(
          entry.tasks,
          entry.important,
          entry.urgent
        );

        (Object.keys(entryEnergy) as EnergyType[]).forEach((k) => {
          energy[k] += entryEnergy[k];
        });

        entry.tasks.forEach((t: Task) => {
          const label = t.label.toLowerCase().trim();
          taskFreq[label] = (taskFreq[label] || 0) + 1;
        });
      });

      const dominantEnergy = getDominantEnergy(energy);

      const topTasks = Object.entries(taskFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

      const topPlaces = Object.entries(placeFreq)
        .sort((a, b) => b[1] - a[1]);

      // Calculate Important-Urgent Matrix
      const matrix = calculateMatrix(entries as LogEntry[]);

      if (active) {
        setStats({
          totalSlots: entries.length,
          important,
          urgent,
          energy,
          dominantEnergy,
          topTasks,
          topPlaces,
          matrix,
        });
        setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [dateKey]);

  return { loading, stats };
}
