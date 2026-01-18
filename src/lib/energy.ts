import { Task } from "@/types";

export const ENERGY_KEYWORDS = {
  Mental: ["study", "dsa", "coding", "code", "learn", "read", "algorithm", "debug", "exam", "lecture", "class"],
  Physical: ["walk", "gym", "workout", "run", "travel", "commute", "clean", "cook", "exercise", "sport"],
  Spiritual: ["pray", "bible", "worship", "church", "meditate", "silence", "god", "quiet"],
  Emotional: ["talk", "family", "friend", "cry", "laugh", "feel", "worry", "overthinking", "call", "meet"]
};

export type EnergyType = keyof typeof ENERGY_KEYWORDS;

export function calculateDailyEnergy(tasks: Task[], important: boolean, urgent: boolean) {
  const scores: Record<EnergyType, number> = {
    Physical: 0,
    Mental: 0,
    Emotional: 0,
    Spiritual: 0
  };

  tasks.forEach(task => {
    const label = task.label.toLowerCase();
    
    (Object.keys(ENERGY_KEYWORDS) as EnergyType[]).forEach(type => {
      if (ENERGY_KEYWORDS[type].some(k => label.includes(k))) {
        scores[type] += 1; // Base weight
        if (important) scores[type] += 0.5;
        if (urgent) scores[type] += 0.5;
      }
    });
  });

  return scores;
}

export function getDominantEnergy(scores: Record<EnergyType, number>): EnergyType | null {
  const max = Math.max(...Object.values(scores));
  if (max === 0) return null;
  return (Object.keys(scores) as EnergyType[]).find(k => scores[k] === max) || null;
}