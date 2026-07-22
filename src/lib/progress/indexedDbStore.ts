import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { ProgressStore } from "./store";
import { type HistoryEntry, isHistoryEntry } from "./types";

export const PROGRESS_DATABASE_NAME = "myantyper-progress";
export const ANONYMOUS_PROGRESS_SCOPE = "anonymous";

const PROGRESS_DATABASE_VERSION = 1;
const HISTORY_CHANGED = "history-changed";

interface StoredHistoryEntry extends HistoryEntry {
  scope: string;
}

interface PendingUpload {
  userId: string;
  sessionId: string;
  queuedAt: number;
}

interface SyncMetadata {
  scope: string;
  pullCursor: string | null;
  lastSyncedAt: number | null;
}

interface ProgressDatabase extends DBSchema {
  sessions: {
    key: [scope: string, sessionId: string];
    value: StoredHistoryEntry;
    indexes: {
      "by-scope": string;
      "by-scope-completed-at": [scope: string, completedAt: number];
      "by-scope-lesson": [scope: string, lessonId: string];
    };
  };
  outbox: {
    key: [userId: string, sessionId: string];
    value: PendingUpload;
    indexes: { "by-user": string };
  };
  syncMetadata: {
    key: string;
    value: SyncMetadata;
  };
}

interface ProgressMessage {
  type: typeof HISTORY_CHANGED;
  scope: string;
}

export interface ProgressChannel {
  postMessage(message: ProgressMessage): void;
  addEventListener(
    type: "message",
    listener: (event: MessageEvent<ProgressMessage>) => void,
  ): void;
  removeEventListener(
    type: "message",
    listener: (event: MessageEvent<ProgressMessage>) => void,
  ): void;
  close(): void;
}

export interface IndexedDbProgressStore extends ProgressStore {
  close(): Promise<void>;
}

interface IndexedDbProgressStoreOptions {
  databaseName?: string;
  scope?: string;
  channelFactory?: (name: string) => ProgressChannel | null;
}

function defaultChannelFactory(name: string): ProgressChannel | null {
  if (typeof BroadcastChannel === "undefined") return null;
  return new BroadcastChannel(name);
}

function createSchema(database: IDBPDatabase<ProgressDatabase>): void {
  if (!database.objectStoreNames.contains("sessions")) {
    const sessions = database.createObjectStore("sessions", {
      keyPath: ["scope", "id"],
    });
    sessions.createIndex("by-scope", "scope");
    sessions.createIndex("by-scope-completed-at", ["scope", "completedAt"]);
    sessions.createIndex("by-scope-lesson", ["scope", "lessonId"]);
  }

  if (!database.objectStoreNames.contains("outbox")) {
    const outbox = database.createObjectStore("outbox", {
      keyPath: ["userId", "sessionId"],
    });
    outbox.createIndex("by-user", "userId");
  }

  if (!database.objectStoreNames.contains("syncMetadata")) {
    database.createObjectStore("syncMetadata", { keyPath: "scope" });
  }
}

function newestFirst(entries: HistoryEntry[]): HistoryEntry[] {
  return entries.sort(
    (a, b) => b.completedAt - a.completedAt || a.id.localeCompare(b.id),
  );
}

function toHistoryEntry({ scope: _scope, ...entry }: StoredHistoryEntry) {
  return entry;
}

function isProgressMessage(value: unknown): value is ProgressMessage {
  if (typeof value !== "object" || value === null) return false;
  const message = value as Partial<ProgressMessage>;
  return message.type === HISTORY_CHANGED && typeof message.scope === "string";
}

export function createIndexedDbProgressStore({
  databaseName = PROGRESS_DATABASE_NAME,
  scope = ANONYMOUS_PROGRESS_SCOPE,
  channelFactory = defaultChannelFactory,
}: IndexedDbProgressStoreOptions = {}): IndexedDbProgressStore {
  const channelName = `${databaseName}:changes`;
  let databasePromise: Promise<IDBPDatabase<ProgressDatabase>> | null = null;
  let channel: ProgressChannel | null | undefined;

  const getDatabase = () => {
    if (typeof indexedDB === "undefined") {
      return Promise.reject(new Error("IndexedDB is unavailable."));
    }
    databasePromise ??= openDB<ProgressDatabase>(
      databaseName,
      PROGRESS_DATABASE_VERSION,
      { upgrade: createSchema },
    );
    return databasePromise;
  };

  const getChannel = () => {
    if (channel === undefined) channel = channelFactory(channelName);
    return channel;
  };

  const listHistory = async (): Promise<HistoryEntry[]> => {
    const database = await getDatabase();
    const stored = await database.getAllFromIndex(
      "sessions",
      "by-scope",
      scope,
    );
    return newestFirst(
      stored.map(toHistoryEntry).filter((entry) => isHistoryEntry(entry)),
    );
  };

  return {
    listHistory,

    async appendHistory(entry) {
      if (!isHistoryEntry(entry)) {
        throw new TypeError("Refusing to store an invalid history entry.");
      }

      const database = await getDatabase();
      const transaction = database.transaction("sessions", "readwrite");
      const key: [string, string] = [scope, entry.id];
      const existing = await transaction.store.get(key);
      if (!existing) await transaction.store.add({ ...entry, scope });
      await transaction.done;

      getChannel()?.postMessage({ type: HISTORY_CHANGED, scope });
      return listHistory();
    },

    subscribe(onChange) {
      const activeChannel = getChannel();
      if (!activeChannel) return () => {};

      const handle = (event: MessageEvent<ProgressMessage>) => {
        if (isProgressMessage(event.data) && event.data.scope === scope) {
          onChange();
        }
      };
      activeChannel.addEventListener("message", handle);
      return () => activeChannel.removeEventListener("message", handle);
    },

    async close() {
      channel?.close();
      channel = undefined;
      if (!databasePromise) return;
      const database = await databasePromise;
      database.close();
      databasePromise = null;
    },
  };
}

export const indexedDbProgressStore = createIndexedDbProgressStore();
