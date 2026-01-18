export interface Task {
  id: string;
  label: string;
}

export interface LogEntry {
  tasks: Task[];
  important: boolean;
  urgent: boolean;
  place?: string;
}

// The entire day's record: { "09:00": Entry, "09:30": Entry }
export type DailyLog = Record<string, LogEntry>;