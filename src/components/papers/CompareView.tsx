"use client";

import type { Paper } from "@/types/paper";
import { splitList } from "@/lib/paper-utils";
import { StarRating } from "./StarRating";
import { HighlightedResult } from "./HighlightedResult";

const ROWS: { label: string; render: (p: Paper) => React.ReactNode }[] = [
  {
    label: "書誌情報",
    render: (p) => (
      <div className="text-neutral-600 dark:text-neutral-400">
        <p>{p.authors}</p>
        <p>
          {p.journal ?? "—"} {p.year ?? ""}
        </p>
      </div>
    ),
  },
  { label: "研究概要", render: (p) => <p className="text-neutral-700 dark:text-neutral-300">{p.summary ?? "—"}</p> },
  {
    label: "対象",
    render: (p) => <p className="whitespace-pre-line text-neutral-700 dark:text-neutral-300">{p.subjects ?? "—"}</p>,
  },
  {
    label: "方法",
    render: (p) =>
      p.studyDesign ? (
        <span className="inline-block rounded-md bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:text-neutral-300">
          {p.studyDesign}
        </span>
      ) : (
        "—"
      ),
  },
  {
    label: "評価項目",
    render: (p) => (
      <div className="flex flex-wrap gap-1">
        {splitList(p.outcomes).map((item) => (
          <code key={item} className="rounded bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
            {item}
          </code>
        ))}
      </div>
    ),
  },
  { label: "主な結果", render: (p) => <HighlightedResult text={p.mainResults} /> },
  {
    label: "研究との関連",
    render: (p) => (
      <div>
        <StarRating rating={p.relevanceRating} />
        {p.relevanceNote && <p className="mt-1 text-neutral-600 dark:text-neutral-400">「{p.relevanceNote}」</p>}
      </div>
    ),
  },
];

export function CompareView({ papers }: { papers: Paper[] }) {
  if (papers.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-10 text-center text-sm text-neutral-500 dark:text-neutral-400">
        比較する論文をカード表示・一覧表示のチェックボックスで選択してください。
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <table className="w-full table-fixed border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            <th className="w-32 px-3 py-2 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              項目
            </th>
            {papers.map((p) => (
              <th key={p.id} className="min-w-[240px] px-3 py-2 text-left align-top">
                <p className="line-clamp-2 text-sm font-bold text-neutral-900 dark:text-neutral-100">{p.title}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="border-b border-neutral-100 dark:border-neutral-800 align-top last:border-0">
              <td className="px-3 py-3 text-xs font-semibold text-neutral-500 dark:text-neutral-400">{row.label}</td>
              {papers.map((p) => (
                <td key={p.id} className="px-3 py-3 text-sm">
                  {row.render(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
