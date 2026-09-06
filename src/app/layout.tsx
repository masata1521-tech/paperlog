import type { Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { getCurrentUserId } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();
  const user = userId
    ? await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } })
    : null;
  const userLabel = user ? user.name ?? user.email : null;

  return (
    <html lang="ja">
      <body className="flex h-screen overflow-hidden bg-neutral-50">
        <AppShell userLabel={userLabel}>{children}</AppShell>
      </body>
    </html>
  );
}
