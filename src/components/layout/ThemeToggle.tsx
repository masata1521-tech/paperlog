"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "paperlog:theme";

function isDarkFor(theme: Theme) {
  if (theme === "dark") return true;
  if (theme === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", isDarkFor(theme));
}

const OPTIONS: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "ライト" },
  { value: "dark", icon: Moon, label: "ダーク" },
  { value: "system", icon: Monitor, label: "システム" },
];

export function ThemeToggle({ collapsed = false }: { collapsed?: boolean }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let stored: Theme = "system";
    try {
      stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    } catch {
      // localStorage unavailable; keep default
    }
    setTheme(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
    if (theme === "system") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const listener = () => applyTheme("system");
      mql.addEventListener("change", listener);
      return () => mql.removeEventListener("change", listener);
    }
  }, [theme, mounted]);

  const handleChange = (next: Theme) => {
    setTheme(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable; selection won't persist across reloads
    }
  };

  if (!mounted) {
    return <div className={collapsed ? "h-8 w-8" : "h-8 w-full"} aria-hidden="true" />;
  }

  if (collapsed) {
    const order: Theme[] = ["light", "dark", "system"];
    const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];
    const Icon = current.icon;
    return (
      <button
        type="button"
        onClick={() => handleChange(order[(order.indexOf(theme) + 1) % order.length])}
        title={`表示: ${current.label}(クリックで切り替え)`}
        aria-label="表示テーマを切り替え"
        className="flex w-full items-center justify-center rounded-md p-1.5 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <Icon size={16} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 p-1">
      {OPTIONS.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => handleChange(value)}
          title={label}
          aria-label={label}
          className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
            theme === value
              ? "bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-sm"
              : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300"
          }`}
        >
          <Icon size={13} />
        </button>
      ))}
    </div>
  );
}
