"use client";

import { useState, useRef, KeyboardEvent } from "react";
import TaskChip from "./TaskChip";
import QuietToggle from "../ui/QuietToggle";
import EditablePlace from "./EditablePlace";
import { LogEntry, Task } from "@/types";

interface TimeLogRowProps {
  timeLabel: string;
  entry?: LogEntry; // Data from parent
  onUpdate: (updates: Partial<LogEntry>) => void; // Signal to parent
}

export default function TimeLogRow({ timeLabel, entry, onUpdate }: TimeLogRowProps) {
  // Local state ONLY for the input field (transient)
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Derived state from props (with defaults)
  const tasks = entry?.tasks || [];
  const isImportant = entry?.important || false;
  const isUrgent = entry?.urgent || false;
  const place = entry?.place; 

  // [FIX] Helper to centralize the "No Task = No Flags" logic
  const updateTasks = (newTasks: Task[]) => {
    const updates: Partial<LogEntry> = { tasks: newTasks };
    
    // If the list becomes empty, force flags off
    if (newTasks.length === 0) {
      updates.important = false;
      updates.urgent = false;
    }
    
    onUpdate(updates);
  };

  const handleAddTask = () => {
    if (inputValue.trim()) {
      const newTask: Task = { id: crypto.randomUUID(), label: inputValue.trim() };
      // Adding a task doesn't risk emptying the list, so standard update is fine
      onUpdate({ tasks: [...tasks, newTask] }); 
      setInputValue("");
    }
  };

  const handleRemoveTask = (taskId: string) => {
    // [FIX] Use the safe updater
    updateTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleAddTask();
    if (e.key === "Backspace" && inputValue === "" && tasks.length > 0) {
      // Remove last task
      const newTasks = [...tasks];
      newTasks.pop();
      // [FIX] Use the safe updater
      updateTasks(newTasks);
    }
  };

  return (
    <div 
      className="
        group flex flex-row items-baseline gap-3 md:gap-6 
        py-3 md:py-4 border-b border-border
        hover:bg-white/[0.01] transition-colors
      "
      onClick={() => inputRef.current?.focus()}
    >
      {/* Time Column */}
      <div className="w-12 md:w-16 shrink-0 text-sm font-mono text-muted-foreground/60 pt-1.5 select-none">
        {timeLabel}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-wrap gap-2 items-center min-h-[2rem]">
        {tasks.map((task) => (
          <TaskChip 
            key={task.id} 
            label={task.label} 
            onRemove={() => handleRemoveTask(task.id)}
          />
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleAddTask}
          placeholder={tasks.length === 0 ? "Log..." : ""}
          className="
            flex-1 min-w-[80px] bg-transparent 
            text-base text-foreground/90
            placeholder:text-muted-foreground/20 
            focus:outline-none py-1
          "
        />
        
        {/* Metadata Controls */}
        <div className="flex items-center gap-3 ml-auto pl-2">
            <EditablePlace 
              value={place} 
              onUpdate={(newPlace) => onUpdate({ place: newPlace })} 
            /> 
            
            <div className="h-3 w-px bg-white/[0.05] hidden group-hover:block group-focus-within:block transition-all" />

            <QuietToggle 
              label="Important" 
              isActive={isImportant} 
              onToggle={() => onUpdate({ important: !isImportant })} 
            />
            <QuietToggle 
              label="Urgent" 
              isActive={isUrgent} 
              onToggle={() => onUpdate({ urgent: !isUrgent })} 
            />
        </div>
      </div>
    </div>
  );
}