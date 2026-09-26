// biome-ignore lint/style/noRestrictedImports: this is the sanctioned wrapper.
import Link from "next/link";
import type { ComponentProps } from "react";

// Viewport prefetching fetched every visible route, several segment requests
// each, and dominated Vercel edge requests. Pages are static on the CDN, so
// fetching on click costs little latency.
export function AppLink(props: Omit<ComponentProps<typeof Link>, "prefetch">) {
  return <Link {...props} prefetch={false} />;
}
