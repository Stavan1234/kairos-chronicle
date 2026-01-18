import { createClient } from "@/lib/supabase/client";
import { EnergyType, calculateDailyEnergy } from "@/lib/energy";
import { LogEntry } from "@/types";

export async function fetchDailyAnalytics(date: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("daily_logs")
    .select(`
      id,
      time_entries (
        time_slot,
        tasks,
        important,
        urgent,
        place
      )
    `)
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  if (error || !data) return null;

  return data.time_entries as LogEntry[];
}
