"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  FlaskConical,
  Tag,
  Star,
  Clock,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { logout } from "@/lib/auth-actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "ホーム", icon: Home },
  { href: "/papers", label: "論文", icon: BookOpen },
  { href: "/projects", label: "研究プロジェクト", icon: FlaskConical },
  { href: "/tags", label: "タグ", icon: Tag },
  { href: "/favorites", label: "お気に入り", icon: Star },
  { href: "/recent", label: "最近見た論文", icon: Clock },
  { href: "/settings", label: "設定", icon: Settings },
];

export function Sidebar({
  userLabel,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: {
  userLabel: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <nav
      className={`flex h-full flex-col gap-1 border-r border-neutral-200 bg-white p-3 transition-[width] duration-150 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="mb-4 flex items-center justify-between px-1">
        {!collapsed && (
          <Link
            href="/dashboard"
            onClick={onNavigate}
            className="text-lg font-semibold text-neutral-900 hover:text-neutral-700"
          >
            PaperLog
          </Link>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="rounded-md p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            aria-label={collapsed ? "サイドバーを開く" : "サイドバーを閉じる"}
          >
            {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
          </button>
        )}
      </div>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              collapsed ? "justify-center" : "",
              isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
            ].join(" ")}
          >
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
            {!collapsed && label}
          </Link>
        );
      })}

      <div className="mt-auto border-t border-neutral-100 pt-3">
        {!collapsed && (
          <p className="truncate px-2 text-xs text-neutral-400" title={userLabel}>
            {userLabel}
          </p>
        )}
        <button
          type="button"
          disabled={isPending}
          title={collapsed ? "ログアウト" : undefined}
          onClick={() => startTransition(() => logout())}
          className={`mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 disabled:opacity-50 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={18} className="shrink-0" />
          {!collapsed && "ログアウト"}
        </button>
      </div>
    </nav>
  );
}
