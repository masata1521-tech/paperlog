"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Tag,
  Star,
  Clock,
  Settings,
  LogOut,
} from "lucide-react";
import { logout } from "@/lib/auth-actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/papers", label: "論文", icon: BookOpen },
  { href: "/projects", label: "研究プロジェクト", icon: FlaskConical },
  { href: "/tags", label: "タグ", icon: Tag },
  { href: "/favorites", label: "お気に入り", icon: Star },
  { href: "/recent", label: "最近見た論文", icon: Clock },
  { href: "/settings", label: "設定", icon: Settings },
];

export function Sidebar({ userLabel }: { userLabel: string }) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <nav className="flex h-full w-60 flex-col gap-1 border-r border-neutral-200 bg-white p-3">
      <div className="mb-4 px-2 text-lg font-semibold text-neutral-900">
        PaperLog
      </div>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive =
          pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            ].join(" ")}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            {label}
          </Link>
        );
      })}

      <div className="mt-auto border-t border-neutral-100 pt-3">
        <p className="truncate px-2 text-xs text-neutral-400" title={userLabel}>
          {userLabel}
        </p>
        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(() => logout())}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50"
        >
          <LogOut size={18} />
          ログアウト
        </button>
      </div>
    </nav>
  );
}
