import { X } from "lucide-react";

interface TaskChipProps {
  label: string;
  onRemove: () => void;
}

export default function TaskChip({ label, onRemove }: TaskChipProps) {
  return (
    <span className="
      group inline-flex items-center px-3 py-1 
      text-sm font-medium
      bg-muted text-foreground/90
      rounded-full border border-transparent
      hover:border-white/10 hover:bg-muted/80
      transition-all duration-200 cursor-default
    ">
      {label}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="
          ml-2 -mr-1 p-0.5 rounded-full 
          text-muted-foreground/40 
          hover:text-red-400 hover:bg-white/5
          opacity-0 group-hover:opacity-100
          transition-all duration-200
        "
      >
        <X size={12} strokeWidth={3} />
      </button>
    </span>
  );
}