"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Sidebar } from "./Sidebar";

const NO_SIDEBAR_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];
const COLLAPSE_STORAGE_KEY = "paperlog:sidebarCollapsed";

export function AppShell({
  userLabel,
  children,
}: {
  userLabel: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(COLLAPSE_STORAGE_KEY) === "1");
    } catch {
      // localStorage unavailable; keep default
    }
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_STORAGE_KEY, next ? "1" : "0");
      } catch {
        // localStorage unavailable; selection won't persist across reloads
      }
      return next;
    });
  };

  if (!userLabel || NO_SIDEBAR_PATHS.includes(pathname)) {
    return <main className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">{children}</main>;
  }

  return (
    <>
      <div className="hidden md:block">
        <Sidebar userLabel={userLabel} collapsed={collapsed} onToggleCollapse={toggleCollapsed} />
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-y-0 left-0 shadow-xl">
            <Sidebar userLabel={userLabel} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 pb-3 pt-[calc(env(safe-area-inset-top)+2.5rem)] md:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="rounded-md p-1.5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            aria-label="メニューを開く"
          >
            <Menu size={20} />
          </button>
          <Link href="/dashboard" className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
            PaperLog
          </Link>
        </header>
        <main className="flex-1 overflow-y-auto pb-[env(safe-area-inset-bottom)]">{children}</main>
      </div>
    </>
  );
}
