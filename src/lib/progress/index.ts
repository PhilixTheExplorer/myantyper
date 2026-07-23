import {
  createAccountProgressStore,
  indexedDbProgressStore,
} from "./indexedDbStore";
import type { ProgressStore } from "./store";

/** Neutral composition point for local, remote, or syncing stores. */
export function getProgressStore(userId?: string | null): ProgressStore {
  return userId ? createAccountProgressStore(userId) : indexedDbProgressStore;
}

export type { AccountProgressStore } from "./indexedDbStore";
export { createAccountProgressStore } from "./indexedDbStore";
export type { ProgressStore } from "./store";
