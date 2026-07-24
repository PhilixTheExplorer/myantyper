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
  emptyHistoryOverview,
  type HistoryDraft,
  type HistoryOverview,
  type HistoryPage,
  stampEntry,
} from "@/lib/progress/types";
import { createHistorySyncController } from "@/lib/sync/historyClient";

interface HistoryContextValue {
  overview: HistoryOverview;
  historyRevision: number;
  historyError: string | null;
  isHistoryLoading: boolean;
  syncStatus: HistorySyncStatus;
  listHistoryPage: (offset: number, limit: number) => Promise<HistoryPage>;
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
  const [overview, setOverview] =
    useState<HistoryOverview>(emptyHistoryOverview);
  const [historyRevision, setHistoryRevision] = useState(0);
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
  const activeStore = useRef(store);
  activeStore.current = store;
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

  const refreshHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    try {
      const nextOverview = await store.getHistoryOverview();
      if (activeStore.current !== store) return;
      setOverview(nextOverview);
      setHistoryRevision((revision) => revision + 1);
      setHistoryError(null);
    } catch (error) {
      if (activeStore.current === store) {
        setHistoryError(progressErrorMessage(error));
      }
    } finally {
      if (activeStore.current === store) setIsHistoryLoading(false);
    }
  }, [store]);

  // refreshVersion intentionally restarts this subscription after a retry.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (active) void refreshHistory();
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
  }, [
    accountStore,
    refreshHistory,
    refreshVersion,
    store,
    syncController,
    synchronize,
  ]);

  const retryHistory = useCallback(() => {
    setRefreshVersion((version) => version + 1);
  }, []);

  const retrySync = useCallback(() => {
    void synchronize().then(refreshHistory);
  }, [refreshHistory, synchronize]);

  const listHistoryPage = useCallback(
    (offset: number, limit: number) => store.listHistoryPage(offset, limit),
    [store],
  );

  const appendHistory = useCallback(
    async (draft: HistoryDraft) => {
      try {
        await store.appendHistory(stampEntry(draft));
        await refreshHistory();
        void synchronize().then(refreshHistory);
        return true;
      } catch (error) {
        setHistoryError(progressErrorMessage(error));
        return false;
      }
    },
    [refreshHistory, store, synchronize],
  );

  return (
    <HistoryContext.Provider
      value={{
        overview,
        historyRevision,
        historyError,
        isHistoryLoading,
        syncStatus,
        listHistoryPage,
        appendHistory,
        retryHistory,
        retrySync,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}
