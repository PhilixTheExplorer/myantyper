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
  Trash2,
  UserRound,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HeaderPopover } from "@/components/layout/HeaderPopover";
import { useHistory } from "@/components/providers/HistoryProvider";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

export function AccountControl({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const { syncStatus, retrySync } = useHistory();
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

  const signOut = async (close: () => void) => {
    setActionPending(true);
    setMessage("");
    try {
      const result = await authClient.signOut();
      if (result.error) setMessage(result.error.message ?? "Sign-out failed.");
      else close();
    } catch {
      setMessage("Sign-out is currently unavailable.");
    } finally {
      setActionPending(false);
    }
  };

  const label = session?.user.name || session?.user.email || "Account";

  if (!session) {
    return (
      <div className="relative">
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
        <span className="sr-only" aria-live="polite">
          {message}
        </span>
      </div>
    );
  }

  return (
    <HeaderPopover
      trigger={({ open, toggle, panelId }) => (
        <button
          type="button"
          disabled={pending}
          onClick={toggle}
          className={cn(
            "mt-action mt-action-outline inline-flex min-h-10 items-center justify-center gap-2 border border-border-soft text-xs tracking-widest text-ink-soft uppercase disabled:cursor-wait disabled:opacity-50 sm:min-h-8",
            compact ? "h-10 w-10 p-0" : "max-w-44 px-3 py-1.5",
          )}
          aria-label={`Account for ${label}`}
          aria-expanded={open}
          aria-controls={panelId}
          title={`Signed in as ${label}`}
        >
          <UserRound size={16} />
          {!compact && <span className="truncate">{label}</span>}
          {!compact && (
            <ChevronDown
              size={13}
              className={cn("transition-transform", open && "rotate-180")}
            />
          )}
        </button>
      )}
    >
      {({ close }) => (
        <>
          <div className="border-b border-dashed border-border-soft pb-3">
            <div className="truncate text-sm font-semibold text-ink">
              {session.user.name || "MyanTyper account"}
            </div>
            {session.user.email && (
              <div className="mt-1 truncate text-xs text-ink-soft">
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
            onClick={() => signOut(close)}
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

          <DeleteAccountSection close={close} />
        </>
      )}
    </HeaderPopover>
  );
}

function DeleteAccountSection({ close }: { close: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const deleteAccount = async () => {
    setPending(true);
    setError("");
    try {
      const result = await authClient.deleteUser();
      if (result.error) {
        const needsFreshSignIn =
          result.error.code === "SESSION_EXPIRED" ||
          result.error.status === 401;
        setError(
          needsFreshSignIn
            ? "For security, sign out and sign in again before deleting."
            : "Account deletion failed. Please try again.",
        );
        return;
      }
      close();
      window.location.assign("/");
    } catch {
      setError("Account deletion is currently unavailable.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="mt-2 border-t border-dashed border-border-soft pt-2">
      {confirming ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs leading-relaxed text-ink-soft">
            This permanently deletes your account and all synced history from
            our servers, and can&apos;t be undone. History saved locally on this
            device is not removed.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={deleteAccount}
              className="mt-action flex min-h-9 flex-1 items-center justify-center gap-2 border border-error px-3 text-xs tracking-widest text-error uppercase disabled:cursor-wait disabled:opacity-50"
            >
              <Trash2 size={14} />
              {pending ? "Deleting" : "Delete"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => setConfirming(false)}
              className="mt-action mt-action-outline flex min-h-9 flex-1 items-center justify-center border border-border-soft px-3 text-xs tracking-widest text-ink-soft uppercase disabled:cursor-wait disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="mt-action flex min-h-9 w-full items-center justify-center gap-2 px-3 text-xs tracking-widest text-error uppercase hover:opacity-80"
        >
          <Trash2 size={14} />
          Delete account
        </button>
      )}
      {error && (
        <p className="mt-2 text-xs leading-relaxed text-error" role="status">
          {error}
        </p>
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
        <p className="mt-1 text-xs leading-relaxed text-ink-soft">
          {content.detail}
        </p>
      </div>
    </div>
  );
}
