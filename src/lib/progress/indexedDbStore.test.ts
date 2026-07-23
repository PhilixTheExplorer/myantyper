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
    expect(await createStore().listHistory()).toEqual([]);
  });

  it("persists sessions newest first across store instances", async () => {
    const writer = createStore();
    const older = entry({ id: "older", completedAt: Date.UTC(2026, 6, 14) });
    const newer = entry({ id: "newer", completedAt: Date.UTC(2026, 6, 20) });

    await writer.appendHistory(older);
    await writer.appendHistory(newer);

    const reader = createStore();
    expect((await reader.listHistory()).map((item) => item.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it("keeps the first immutable record when an id is appended again", async () => {
    const store = createStore();
    await store.appendHistory(entry());
    const history = await store.appendHistory(entry({ wpm: 99 }));

    expect(history).toHaveLength(1);
    expect(history[0].wpm).toBe(32);
  });

  it("isolates history by local scope", async () => {
    const anonymous = createStore();
    const account = createStore("user-1");

    await anonymous.appendHistory(entry({ id: "anonymous-session" }));
    await account.appendHistory(entry({ id: "account-session" }));

    expect((await anonymous.listHistory()).map((item) => item.id)).toEqual([
      "anonymous-session",
    ]);
    expect((await account.listHistory()).map((item) => item.id)).toEqual([
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

    expect(await account.importAnonymousHistory()).toEqual([
      entry({ id: "local-session" }),
    ]);
    expect(await account.importAnonymousHistory()).toEqual([]);
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
      (await account.listHistory()).map(({ id, wpm }) => ({ id, wpm })),
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
    expect(await reader.listHistory()).toEqual([entry()]);
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
    expect(await store.listHistory()).toEqual([]);
  });
});
