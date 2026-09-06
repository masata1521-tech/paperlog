"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutGrid, Rows3, Columns3 } from "lucide-react";
import type { Paper } from "@/types/paper";
import { PaperCard } from "./PaperCard";
import { PaperTable } from "./PaperTable";
import { CompareView } from "./CompareView";
import { DEFAULT_VIEW_STORAGE_KEY } from "@/components/settings/DefaultViewSetting";

type ViewMode = "card" | "list" | "compare";

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: typeof LayoutGrid }[] = [
  { mode: "card", label: "カード表示", icon: LayoutGrid },
  { mode: "list", label: "一覧表示", icon: Rows3 },
  { mode: "compare", label: "比較表示", icon: Columns3 },
];

export function ResultsView({ papers }: { papers: Paper[] }) {
  const [view, setView] = useState<ViewMode>("card");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem(DEFAULT_VIEW_STORAGE_KEY);
      if (stored === "card" || stored === "list") setView(stored);
    } catch {
      // localStorage unavailable; keep default view
    }
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectedPapers = useMemo(
    () => papers.filter((p) => selectedIds.has(p.id)),
    [papers, selectedIds]
  );

  return (
    <div>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-500">
          {papers.length}件の論文
          {selectedIds.size > 0 && (
            <span className="ml-2 text-indigo-600">・{selectedIds.size}件選択中</span>
          )}
        </p>
        <div className="grid grid-cols-3 rounded-lg border border-neutral-200 bg-white p-1 sm:flex sm:items-center">
          {VIEW_OPTIONS.map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              className={`inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-colors sm:px-3 ${
                view === mode
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {papers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
          条件に一致する論文が見つかりませんでした。検索条件を変えてお試しください。
        </div>
      ) : view === "card" ? (
        <div className="space-y-4">
          {papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              selected={selectedIds.has(paper.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      ) : view === "list" ? (
        <PaperTable papers={papers} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
      ) : (
        <CompareView papers={selectedPapers} />
      )}
    </div>
  );
}
