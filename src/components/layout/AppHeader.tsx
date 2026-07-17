"use client";

import { cva } from "class-variance-authority";
import { Maximize2, Menu, Minimize2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { TweaksPanel } from "./TweaksPanel";

const ITEMS = [
  { href: "/", label: "Home" },
  { href: "/lessons", label: "Lessons" },
  { href: "/free", label: "Free type" },
  { href: "/guide", label: "Guide" },
  { href: "/history", label: "History" },
  { href: "/about", label: "About" },
] as const;

const navItem = cva(
  "mt-action min-h-10 px-3 inline-flex items-center justify-center text-xs tracking-widest uppercase border",
  {
    variants: {
      active: {
        true: "bg-accent text-accent-ink border-accent",
        false: "mt-action-outline border-border-soft text-ink-soft",
      },
      desktop: {
        true: "sm:min-h-8 py-1.5",
        false: "",
      },
    },
  },
);

export function AppHeader() {
  const pathname = usePathname();
  const compact = pathname.startsWith("/practice");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const syncFullscreenState = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener("fullscreenchange", syncFullscreenState);
    return () =>
      document.removeEventListener("fullscreenchange", syncFullscreenState);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen();
    }
  };

  return (
    <header
      className={cn(
        "flex flex-wrap gap-y-2 justify-between items-center border-b border-dashed border-border-soft",
        compact ? "mb-3 pb-2" : "mb-5 pb-3",
      )}
    >
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/myantyper.png"
          alt="MyanTyper"
          width={36}
          height={36}
          priority
          className="w-9 h-9 object-contain"
        />
        <div className="mt-display text-xl text-ink">MyanTyper</div>
      </Link>
      <nav className="hidden sm:flex flex-wrap gap-1">
        {ITEMS.map((it) => {
          const active =
            it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
          return (
            <Link
              key={it.href}
              href={it.href}
              className={navItem({ active, desktop: true })}
            >
              {it.label}
            </Link>
          );
        })}
        <FullscreenButton
          isFullscreen={isFullscreen}
          onClick={toggleFullscreen}
        />
        <TweaksPanel />
      </nav>
      <div className="flex sm:hidden gap-1">
        <FullscreenButton
          isFullscreen={isFullscreen}
          onClick={toggleFullscreen}
        />
        <TweaksPanel />
        <button
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          className="mt-action mt-action-outline w-10 h-10 flex items-center justify-center border border-border-soft text-ink-soft"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {mobileMenuOpen && (
        <nav className="basis-full grid grid-cols-2 gap-1 pt-2 sm:hidden">
          {ITEMS.map((it) => {
            const active =
              it.href === "/" ? pathname === "/" : pathname.startsWith(it.href);
            return (
              <Link
                key={it.href}
                href={it.href}
                onClick={() => setMobileMenuOpen(false)}
                className={navItem({ active, desktop: false })}
              >
                {it.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

function FullscreenButton({
  isFullscreen,
  onClick,
}: {
  isFullscreen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-action mt-action-outline w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center border border-border-soft text-ink-soft"
      aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
      title={isFullscreen ? "Exit full screen" : "Full screen"}
    >
      {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
    </button>
  );
}
