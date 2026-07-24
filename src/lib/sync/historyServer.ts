import { and, asc, eq, gt } from "drizzle-orm";
import { getDatabase } from "@/db";
import { history } from "@/db/schema";
import { authenticatedUserId } from "@/lib/auth/session";
import type { HistoryEntry } from "@/lib/progress/types";
import type { HistorySyncRepository } from "./historyApi";

export const authenticatedHistoryUserId = authenticatedUserId;

export const databaseHistorySyncRepository: HistorySyncRepository = {
  async upload(userId, entries) {
    if (entries.length === 0) return;

    await getDatabase()
      .insert(history)
      .values(
        entries.map((entry) => ({
          userId,
          id: entry.id,
          schemaVersion: entry.schemaVersion,
          completedAt: entry.completedAt,
          lessonId: entry.lessonId,
          title: entry.title,
          wpm: entry.wpm,
          accuracy: entry.accuracy,
          seconds: entry.seconds,
          keystrokes: entry.keystrokes,
        })),
      )
      .onConflictDoNothing({ target: [history.userId, history.id] });
  },

  async pull(userId, cursor, limit) {
    const rows = await getDatabase()
      .select({
        seq: history.seq,
        id: history.id,
        schemaVersion: history.schemaVersion,
        completedAt: history.completedAt,
        lessonId: history.lessonId,
        title: history.title,
        wpm: history.wpm,
        accuracy: history.accuracy,
        seconds: history.seconds,
        keystrokes: history.keystrokes,
      })
      .from(history)
      .where(and(eq(history.userId, userId), gt(history.seq, cursor)))
      .orderBy(asc(history.seq))
      .limit(limit);

    return rows satisfies Array<HistoryEntry & { seq: number }>;
  },
};
