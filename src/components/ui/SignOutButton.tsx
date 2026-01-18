"use client";

import { useSignOut } from "@/hooks/useSignOut";

export default function SignOutButton() {
  const signOut = useSignOut();

  return (
    <button 
      onClick={signOut}
      className="text-xs font-medium text-muted-foreground/30 hover:text-red-400/70 transition-colors tracking-wide uppercase"
    >
      Sign Out
    </button>
  );
}