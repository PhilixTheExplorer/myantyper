"use client";

import {
  Check,
  ChevronDown,
  Cloud,
  CloudOff,
  LoaderCircle,
  LogIn,
  LogOut,
  RefreshCw,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useHistory } from "@/components/providers/HistoryProvider";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export function AccountControl({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const menuId = useId();
  const root = useRef<HTMLDivElement>(null);
  const { data: session, isPending } = authClient.useSession();
  const { syncStatus, retrySync } = useHistory();
  const [actionPending, setActionPending] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [message, setMessage] = useState("");
  const pending = isPending || actionPending;

  // pathname intentionally closes an open account menu after navigation.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

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
      else setMenuOpen(false);
    } catch {
      setMessage("Sign-out is currently unavailable.");
    } finally {
      setActionPending(false);
    }
  };

  const label = session?.user.name || session?.user.email || "Account";

  return (
    <div ref={root} className="relative">
      {session ? (
        <>
          <button
            type="button"
            disabled={pending}
            onClick={() => setMenuOpen((open) => !open)}
            className={cn(
              "mt-action mt-action-outline inline-flex min-h-10 items-center justify-center gap-2 border border-border-soft text-xs tracking-widest text-ink-soft uppercase disabled:cursor-wait disabled:opacity-50 sm:min-h-8",
              compact ? "h-10 w-10 p-0" : "max-w-44 px-3 py-1.5",
            )}
            aria-label={`Account for ${label}`}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            title={`Signed in as ${label}`}
          >
            <UserRound size={16} />
            {!compact && <span className="truncate">{label}</span>}
            {!compact && (
              <ChevronDown
                size={13}
                className={cn("transition-transform", menuOpen && "rotate-180")}
              />
            )}
          </button>
          {menuOpen && (
            <div
              id={menuId}
              className="absolute right-0 top-full z-50 mt-2 w-[min(18rem,calc(100vw-2rem))] border border-border bg-bg p-3 text-left shadow-[0_12px_32px_rgba(0,0,0,0.32)]"
            >
              <div className="border-b border-dashed border-border-soft pb-3">
                <div className="truncate text-sm font-semibold text-ink">
                  {session.user.name || "MyanTyper account"}
                </div>
                {session.user.email && (
                  <div className="mt-1 truncate text-xs text-ink-dim">
                    {session.user.email}
                  </div>
                )}
              </div>

              <SyncStatus status={syncStatus} />

              {(syncStatus === "offline" || syncStatus === "error") && (
                <button
                  type="button"
                  onClick={retrySync}
                  className="mt-action mt-action-outline mt-3 flex min-h-9 w-full items-center justify-center gap-2 border border-border-soft px-3 text-xs tracking-widest text-ink-soft uppercase"
                >
                  <RefreshCw size={14} />
                  Retry sync
                </button>
              )}

              <button
                type="button"
                disabled={pending}
                onClick={signOut}
                className="mt-action mt-action-outline mt-2 flex min-h-9 w-full items-center justify-center gap-2 border border-border-soft px-3 text-xs tracking-widest text-ink-soft uppercase disabled:cursor-wait disabled:opacity-50"
              >
                <LogOut size={14} />
                {actionPending ? "Signing out" : "Sign out"}
              </button>

              {message && (
                <p
                  className="mt-2 text-xs leading-relaxed text-error"
                  role="status"
                >
                  {message}
                </p>
              )}
            </div>
          )}
        </>
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
      {!session && (
        <span className="sr-only" aria-live="polite">
          {message}
        </span>
      )}
    </div>
  );
}

function SyncStatus({
  status,
}: {
  status: "local" | "syncing" | "synced" | "offline" | "error";
}) {
  const content = {
    local: {
      label: "Saved locally",
      detail: "History is stored on this device.",
      icon: <Cloud size={16} />,
    },
    syncing: {
      label: "Syncing",
      detail: "Updating your cross-device history.",
      icon: <LoaderCircle size={16} className="animate-spin" />,
    },
    synced: {
      label: "Synced",
      detail: "History is available on your signed-in devices.",
      icon: <Check size={16} />,
    },
    offline: {
      label: "Offline",
      detail: "Changes are safe here and will sync after reconnecting.",
      icon: <CloudOff size={16} />,
    },
    error: {
      label: "Saved locally",
      detail: "Sync is unavailable, but your history is safe here.",
      icon: <CloudOff size={16} />,
    },
  }[status];

  return (
    <div className="flex gap-3 border-b border-dashed border-border-soft py-3">
      <span
        className={cn(
          "mt-0.5 text-ink-soft",
          status === "synced" && "text-success",
          status === "error" && "text-error",
        )}
        aria-hidden
      >
        {content.icon}
      </span>
      <div>
        <div className="text-xs font-semibold tracking-widest text-ink uppercase">
          {content.label}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-ink-dim">
          {content.detail}
        </p>
      </div>
    </div>
  );
}
