"use client";

import { LogIn, LogOut, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export function AccountControl({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [actionPending, setActionPending] = useState(false);
  const [message, setMessage] = useState("");
  const pending = isPending || actionPending;

  const signIn = async () => {
    setActionPending(true);
    setMessage("");
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: pathname,
      });
      if (result.error) setMessage(result.error.message ?? "Sign-in failed.");
    } catch {
      setMessage("Sign-in is currently unavailable.");
    } finally {
      setActionPending(false);
    }
  };

  const signOut = async () => {
    setActionPending(true);
    setMessage("");
    try {
      const result = await authClient.signOut();
      if (result.error) setMessage(result.error.message ?? "Sign-out failed.");
    } catch {
      setMessage("Sign-out is currently unavailable.");
    } finally {
      setActionPending(false);
    }
  };

  const label = session?.user.name || session?.user.email || "Account";

  return (
    <div className="relative">
      {session ? (
        <button
          type="button"
          disabled={pending}
          onClick={signOut}
          className={cn(
            "mt-action mt-action-outline inline-flex min-h-10 items-center justify-center gap-2 border border-border-soft text-xs tracking-widest text-ink-soft uppercase disabled:cursor-wait disabled:opacity-50 sm:min-h-8",
            compact ? "h-10 w-10 p-0" : "max-w-44 px-3 py-1.5",
          )}
          aria-label={`Sign out ${label}`}
          title={`Signed in as ${label}. Sign out`}
        >
          {compact ? <UserRound size={16} /> : <LogOut size={15} />}
          {!compact && <span className="truncate">{label}</span>}
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={signIn}
          className={cn(
            "mt-action mt-action-outline inline-flex min-h-10 items-center justify-center gap-2 border border-border-soft text-xs tracking-widest text-ink-soft uppercase disabled:cursor-wait disabled:opacity-50 sm:min-h-8",
            compact ? "h-10 w-10 p-0" : "px-3 py-1.5",
          )}
          aria-label="Sign in with Google"
          title="Sign in with Google"
        >
          <LogIn size={15} />
          {!compact && <span>{pending ? "Checking" : "Sign in"}</span>}
        </button>
      )}
      <span className="sr-only" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
