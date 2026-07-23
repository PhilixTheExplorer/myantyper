"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { authClient } from "@/lib/auth/client";
import { createAccountProgressStore, getProgressStore } from "@/lib/progress";
import { progressErrorMessage } from "@/lib/progress/store";
import {
  type HistoryDraft,
  type HistoryEntry,
  stampEntry,
} from "@/lib/progress/types";
import { createHistorySyncController } from "@/lib/sync/historyClient";

interface HistoryContextValue {
  history: HistoryEntry[];
  historyError: string | null;
  isHistoryLoading: boolean;
  syncStatus: HistorySyncStatus;
  appendHistory: (draft: HistoryDraft) => Promise<boolean>;
  retryHistory: () => void;
  retrySync: () => void;
}

export type HistorySyncStatus =
  | "local"
  | "syncing"
  | "synced"
  | "offline"
  | "error";

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function useHistory(): HistoryContextValue {
  const context = useContext(HistoryContext);
  if (!context)
    throw new Error("useHistory must be used inside HistoryProvider");
  return context;
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = authClient.useSession();
  const userId = session?.user.id ?? null;
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<HistorySyncStatus>("local");
  const [refreshVersion, setRefreshVersion] = useState(0);
  const syncAttempt = useRef(0);
  const accountStore = useMemo(
    () => (userId ? createAccountProgressStore(userId) : null),
    [userId],
  );
  const store = accountStore ?? getProgressStore();
  const syncController = useMemo(
    () => (accountStore ? createHistorySyncController(accountStore) : null),
    [accountStore],
  );

  useEffect(() => {
    if (!accountStore) return;
    return () => {
      void accountStore.close();
    };
  }, [accountStore]);

  const synchronize = useCallback(async () => {
    if (!syncController) {
      syncAttempt.current += 1;
      setSyncStatus("local");
      return;
    }

    const attempt = ++syncAttempt.current;
    if (!navigator.onLine) {
      setSyncStatus("offline");
      return;
    }

    setSyncStatus("syncing");
    try {
      await syncController.synchronize();
      if (syncAttempt.current === attempt) setSyncStatus("synced");
    } catch {
      if (syncAttempt.current === attempt) {
        setSyncStatus(navigator.onLine ? "error" : "offline");
      }
    }
  }, [syncController]);

  useEffect(() => {
    if (!syncController) {
      syncAttempt.current += 1;
      setSyncStatus("local");
    }
  }, [syncController]);

  // refreshVersion intentionally restarts this subscription after a retry.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    let active = true;
    const refresh = () => {
      setIsHistoryLoading(true);
      void store
        .listHistory()
        .then((entries) => {
          if (!active) return;
          setHistory(entries);
          setHistoryError(null);
        })
        .catch((error: unknown) => {
          if (active) setHistoryError(progressErrorMessage(error));
        })
        .finally(() => {
          if (active) setIsHistoryLoading(false);
        });
    };

    refresh();
    const synchronizeAndRefresh = () => {
      if (!syncController) return;
      void synchronize().then(refresh);
    };
    const handleStoreChange = () => {
      refresh();
      synchronizeAndRefresh();
    };
    const unsubscribe = store.subscribe(handleStoreChange);
    const handleOnline = () => synchronizeAndRefresh();
    const handleOffline = () => setSyncStatus("offline");
    window.addEventListener("online", handleOnline);
    if (accountStore) window.addEventListener("offline", handleOffline);

    if (accountStore) {
      setSyncStatus(navigator.onLine ? "syncing" : "offline");
      void accountStore
        .importAnonymousHistory()
        .then(() => {
          if (!active) return;
          refresh();
          synchronizeAndRefresh();
        })
        .catch((error: unknown) => {
          if (active) {
            setHistoryError(progressErrorMessage(error));
            setSyncStatus(navigator.onLine ? "error" : "offline");
          }
        });
    }

    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [accountStore, refreshVersion, store, syncController, synchronize]);

  const retryHistory = useCallback(() => {
    setRefreshVersion((version) => version + 1);
  }, []);

  const retrySync = useCallback(() => {
    void synchronize().then(async () => {
      try {
        setHistory(await store.listHistory());
        setHistoryError(null);
      } catch (error) {
        setHistoryError(progressErrorMessage(error));
      }
    });
  }, [store, synchronize]);

  const appendHistory = useCallback(
    async (draft: HistoryDraft) => {
      try {
        const entries = await store.appendHistory(stampEntry(draft));
        setHistory(entries);
        setHistoryError(null);
        void synchronize().then(async () => {
          setHistory(await store.listHistory());
        });
        return true;
      } catch (error) {
        setHistoryError(progressErrorMessage(error));
        return false;
      }
    },
    [store, synchronize],
  );

  return (
    <HistoryContext.Provider
      value={{
        history,
        historyError,
        isHistoryLoading,
        syncStatus,
        appendHistory,
        retryHistory,
        retrySync,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}
