"use client";

import { useEffect, useRef } from "react";
import { useDailyLog } from "./useDailyLog";
import { LogEntry } from "@/types";
import {
  fetchDayFromSupabase,
  getOrCreateDailyLog,
  upsertTimeEntry
} from "@/lib/supabase/db";

export function useDailyLogSync(dateKey: string) {
  const { log, setLog, updateEntry: localUpdate, isLoaded } =
    useDailyLog(dateKey);

  const dailyLogIdRef = useRef<string | null>(null);
  const pendingWrites = useRef<Record<string, NodeJS.Timeout>>({});
  const logRef = useRef(log);

  useEffect(() => {
    logRef.current = log;
  }, [log]);

  /* ---------- Inbound Sync ---------- */
  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      const cloud = await fetchDayFromSupabase(dateKey);
      if (!mounted || !cloud) return;

      dailyLogIdRef.current = cloud.id;

      setLog((prev) => {
        const merged = { ...prev };
        cloud.time_entries?.forEach((e: LogEntry & { time_slot: string }) => {
          merged[e.time_slot] = {
            tasks: e.tasks,
            important: e.important,
            urgent: e.urgent,
            place: e.place
          };
        });
        localStorage.setItem(dateKey, JSON.stringify(merged));
        return merged;
      });
    }

    hydrate();
    return () => {
      mounted = false;
    };
  }, [dateKey, setLog]);

  /* ---------- Outbound Sync (FIXED) ---------- */
  const updateEntry = (timeSlot: string, updates: Partial<LogEntry>) => {
    // 1. Instant UI update
    localUpdate(timeSlot, updates);

    // 2. Cancel previous sync
    if (pendingWrites.current[timeSlot]) {
      clearTimeout(pendingWrites.current[timeSlot]);
    }

    // 3. Schedule safe sync
    pendingWrites.current[timeSlot] = setTimeout(async () => {
      try {
        if (!dailyLogIdRef.current) {
          dailyLogIdRef.current = await getOrCreateDailyLog(dateKey);
        }
        if (!dailyLogIdRef.current) return;

        // 🔐 CRITICAL FIX: read FULL snapshot
        const fullEntry = logRef.current[timeSlot];
        if (!fullEntry) return;

        await upsertTimeEntry(
          dailyLogIdRef.current!,
          timeSlot,
          fullEntry
        );
      } catch (e) {
        console.error("Silent sync failure", e);
      } finally {
        delete pendingWrites.current[timeSlot];
      }
    }, 800);
  };

  return { log, updateEntry, isLoaded };
}
