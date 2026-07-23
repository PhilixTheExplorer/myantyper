"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  appendHistory: (draft: HistoryDraft) => Promise<boolean>;
  retryHistory: () => void;
}

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
  const [refreshVersion, setRefreshVersion] = useState(0);
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
    const synchronize = () => {
      if (!syncController) return;
      void syncController
        .synchronize()
        .then(refresh)
        .catch(() => {
          // Local history remains available while an offline sync waits to retry.
        });
    };
    const handleStoreChange = () => {
      refresh();
      synchronize();
    };
    const unsubscribe = store.subscribe(handleStoreChange);
    const handleOnline = () => synchronize();
    window.addEventListener("online", handleOnline);

    if (accountStore) {
      void accountStore
        .importAnonymousHistory()
        .then(() => {
          if (!active) return;
          refresh();
          synchronize();
        })
        .catch((error: unknown) => {
          if (active) setHistoryError(progressErrorMessage(error));
        });
    }

    return () => {
      active = false;
      unsubscribe();
      window.removeEventListener("online", handleOnline);
    };
  }, [accountStore, refreshVersion, store, syncController]);

  const retryHistory = useCallback(() => {
    setRefreshVersion((version) => version + 1);
  }, []);

  const appendHistory = useCallback(
    async (draft: HistoryDraft) => {
      try {
        const entries = await store.appendHistory(stampEntry(draft));
        setHistory(entries);
        setHistoryError(null);
        void syncController
          ?.synchronize()
          .then(async () => {
            setHistory(await store.listHistory());
          })
          .catch(() => {
            // The outbox keeps the local entry pending for the next retry.
          });
        return true;
      } catch (error) {
        setHistoryError(progressErrorMessage(error));
        return false;
      }
    },
    [store, syncController],
  );

  return (
    <HistoryContext.Provider
      value={{
        history,
        historyError,
        isHistoryLoading,
        appendHistory,
        retryHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}
