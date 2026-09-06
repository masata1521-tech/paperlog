"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";

const NO_SIDEBAR_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];

export function AppShell({
  userLabel,
  children,
}: {
  userLabel: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (!userLabel || NO_SIDEBAR_PATHS.includes(pathname)) {
    return <main className="flex-1 overflow-y-auto">{children}</main>;
  }

  return (
    <>
      <Sidebar userLabel={userLabel} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </>
  );
}
