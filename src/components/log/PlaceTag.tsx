export default function PlaceTag({ label = "—" }: { label?: string }) {
  return (
    <span className="
      text-[10px] font-medium uppercase tracking-wider 
      text-muted-foreground/30
      opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
      transition-opacity duration-300
      select-none cursor-default
    ">
      {label}
    </span>
  );
}