import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  HISTORY_STORAGE_KEY,
  localProgressStore,
  parseStoredHistory,
} from "./localStore";
import { HISTORY_SCHEMA_VERSION, type HistoryEntry, stampEntry } from "./types";

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

function envelope(entries: unknown[], version = HISTORY_SCHEMA_VERSION) {
  return JSON.stringify({ version, entries });
}

describe("parseStoredHistory", () => {
  it("reads valid entries from a current envelope", () => {
    const e = entry();
    expect(parseStoredHistory(envelope([e]))).toEqual([e]);
  });

  it("orders entries newest first", () => {
    const older = entry({ id: "older", completedAt: Date.UTC(2026, 6, 14) });
    const newer = entry({ id: "newer", completedAt: Date.UTC(2026, 6, 18) });
    expect(
      parseStoredHistory(envelope([older, newer])).map((e) => e.id),
    ).toEqual(["newer", "older"]);
  });

  it("collapses duplicate ids", () => {
    expect(parseStoredHistory(envelope([entry(), entry()]))).toHaveLength(1);
  });

  it("drops individual malformed entries rather than the whole log", () => {
    const stored = envelope([entry(), { lessonId: "core-u01-a" }]);
    expect(parseStoredHistory(stored)).toHaveLength(1);
  });

  it("rejects entries that fail validation", () => {
    expect(parseStoredHistory(envelope([entry({ wpm: -1 })]))).toEqual([]);
    expect(parseStoredHistory(envelope([entry({ completedAt: 0 })]))).toEqual(
      [],
    );
    expect(
      parseStoredHistory(envelope([entry({ lessonId: "../etc" })])),
    ).toEqual([]);
    expect(parseStoredHistory(envelope([entry({ id: "" })]))).toEqual([]);
  });

  it("ignores an unknown envelope version", () => {
    expect(parseStoredHistory(envelope([entry()], 99))).toEqual([]);
  });

  it("ignores shapes it does not recognize", () => {
    expect(parseStoredHistory('"nope"')).toEqual([]);
    expect(parseStoredHistory("{}")).toEqual([]);
    expect(parseStoredHistory('[{"date":"2026-07-16T00:00:00.000Z"}]')).toEqual(
      [],
    );
  });
});

describe("localProgressStore", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = new Map();
    vi.stubGlobal("window", {
      addEventListener() {},
      removeEventListener() {},
    });
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => void store.set(k, v),
      removeItem: (k: string) => void store.delete(k),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("reads as empty when nothing is stored", async () => {
    expect(await localProgressStore.listHistory()).toEqual([]);
  });

  it("appends and persists as a versioned envelope, newest first", async () => {
    const older = entry({ id: "older", completedAt: Date.UTC(2026, 6, 14) });
    const newer = entry({ id: "newer", completedAt: Date.UTC(2026, 6, 20) });

    await localProgressStore.appendHistory(older);
    const entries = await localProgressStore.appendHistory(newer);

    expect(entries.map((e) => e.id)).toEqual(["newer", "older"]);
    expect(await localProgressStore.listHistory()).toEqual(entries);

    const written = JSON.parse(store.get(HISTORY_STORAGE_KEY) as string);
    expect(written.version).toBe(HISTORY_SCHEMA_VERSION);
  });

  it("ignores a repeated append of the same id", async () => {
    await localProgressStore.appendHistory(entry());
    expect(await localProgressStore.appendHistory(entry())).toHaveLength(1);
  });

  it("does not silently truncate older entries", async () => {
    for (let index = 0; index < 201; index += 1) {
      await localProgressStore.appendHistory(
        entry({
          id: `session-${index}`,
          completedAt: Date.UTC(2026, 6, 16) + index,
        }),
      );
    }

    expect(await localProgressStore.listHistory()).toHaveLength(201);
  });

  it("starts clean when the stored value is unreadable", async () => {
    store.set(HISTORY_STORAGE_KEY, "{ not json");
    expect(await localProgressStore.listHistory()).toEqual([]);

    const added = await localProgressStore.appendHistory(entry());
    expect(added).toHaveLength(1);
  });
});
