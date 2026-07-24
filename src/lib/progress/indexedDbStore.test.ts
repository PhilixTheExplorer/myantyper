import "fake-indexeddb/auto";
import { deleteDB } from "idb";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createAccountProgressStore,
  createIndexedDbProgressStore,
  type IndexedDbProgressStore,
  type ProgressChannel,
} from "./indexedDbStore";
import { type HistoryEntry, stampEntry } from "./types";

function entry(partial: Partial<HistoryEntry> = {}): HistoryEntry {
  return stampEntry({
    id: "session-1",
    completedAt: Date.UTC(2026, 6, 16, 9, 30),
    lessonId: "core-u01-a",
    title: "Drill 1",
    wpm: 32,
    accuracy: 96.5,
    seconds: 45,
    keystrokes: 120,
    ...partial,
  });
}

async function allHistory(store: IndexedDbProgressStore) {
  return (await store.listHistoryPage(0, 100)).entries;
}

class TestChannel implements ProgressChannel {
  static channels = new Map<string, Set<TestChannel>>();

  readonly listeners = new Set<
    (event: MessageEvent<{ type: "history-changed"; scope: string }>) => void
  >();

  constructor(readonly name: string) {
    const channels = TestChannel.channels.get(name) ?? new Set<TestChannel>();
    channels.add(this);
    TestChannel.channels.set(name, channels);
  }

  postMessage(message: { type: "history-changed"; scope: string }): void {
    for (const channel of TestChannel.channels.get(this.name) ?? []) {
      if (channel === this) continue;
      for (const listener of channel.listeners) {
        listener({ data: message } as MessageEvent<typeof message>);
      }
    }
  }

  addEventListener(
    _type: "message",
    listener: (event: MessageEvent) => void,
  ): void {
    this.listeners.add(listener);
  }

  removeEventListener(
    _type: "message",
    listener: (event: MessageEvent) => void,
  ): void {
    this.listeners.delete(listener);
  }

  close(): void {
    TestChannel.channels.get(this.name)?.delete(this);
    this.listeners.clear();
  }
}

describe("indexedDbProgressStore", () => {
  let databaseName: string;
  let stores: IndexedDbProgressStore[];

  const createStore = (userId?: string) => {
    const options = {
      databaseName,
      channelFactory: (name: string) => new TestChannel(name),
    };
    const store = userId
      ? createAccountProgressStore(userId, options)
      : createIndexedDbProgressStore(options);
    stores.push(store);
    return store;
  };

  beforeEach(() => {
    databaseName = `myantyper-progress-test-${crypto.randomUUID()}`;
    stores = [];
  });

  afterEach(async () => {
    await Promise.all(stores.map((store) => store.close()));
    await deleteDB(databaseName);
    TestChannel.channels.clear();
  });

  it("reads as empty when nothing is stored", async () => {
    const store = createStore();
    expect(await store.listHistoryPage(0, 20)).toEqual({
      entries: [],
      total: 0,
    });
    expect((await store.getHistoryOverview()).summary.sessions).toBe(0);
  });

  it("persists sessions newest first across store instances", async () => {
    const writer = createStore();
    const older = entry({ id: "older", completedAt: Date.UTC(2026, 6, 14) });
    const newer = entry({ id: "newer", completedAt: Date.UTC(2026, 6, 20) });

    await writer.appendHistory(older);
    await writer.appendHistory(newer);

    const reader = createStore();
    expect((await allHistory(reader)).map((item) => item.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("reads bounded pages and maintains all-time rollups", async () => {
    const store = createStore();
    for (let index = 0; index < 45; index++) {
      await store.appendHistory(
        entry({
          id: `session-${String(index).padStart(2, "0")}`,
          completedAt: Date.UTC(2026, 6, 1, 0, 0, index),
          lessonId: index % 2 === 0 ? "lesson-a" : "lesson-b",
          wpm: 20 + index,
          accuracy: 90 + (index % 10),
          seconds: 60,
        }),
      );
    }

    const first = await store.listHistoryPage(0, 20);
    const second = await store.listHistoryPage(20, 20);
    const last = await store.listHistoryPage(40, 20);
    expect(first.total).toBe(45);
    expect(first.entries).toHaveLength(20);
    expect(second.entries).toHaveLength(20);
    expect(last.entries.map((item) => item.id)).toEqual([
      "session-04",
      "session-03",
      "session-02",
      "session-01",
      "session-00",
    ]);

    const overview = await store.getHistoryOverview();
    expect(overview.summary).toEqual({
      sessions: 45,
      bestWPM: 64,
      avgWPM: 42,
      avgAccuracy: 94.2,
      totalMinutes: 45,
    });
    expect(overview.recent).toHaveLength(30);
    expect(overview.recent[0]?.id).toBe("session-44");
    expect(overview.lessonStats.get("lesson-a")).toEqual({
      attempts: 23,
      best: 64,
      bestAcc: 98,
    });

    await store.appendHistory(
      entry({
        id: "session-45",
        completedAt: Date.UTC(2026, 6, 1, 0, 0, 45),
        lessonId: "lesson-a",
        wpm: 70,
      }),
    );
    expect((await store.getHistoryOverview()).summary.sessions).toBe(46);
  });

  it("rejects invalid page requests", async () => {
    const store = createStore();
    await expect(store.listHistoryPage(-1, 20)).rejects.toThrow(
      "Invalid history page",
    );
    await expect(store.listHistoryPage(0, 101)).rejects.toThrow(
      "Invalid history page",
    );
  });

  it("keeps the first immutable record when an id is appended again", async () => {
    const store = createStore();
    await store.appendHistory(entry());
    await store.appendHistory(entry({ wpm: 99 }));
    const history = await allHistory(store);

    expect(history).toHaveLength(1);
    expect(history[0].wpm).toBe(32);
  });

  it("isolates history by local scope", async () => {
    const anonymous = createStore();
    const account = createStore("user-1");

    await anonymous.appendHistory(entry({ id: "anonymous-session" }));
    await account.appendHistory(entry({ id: "account-session" }));

    expect((await allHistory(anonymous)).map((item) => item.id)).toEqual([
      "anonymous-session",
    ]);
    expect((await allHistory(account)).map((item) => item.id)).toEqual([
      "account-session",
    ]);
  });

  it("imports anonymous history once and queues it for the account", async () => {
    const anonymous = createStore();
    const account = createAccountProgressStore("user-1", {
      databaseName,
      channelFactory: (name) => new TestChannel(name),
    });
    stores.push(account);
    await anonymous.appendHistory(entry({ id: "local-session" }));

    expect(await account.importAnonymousHistory()).toBe(1);
    expect(await account.importAnonymousHistory()).toBe(0);
    expect(await account.listPendingUploads(100)).toEqual([
      entry({ id: "local-session" }),
    ]);
  });

  it("queues new account history until the server acknowledges it", async () => {
    const account = createAccountProgressStore("user-1", {
      databaseName,
      channelFactory: (name) => new TestChannel(name),
    });
    stores.push(account);
    await account.appendHistory(entry());
    await account.appendHistory(entry({ wpm: 99 }));

    expect(await account.listPendingUploads(100)).toEqual([entry()]);
    await account.acknowledgeUploads(["session-1"]);
    expect(await account.listPendingUploads(100)).toEqual([]);
  });

  it("reads pending uploads in bounded batches", async () => {
    const account = createAccountProgressStore("user-1", {
      databaseName,
      channelFactory: (name) => new TestChannel(name),
    });
    stores.push(account);
    await account.appendHistory(entry({ id: "pending-1" }));
    await account.appendHistory(entry({ id: "pending-2" }));
    await account.appendHistory(entry({ id: "pending-3" }));

    const firstBatch = await account.listPendingUploads(2);
    expect(firstBatch).toHaveLength(2);
    await account.acknowledgeUploads(firstBatch.map((item) => item.id));
    expect(await account.listPendingUploads(2)).toHaveLength(1);
  });

  it("merges remote history without requeueing or regressing its cursor", async () => {
    const account = createAccountProgressStore("user-1", {
      databaseName,
      channelFactory: (name) => new TestChannel(name),
    });
    stores.push(account);
    await account.appendHistory(entry({ id: "same", wpm: 32 }));
    await account.acknowledgeUploads(["same"]);

    await account.mergeRemoteHistory(
      [
        entry({ id: "same", wpm: 99 }),
        entry({ id: "remote", completedAt: Date.UTC(2026, 6, 20) }),
      ],
      "12",
    );
    await account.mergeRemoteHistory([], "7");

    expect(
      (await account.listHistoryPage(0, 100)).entries.map(({ id, wpm }) => ({
        id,
        wpm,
      })),
    ).toEqual([
      { id: "remote", wpm: 32 },
      { id: "same", wpm: 32 },
    ]);
    expect(await account.listPendingUploads(100)).toEqual([]);
    expect(await account.getPullCursor()).toBe("12");
  });

  it("notifies another store in the same scope after an append", async () => {
    const writer = createStore();
    const reader = createStore();
    const onChange = vi.fn();
    const unsubscribe = reader.subscribe(onChange);

    await writer.appendHistory(entry());

    expect(onChange).toHaveBeenCalledOnce();
    expect(await allHistory(reader)).toEqual([entry()]);
    unsubscribe();
  });

  it("does not notify subscribers in another scope", async () => {
    const writer = createStore();
    const account = createStore("user-1");
    const onChange = vi.fn();
    account.subscribe(onChange);

    await writer.appendHistory(entry());

    expect(onChange).not.toHaveBeenCalled();
  });

  it("rejects invalid records", async () => {
    const store = createStore();
    await expect(
      store.appendHistory({ ...entry(), accuracy: 101 }),
    ).rejects.toThrow("invalid history entry");
    expect(await allHistory(store)).toEqual([]);
  });
});
