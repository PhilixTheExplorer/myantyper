"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getProgressStore } from "@/lib/progress";
import { progressErrorMessage } from "@/lib/progress/store";
import {
  type HistoryDraft,
  type HistoryEntry,
  stampEntry,
} from "@/lib/progress/types";

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
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const store = useMemo(() => getProgressStore(), []);

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
    const unsubscribe = store.subscribe(refresh);
    return () => {
      active = false;
      unsubscribe();
    };
  }, [refreshVersion, store]);

  const retryHistory = useCallback(() => {
    setRefreshVersion((version) => version + 1);
  }, []);

  const appendHistory = useCallback(
    async (draft: HistoryDraft) => {
      try {
        const entries = await store.appendHistory(stampEntry(draft));
        setHistory(entries);
        setHistoryError(null);
        return true;
      } catch (error) {
        setHistoryError(progressErrorMessage(error));
        return false;
      }
    },
    [store],
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
