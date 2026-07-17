"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  HISTORY_STORAGE_KEY,
  type HistoryEntry,
  loadHistory,
  MAX_HISTORY_ENTRIES,
  saveHistory,
} from "@/lib/storage";

interface HistoryContextValue {
  history: HistoryEntry[];
  appendHistory: (entry: HistoryEntry) => void;
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

  useEffect(() => {
    setHistory(loadHistory());

    const syncHistory = (event: StorageEvent) => {
      if (event.key === HISTORY_STORAGE_KEY) setHistory(loadHistory());
    };
    window.addEventListener("storage", syncHistory);
    return () => window.removeEventListener("storage", syncHistory);
  }, []);

  const appendHistory = useCallback((entry: HistoryEntry) => {
    const write = () => {
      const next = [entry, ...loadHistory()].slice(0, MAX_HISTORY_ENTRIES);
      saveHistory(next);
      setHistory(next);
    };

    if ("locks" in navigator) {
      void navigator.locks.request(HISTORY_STORAGE_KEY, write);
    } else {
      write();
    }
  }, []);

  return (
    <HistoryContext.Provider value={{ history, appendHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}
