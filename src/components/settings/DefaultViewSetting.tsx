"use client";

import { useEffect, useState } from "react";

const OPTIONS = [
  { value: "card", label: "カード表示" },
  { value: "list", label: "一覧表示" },
] as const;

export const DEFAULT_VIEW_STORAGE_KEY = "paperlog:defaultView";

export function DefaultViewSetting() {
  const [value, setValue] = useState<string>("card");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEFAULT_VIEW_STORAGE_KEY);
      if (stored) setValue(stored);
    } catch {
      // localStorage unavailable; keep default
    }
  }, []);

  const handleChange = (next: string) => {
    setValue(next);
    setSaved(false);
    try {
      localStorage.setItem(DEFAULT_VIEW_STORAGE_KEY, next);
      setSaved(true);
    } catch {
      // localStorage unavailable; selection won't persist across reloads
    }
  };

  return (
    <div>
      <div className="flex gap-3">
        {OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-1.5 text-sm text-neutral-700">
            <input
              type="radio"
              name="defaultView"
              value={opt.value}
              checked={value === opt.value}
              onChange={() => handleChange(opt.value)}
              className="accent-indigo-600"
            />
            {opt.label}
          </label>
        ))}
      </div>
      {saved && <p className="mt-1.5 text-xs text-emerald-600">保存しました</p>}
    </div>
  );
}
