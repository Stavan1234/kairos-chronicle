"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createClient();

    if (isSignUp) {
      // --- SIGN UP ---
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage(error.message);
      } else {
        setMessage("Account created! Check your email to confirm.");
      }
    } else {
      // --- SIGN IN ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-medium text-foreground/95 tracking-tight">
            {isSignUp ? "Create account" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground/60">
            {isSignUp ? "Start your quiet log" : "Enter your details to access your log"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 
                text-base text-foreground/90 placeholder:text-muted-foreground/40 
                focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all
              "
            />
          </div>
          <div>
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              className="
                w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 
                text-base text-foreground/90 placeholder:text-muted-foreground/40 
                focus:border-white/20 focus:bg-white/[0.08] focus:outline-none transition-all
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full rounded-lg bg-foreground/90 px-4 py-3 
              text-sm font-medium text-background hover:bg-foreground 
              disabled:opacity-50 disabled:cursor-not-allowed 
              transition-all shadow-lg shadow-black/20
            "
          >
            {loading 
              ? "Processing..." 
              : (isSignUp ? "Sign Up" : "Sign In")
            }
          </button>
        </form>

        {/* Message / Error */}
        {message && (
          <div className="p-3 rounded-md bg-white/5 border border-white/10 text-center">
            <p className="text-sm text-muted-foreground/80">{message}</p>
          </div>
        )}

        {/* Toggle Mode */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setMessage("");
            }}
            className="text-xs text-muted-foreground/40 hover:text-foreground/80 transition-colors"
          >
            {isSignUp 
              ? "Already have an account? Sign in" 
              : "No account? Create one"
            }
          </button>
        </div>
        
      </div>
    </div>
  );
}