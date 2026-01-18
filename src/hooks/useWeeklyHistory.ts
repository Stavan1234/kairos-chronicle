"use client";

import { useState, useEffect } from "react";
import { DailyLog } from "@/types";

export function useWeeklyHistory() {
  const [history, setHistory] = useState<{ date: string; log: DailyLog }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const days = [];
    // Generate last 7 days (Today -> Yesterday -> ...)
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const data = days.map(dateKey => {
      try {
        const saved = localStorage.getItem(dateKey);
        return {
          date: dateKey,
          log: saved ? JSON.parse(saved) : {} as DailyLog
        };
      } catch {
        return { date: dateKey, log: {} };
      }
    });

    const timer = setTimeout(() => {
      setHistory(data);
      setLoading(false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return { history, loading };
}