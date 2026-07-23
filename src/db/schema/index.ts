import { authSchema } from "./auth";
import { historySchema } from "./history";

export * from "./auth";
export * from "./history";

/** Every table, for the Drizzle query client. */
export const schema = { ...authSchema, ...historySchema };
