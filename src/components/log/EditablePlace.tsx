"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface EditablePlaceProps {
  value?: string;
  onUpdate: (place: string) => void;
}

const DEFAULT_PLACE = "Home";

export default function EditablePlace({ value, onUpdate }: EditablePlaceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value || DEFAULT_PLACE);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync input value when prop changes
  useEffect(() => {
    setInputValue(value || DEFAULT_PLACE);
  }, [value]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const trimmed = inputValue.trim();
    // If empty, save empty string (will be normalized to null/undefined in storage)
    // This allows "Home" to be the display default while storing empty for unset places
    const finalValue = trimmed === "" ? "" : trimmed;
    
    // Always update to sync state
    onUpdate(finalValue);
    
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset to original value
    setInputValue(value || DEFAULT_PLACE);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    }
    // Prevent event bubbling to parent (TimeLogRow)
    e.stopPropagation();
  };

  const displayValue = value || DEFAULT_PLACE;

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="
          text-[10px] font-medium uppercase tracking-wider 
          text-muted-foreground/60
          bg-white/5 border border-white/10 rounded px-1.5 py-0.5
          focus:outline-none focus:border-white/20 focus:bg-white/8
          min-w-[60px] max-w-[120px]
          transition-all duration-200
        "
        placeholder={DEFAULT_PLACE}
      />
    );
  }

  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        handleStartEdit();
      }}
      className="
        text-[10px] font-medium uppercase tracking-wider 
        text-muted-foreground/30
        opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
        transition-opacity duration-300
        cursor-text select-none
        touch-manipulation
      "
      title="Tap to edit place"
    >
      {displayValue}
    </span>
  );
}

