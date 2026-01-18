export function generateTimeSlots(startHour: number = 5, endHour: number = 23): string[] {
  const slots: string[] = [];
  
  for (let hour = startHour; hour <= endHour; hour++) {
    // Format hour (e.g., "05", "14")
    const hourStr = hour.toString().padStart(2, '0');
    
    // Add :00 slot
    slots.push(`${hourStr}:00`);
    
    // Add :30 slot (skip if it's the very last slot of the day to avoid overflow if desired, 
    // but usually 23:30 is a valid slot)
    if (hour !== endHour || endHour === 23) {
      slots.push(`${hourStr}:30`);
    }
  }
  
  return slots;
}

export function getTodayDateString(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long", 
    day: "numeric", 
    month: "short"
  });
}