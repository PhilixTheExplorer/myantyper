import {
  bigint,
  doublePrecision,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * Server mirror of a client `HistoryEntry`, scoped to its owner. Rows are
 * append-only and immutable, so `(userId, id)` makes uploads idempotent and
 * merging two devices a union by id.
 */
export const history = pgTable(
  "history",
  {
    /** Global monotonic sequence, used as the client pull cursor. */
    seq: bigint("seq", { mode: "number" })
      .generatedAlwaysAsIdentity()
      .notNull()
      .unique(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    /** Client-generated entry id, unique per user. */
    id: text("id").notNull(),
    schemaVersion: integer("schema_version").notNull(),
    completedAt: bigint("completed_at", { mode: "number" }).notNull(),
    lessonId: text("lesson_id").notNull(),
    title: text("title").notNull(),
    wpm: doublePrecision("wpm").notNull(),
    accuracy: doublePrecision("accuracy").notNull(),
    seconds: doublePrecision("seconds").notNull(),
    keystrokes: integer("keystrokes").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.id] }),
    index("history_user_id_seq_idx").on(table.userId, table.seq),
    index("history_user_id_completed_at_idx").on(
      table.userId,
      table.completedAt,
    ),
  ],
);

export const historySchema = { history };
