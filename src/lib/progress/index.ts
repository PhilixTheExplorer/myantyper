import { indexedDbProgressStore } from "./indexedDbStore";
import type { ProgressStore } from "./store";

/** Neutral composition point for local, remote, or syncing stores. */
export function getProgressStore(): ProgressStore {
  return indexedDbProgressStore;
}

export type { ProgressStore } from "./store";
