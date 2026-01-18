import { createClient } from "./client";
import { LogEntry } from "@/types";

export async function getOrCreateDailyLog(date: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Try to find existing
  const { data } = await supabase
    .from("daily_logs")
    .select("id")
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  if (data) return data.id;

  // Create if missing
  const { data: newData, error: createError } = await supabase
    .from("daily_logs")
    .insert({ user_id: user.id, date })
    .select("id")
    .single();

  if (createError) {
    if (createError.code === "23505") { // Unique violation
      const { data: retryData } = await supabase
        .from("daily_logs")
        .select("id")
        .eq("user_id", user.id)
        .eq("date", date)
        .single();
      return retryData?.id;
    }
    return null;
  }

  return newData?.id;
}

export async function fetchDayFromSupabase(date: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: log } = await supabase
    .from("daily_logs")
    .select("id, time_entries(time_slot, tasks, important, urgent, place)")
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  return log;
}

export async function upsertTimeEntry(
  dailyLogId: string,
  timeSlot: string,
  entry: Partial<LogEntry>
) {
  const supabase = createClient();
  
  const payload = {
    daily_log_id: dailyLogId,
    time_slot: timeSlot,
    tasks: entry.tasks || [],
    important: entry.important || false,
    urgent: entry.urgent || false,
    place: entry.place && entry.place.trim() !== "" ? entry.place.trim() : null,
    updated_at: new Date().toISOString()
  };

  return supabase
    .from("time_entries")
    .upsert(payload, { onConflict: "daily_log_id, time_slot" });
}