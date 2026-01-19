"use client";

import { useState, useEffect } from "react";
import { DailyLog, LogEntry } from "@/types";

export function useDailyLog(dateKey: string) {
  const [log, setLog] = useState<DailyLog>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Reset loaded state when date changes so UI doesn't flash old data
    setIsLoaded(false); 

    try {
      const saved = localStorage.getItem(dateKey);
      if (saved) {
        setLog(JSON.parse(saved));
      } else {
        // [FIX] Vital: Clear the log if no data exists for this day
        setLog({});
      }
    } catch (e) {
      console.error("Failed to load local log", e);
      // Safety fall-back
      setLog({});
    } finally {
      setIsLoaded(true);
    }
  }, [dateKey]);

  const updateEntry = (timeSlot: string, updates: Partial<LogEntry>) => {
    setLog((prev) => {
      const existing = prev[timeSlot] || { 
        tasks: [], 
        important: false, 
        urgent: false
      };
      const newEntry = { ...existing, ...updates };
      const newLog = { ...prev, [timeSlot]: newEntry };
      localStorage.setItem(dateKey, JSON.stringify(newLog));
      return newLog;
    });
  };

  return { log, setLog, updateEntry, isLoaded };
}