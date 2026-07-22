import { localProgressStore } from "./localStore";
import type { ProgressStore } from "./store";

/** Neutral composition point for local, remote, or syncing stores. */
export function getProgressStore(): ProgressStore {
  return localProgressStore;
}

export type { ProgressStore } from "./store";
