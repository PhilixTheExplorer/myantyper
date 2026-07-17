"use client";

import { usePathname } from "next/navigation";

const IMMERSIVE = ["/practice"];

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (IMMERSIVE.some((prefix) => pathname.startsWith(prefix))) return null;
  return <>{children}</>;
}
