"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface HeaderPopoverState {
  open: boolean;
  toggle: () => void;
  close: () => void;
  panelId: string;
}

interface HeaderPopoverProps {
  trigger: (state: HeaderPopoverState) => ReactNode;
  children: ReactNode | ((state: HeaderPopoverState) => ReactNode);
  panelClassName?: string;
}

/**
 * Shared shell for header dropdowns: one surface, position, and dismissal
 * (outside-click, Escape, route change) so every header menu behaves alike.
 * The trigger links to the panel with `aria-controls`/`aria-expanded`.
 */
export function HeaderPopover({
  trigger,
  children,
  panelClassName,
}: HeaderPopoverProps) {
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // pathname intentionally closes an open popover after navigation.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see above
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  const state: HeaderPopoverState = {
    open,
    toggle: () => setOpen((current) => !current),
    close: () => setOpen(false),
    panelId,
  };

  return (
    <div ref={root} className="relative">
      {trigger(state)}
      {open && (
        <div
          id={panelId}
          className={cn(
            "absolute right-0 top-full z-50 mt-2 w-[min(300px,calc(100vw-2rem))] border border-border-soft bg-bg p-4 text-left shadow-[0_12px_32px_rgba(0,0,0,0.28)]",
            panelClassName,
          )}
        >
          {typeof children === "function" ? children(state) : children}
        </div>
      )}
    </div>
  );
}
