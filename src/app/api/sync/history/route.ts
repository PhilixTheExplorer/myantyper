import { createHistorySyncHandlers } from "@/lib/sync/historyApi";
import {
  authenticatedHistoryUserId,
  databaseHistorySyncRepository,
} from "@/lib/sync/historyServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handlers = createHistorySyncHandlers({
  authenticatedUserId: authenticatedHistoryUserId,
  repository: databaseHistorySyncRepository,
  reportError(operation, error) {
    const errorName = error instanceof Error ? error.name : "UnknownError";
    console.error(`History sync ${operation} failed (${errorName}).`);
  },
});

export const GET = handlers.GET;
export const POST = handlers.POST;
