"use client";

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function useSignOut() {
  const router = useRouter();
  const supabase = createClient();

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return signOut;
}