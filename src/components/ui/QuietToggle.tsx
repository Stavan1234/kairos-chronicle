"use client";

interface QuietToggleProps {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}

export default function QuietToggle({ label, isActive, onToggle }: QuietToggleProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent focusing the input when clicking this
        onToggle();
      }}
      className={`
        text-xs font-medium tracking-wide transition-all duration-300
        ${isActive 
          ? "opacity-100 text-foreground translate-y-0" 
          : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-muted-foreground/40 translate-y-1 hover:text-muted-foreground hover:translate-y-0"
        }
      `}
      aria-pressed={isActive}
    >
      {label}
    </button>
  );
}