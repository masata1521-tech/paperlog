"use client";

import Link from "next/link";
import type { Paper } from "@/types/paper";
import { splitList } from "@/lib/paper-utils";
import { StarRating } from "./StarRating";

export function PaperTable({
  papers,
  selectedIds,
  onToggleSelect,
}: {
  papers: Paper[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-500">
            <th className="w-10 px-3 py-2"></th>
            <th className="px-3 py-2">論文</th>
            <th className="px-3 py-2">年</th>
            <th className="px-3 py-2">対象</th>
            <th className="px-3 py-2">方法</th>
            <th className="px-3 py-2">評価項目</th>
            <th className="px-3 py-2">主な結果</th>
            <th className="px-3 py-2">関連度</th>
          </tr>
        </thead>
        <tbody>
          {papers.map((paper) => (
            <tr key={paper.id} className="border-b border-neutral-100 align-top last:border-0 hover:bg-neutral-50">
              <td className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.has(paper.id)}
                  onChange={() => onToggleSelect(paper.id)}
                  className="size-4 rounded border-neutral-300 accent-indigo-600"
                  aria-label="比較用に選択"
                />
              </td>
              <td className="max-w-xs px-3 py-3">
                <Link
                  href={`/papers/${paper.id}`}
                  className="line-clamp-2 font-semibold text-neutral-900 hover:text-indigo-600 hover:underline"
                >
                  {paper.title}
                </Link>
                <p className="mt-0.5 text-xs text-neutral-500">{paper.authors}</p>
              </td>
              <td className="px-3 py-3 text-neutral-600">{paper.year ?? "—"}</td>
              <td className="max-w-[160px] px-3 py-3 text-neutral-600">
                <p className="line-clamp-2">{paper.subjects ?? "—"}</p>
              </td>
              <td className="px-3 py-3">
                {paper.studyDesign ? (
                  <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                    {paper.studyDesign}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td className="max-w-[180px] px-3 py-3">
                <div className="flex flex-wrap gap-1">
                  {splitList(paper.outcomes).map((item) => (
                    <code
                      key={item}
                      className="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700"
                    >
                      {item}
                    </code>
                  ))}
                </div>
              </td>
              <td className="max-w-xs px-3 py-3">
                <p className="line-clamp-2 text-neutral-600">{paper.mainResults ?? "—"}</p>
              </td>
              <td className="px-3 py-3">
                <StarRating rating={paper.relevanceRating} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
