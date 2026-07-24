import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import type { ProgressStore } from "./store";
import {
  type HistoryEntry,
  type HistoryOverview,
  type HistoryPage,
  isHistoryEntry,
  type LessonHistoryStat,
} from "./types";

export const PROGRESS_DATABASE_NAME = "myantyper-progress";
export const ANONYMOUS_PROGRESS_SCOPE = "anonymous";

const PROGRESS_DATABASE_VERSION = 3;
const HISTORY_CHANGED = "history-changed";
const RECENT_HISTORY_LIMIT = 30;
const MAX_HISTORY_PAGE_SIZE = 100;

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

interface StoredHistoryAggregate {
  scope: string;
  sessions: number;
  bestWPM: number;
  sumWPM: number;
  sumAccuracy: number;
  totalSeconds: number;
  recent: HistoryEntry[];
  lessonStats: Map<string, LessonHistoryStat>;
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
    indexes: {
      "by-user": string;
      "by-user-queued-at": [userId: string, queuedAt: number];
    };
  };
  syncMetadata: {
    key: string;
    value: SyncMetadata;
  };
  aggregates: {
    key: string;
    value: StoredHistoryAggregate;
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
  importAnonymousHistory(): Promise<number>;
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
    outbox.createIndex("by-user-queued-at", ["userId", "queuedAt"]);
  }

  if (!database.objectStoreNames.contains("syncMetadata")) {
    database.createObjectStore("syncMetadata", { keyPath: "scope" });
  }

  if (!database.objectStoreNames.contains("aggregates")) {
    database.createObjectStore("aggregates", { keyPath: "scope" });
  }
}

function newestFirst(entries: HistoryEntry[]): HistoryEntry[] {
  return entries.sort(
    (a, b) => b.completedAt - a.completedAt || b.id.localeCompare(a.id),
  );
}

function toHistoryEntry({ scope: _scope, ...entry }: StoredHistoryEntry) {
  return entry;
}

function emptyAggregate(scope: string): StoredHistoryAggregate {
  return {
    scope,
    sessions: 0,
    bestWPM: 0,
    sumWPM: 0,
    sumAccuracy: 0,
    totalSeconds: 0,
    recent: [],
    lessonStats: new Map(),
  };
}

function addToAggregate(
  aggregate: StoredHistoryAggregate,
  entry: HistoryEntry,
): void {
  aggregate.sessions += 1;
  aggregate.bestWPM = Math.max(aggregate.bestWPM, entry.wpm);
  aggregate.sumWPM += entry.wpm;
  aggregate.sumAccuracy += entry.accuracy;
  aggregate.totalSeconds += entry.seconds;
  aggregate.recent = newestFirst([...aggregate.recent, entry]).slice(
    0,
    RECENT_HISTORY_LIMIT,
  );

  const current = aggregate.lessonStats.get(entry.lessonId);
  aggregate.lessonStats.set(
    entry.lessonId,
    current
      ? {
          attempts: current.attempts + 1,
          best: Math.max(current.best, entry.wpm),
          bestAcc: Math.max(current.bestAcc, entry.accuracy),
        }
      : { attempts: 1, best: entry.wpm, bestAcc: entry.accuracy },
  );
}

function toHistoryOverview(aggregate: StoredHistoryAggregate): HistoryOverview {
  const { sessions } = aggregate;
  return {
    summary: {
      sessions,
      bestWPM: aggregate.bestWPM,
      avgWPM: sessions ? Math.round(aggregate.sumWPM / sessions) : 0,
      avgAccuracy: sessions
        ? Math.round((aggregate.sumAccuracy / sessions) * 10) / 10
        : 0,
      totalMinutes: Math.round(aggregate.totalSeconds / 60),
    },
    lessonStats: new Map(aggregate.lessonStats),
    recent: aggregate.recent.slice(),
  };
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
      {
        upgrade(database, _oldVersion, _newVersion, transaction) {
          createSchema(database);
          const outbox = transaction.objectStore("outbox");
          if (!outbox.indexNames.contains("by-user-queued-at")) {
            outbox.createIndex("by-user-queued-at", ["userId", "queuedAt"]);
          }
        },
      },
    );
    return databasePromise;
  };

  const getChannel = () => {
    if (channel === undefined) channel = channelFactory(channelName);
    return channel;
  };

  const getHistoryOverview = async (): Promise<HistoryOverview> => {
    const database = await getDatabase();
    const cached = await database.get("aggregates", scope);
    if (cached) return toHistoryOverview(cached);

    // Existing version-1 databases build this once. The read/write transaction
    // prevents an append from landing between the scan and cached rollup.
    const transaction = database.transaction(
      ["sessions", "aggregates"],
      "readwrite",
    );
    const aggregates = transaction.objectStore("aggregates");
    const existing = await aggregates.get(scope);
    if (existing) {
      await transaction.done;
      return toHistoryOverview(existing);
    }

    const aggregate = emptyAggregate(scope);
    let cursor = await transaction
      .objectStore("sessions")
      .index("by-scope")
      .openCursor(scope);
    while (cursor) {
      const entry = toHistoryEntry(cursor.value);
      if (isHistoryEntry(entry)) addToAggregate(aggregate, entry);
      cursor = await cursor.continue();
    }
    await aggregates.put(aggregate);
    await transaction.done;
    return toHistoryOverview(aggregate);
  };

  const listHistoryPage = async (
    offset: number,
    limit: number,
  ): Promise<HistoryPage> => {
    if (
      !Number.isSafeInteger(offset) ||
      offset < 0 ||
      !Number.isSafeInteger(limit) ||
      limit < 1 ||
      limit > MAX_HISTORY_PAGE_SIZE
    ) {
      throw new RangeError("Invalid history page request.");
    }

    const database = await getDatabase();
    const transaction = database.transaction(
      ["sessions", "aggregates"],
      "readonly",
    );
    const aggregate = await transaction.objectStore("aggregates").get(scope);
    if (!aggregate) {
      await transaction.done;
      await getHistoryOverview();
      return listHistoryPage(offset, limit);
    }

    const entries: HistoryEntry[] = [];
    const range = IDBKeyRange.bound(
      [scope, 0],
      [scope, Number.MAX_SAFE_INTEGER],
    );
    let cursor = await transaction
      .objectStore("sessions")
      .index("by-scope-completed-at")
      .openCursor(range, "prev");
    if (cursor && offset > 0) cursor = await cursor.advance(offset);

    while (cursor && entries.length < limit) {
      const entry = toHistoryEntry(cursor.value);
      if (isHistoryEntry(entry)) entries.push(entry);
      cursor = await cursor.continue();
    }
    await transaction.done;

    return { entries, total: aggregate.sessions };
  };

  const store: AccountProgressStore = {
    listHistoryPage,
    getHistoryOverview,

    async appendHistory(entry) {
      if (!isHistoryEntry(entry)) {
        throw new TypeError("Refusing to store an invalid history entry.");
      }

      const database = await getDatabase();
      const storeNames = userId
        ? (["sessions", "outbox", "aggregates"] as const)
        : (["sessions", "aggregates"] as const);
      const transaction = database.transaction(storeNames, "readwrite");
      const key: [string, string] = [scope, entry.id];
      const sessions = transaction.objectStore("sessions");
      const existing = await sessions.get(key);
      if (!existing) {
        const aggregate = await transaction
          .objectStore("aggregates")
          .get(scope);
        await sessions.add({ ...entry, scope });
        if (aggregate) {
          addToAggregate(aggregate, entry);
          await transaction.objectStore("aggregates").put(aggregate);
        }
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
      if (!userId) return 0;
      const database = await getDatabase();
      const transaction = database.transaction(
        ["sessions", "outbox", "aggregates"],
        "readwrite",
      );
      const sessions = transaction.objectStore("sessions");
      const aggregate = await transaction.objectStore("aggregates").get(scope);
      let anonymousCursor = await sessions
        .index("by-scope")
        .openCursor(ANONYMOUS_PROGRESS_SCOPE);
      let imported = 0;

      while (anonymousCursor) {
        const entry = toHistoryEntry(anonymousCursor.value);
        if (!isHistoryEntry(entry)) {
          anonymousCursor = await anonymousCursor.continue();
          continue;
        }
        const key: [string, string] = [scope, entry.id];
        if (!(await sessions.get(key))) {
          await sessions.add({ ...entry, scope });
          await transaction.objectStore("outbox").put({
            userId,
            sessionId: entry.id,
            queuedAt: Date.now(),
          });
          if (aggregate) addToAggregate(aggregate, entry);
          imported += 1;
        }
        anonymousCursor = await anonymousCursor.continue();
      }
      if (aggregate && imported > 0) {
        await transaction.objectStore("aggregates").put(aggregate);
      }
      await transaction.done;

      if (imported > 0) {
        getChannel()?.postMessage({ type: HISTORY_CHANGED, scope });
      }
      return imported;
    },

    async listPendingUploads(limit) {
      if (!userId || !Number.isSafeInteger(limit) || limit < 1) return [];
      const database = await getDatabase();
      const transaction = database.transaction(
        ["sessions", "outbox"],
        "readonly",
      );
      const range = IDBKeyRange.bound(
        [userId, 0],
        [userId, Number.MAX_SAFE_INTEGER],
      );
      const pending = await transaction
        .objectStore("outbox")
        .index("by-user-queued-at")
        .getAll(range, limit);

      const entries: HistoryEntry[] = [];
      for (const item of pending) {
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
        ["sessions", "syncMetadata", "aggregates"],
        "readwrite",
      );
      const sessions = transaction.objectStore("sessions");
      const aggregate = await transaction.objectStore("aggregates").get(scope);
      let changed = false;
      for (const entry of entries) {
        const key: [string, string] = [scope, entry.id];
        if (await sessions.get(key)) continue;
        await sessions.add({ ...entry, scope });
        if (aggregate) addToAggregate(aggregate, entry);
        changed = true;
      }
      if (aggregate && changed) {
        await transaction.objectStore("aggregates").put(aggregate);
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
