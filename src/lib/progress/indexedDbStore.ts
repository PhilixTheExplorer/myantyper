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

export interface AccountProgressStore extends IndexedDbProgressStore {
  importAnonymousHistory(): Promise<HistoryEntry[]>;
  listPendingUploads(limit: number): Promise<HistoryEntry[]>;
  acknowledgeUploads(sessionIds: readonly string[]): Promise<void>;
  getPullCursor(): Promise<string>;
  mergeRemoteHistory(
    entries: readonly HistoryEntry[],
    nextCursor: string,
  ): Promise<void>;
}

interface IndexedDbProgressStoreOptions {
  databaseName?: string;
  channelFactory?: (name: string) => ProgressChannel | null;
}

export function accountProgressScope(userId: string): string {
  return `account:${userId}`;
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
  channelFactory = defaultChannelFactory,
}: IndexedDbProgressStoreOptions = {}): IndexedDbProgressStore {
  return createStore({
    databaseName,
    scope: ANONYMOUS_PROGRESS_SCOPE,
    channelFactory,
  });
}

interface CreateStoreOptions {
  databaseName: string;
  scope: string;
  userId?: string;
  channelFactory: (name: string) => ProgressChannel | null;
}

function createStore({
  databaseName,
  scope,
  userId,
  channelFactory,
}: CreateStoreOptions): AccountProgressStore {
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

  const store: AccountProgressStore = {
    listHistory,

    async appendHistory(entry) {
      if (!isHistoryEntry(entry)) {
        throw new TypeError("Refusing to store an invalid history entry.");
      }

      const database = await getDatabase();
      const storeNames = userId
        ? (["sessions", "outbox"] as const)
        : (["sessions"] as const);
      const transaction = database.transaction(storeNames, "readwrite");
      const key: [string, string] = [scope, entry.id];
      const sessions = transaction.objectStore("sessions");
      const existing = await sessions.get(key);
      if (!existing) {
        await sessions.add({ ...entry, scope });
        if (userId) {
          await transaction.objectStore("outbox").add({
            userId,
            sessionId: entry.id,
            queuedAt: Date.now(),
          });
        }
      }
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

    async importAnonymousHistory() {
      if (!userId) return [];
      const database = await getDatabase();
      const transaction = database.transaction(
        ["sessions", "outbox"],
        "readwrite",
      );
      const sessions = transaction.objectStore("sessions");
      const anonymousEntries = await sessions
        .index("by-scope")
        .getAll(ANONYMOUS_PROGRESS_SCOPE);
      const imported: HistoryEntry[] = [];

      for (const stored of anonymousEntries) {
        const entry = toHistoryEntry(stored);
        if (!isHistoryEntry(entry)) continue;
        const key: [string, string] = [scope, entry.id];
        if (await sessions.get(key)) continue;
        await sessions.add({ ...entry, scope });
        await transaction.objectStore("outbox").put({
          userId,
          sessionId: entry.id,
          queuedAt: Date.now(),
        });
        imported.push(entry);
      }
      await transaction.done;

      if (imported.length > 0) {
        getChannel()?.postMessage({ type: HISTORY_CHANGED, scope });
      }
      return newestFirst(imported);
    },

    async listPendingUploads(limit) {
      if (!userId || !Number.isSafeInteger(limit) || limit < 1) return [];
      const database = await getDatabase();
      const transaction = database.transaction(
        ["sessions", "outbox"],
        "readonly",
      );
      const pending = await transaction
        .objectStore("outbox")
        .index("by-user")
        .getAll(userId);
      pending.sort(
        (a, b) =>
          a.queuedAt - b.queuedAt || a.sessionId.localeCompare(b.sessionId),
      );

      const entries: HistoryEntry[] = [];
      for (const item of pending.slice(0, limit)) {
        const stored = await transaction
          .objectStore("sessions")
          .get([scope, item.sessionId]);
        if (!stored) continue;
        const entry = toHistoryEntry(stored);
        if (isHistoryEntry(entry)) entries.push(entry);
      }
      await transaction.done;
      return entries;
    },

    async acknowledgeUploads(sessionIds) {
      if (!userId || sessionIds.length === 0) return;
      const database = await getDatabase();
      const transaction = database.transaction("outbox", "readwrite");
      for (const sessionId of new Set(sessionIds)) {
        await transaction.store.delete([userId, sessionId]);
      }
      await transaction.done;
    },

    async getPullCursor() {
      const database = await getDatabase();
      const metadata = await database.get("syncMetadata", scope);
      return metadata?.pullCursor ?? "0";
    },

    async mergeRemoteHistory(entries, nextCursor) {
      if (
        !entries.every(isHistoryEntry) ||
        !/^\d+$/.test(nextCursor) ||
        !Number.isSafeInteger(Number(nextCursor))
      ) {
        throw new TypeError("Refusing to merge invalid remote history.");
      }

      const database = await getDatabase();
      const transaction = database.transaction(
        ["sessions", "syncMetadata"],
        "readwrite",
      );
      const sessions = transaction.objectStore("sessions");
      let changed = false;
      for (const entry of entries) {
        const key: [string, string] = [scope, entry.id];
        if (await sessions.get(key)) continue;
        await sessions.add({ ...entry, scope });
        changed = true;
      }

      const metadataStore = transaction.objectStore("syncMetadata");
      const current = await metadataStore.get(scope);
      const currentCursor = current?.pullCursor ?? "0";
      const cursor =
        BigInt(nextCursor) > BigInt(currentCursor) ? nextCursor : currentCursor;
      await metadataStore.put({
        scope,
        pullCursor: cursor,
        lastSyncedAt: Date.now(),
      });
      await transaction.done;

      if (changed) getChannel()?.postMessage({ type: HISTORY_CHANGED, scope });
    },
  };

  return store;
}

export const indexedDbProgressStore = createIndexedDbProgressStore();

export function createAccountProgressStore(
  userId: string,
  options: IndexedDbProgressStoreOptions = {},
): AccountProgressStore {
  const databaseName = options.databaseName ?? PROGRESS_DATABASE_NAME;
  return createStore({
    databaseName,
    scope: accountProgressScope(userId),
    userId,
    channelFactory: options.channelFactory ?? defaultChannelFactory,
  });
}
