"use client";

import Link from "next/link";
import SignOutButton from "@/components/ui/SignOutButton";

export default function SettingsPage() {
  return (
    <main className="min-h-screen w-full flex justify-center bg-background px-3 sm:px-4 pb-32 sm:pb-24">
      <div className="w-full max-w-xl pt-8 sm:pt-12">
        <header className="mb-10 sm:mb-12 pl-1 sm:pl-2 flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-xl font-medium tracking-tight text-foreground/95">Settings</h1>
            <p className="text-sm text-muted-foreground/60 mt-1.5">Preferences and account</p>
          </div>
          <SignOutButton />
        </header>

        <div className="space-y-8 pl-1 sm:pl-2">
          <section>
            <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-5 font-medium">
              Account
            </h2>
            <div className="space-y-3">
              <div className="text-sm sm:text-base text-foreground/80">
                Sign out to end your session
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs uppercase tracking-[0.15em] text-muted-foreground/50 mb-4 font-medium">
              Navigation
            </h2>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-sm sm:text-base text-muted-foreground/60 hover:text-foreground/80 transition-colors active:opacity-70 py-1"
              >
                ← Back to Log
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

