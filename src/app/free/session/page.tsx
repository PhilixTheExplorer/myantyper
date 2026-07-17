import type { Metadata } from "next";
import { FreeTypeSession } from "@/components/free/FreeTypeSession";

export const metadata: Metadata = {
  title: "Free type session",
  robots: { index: false, follow: false },
};

export default function FreeTypeSessionPage() {
  return (
    <main className="flex min-h-0 flex-1 flex-col">
      <FreeTypeSession />
    </main>
  );
}
