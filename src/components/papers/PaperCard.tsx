"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Star, Sparkles, ExternalLink } from "lucide-react";
import type { Paper } from "@/types/paper";
import { splitList } from "@/lib/paper-utils";
import { StarRating } from "./StarRating";
import { HighlightedResult } from "./HighlightedResult";
import { toggleFavorite } from "@/app/papers/actions";

export function PaperCard({
  paper,
  selected,
  onToggleSelect,
}: {
  paper: Paper;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const outcomes = splitList(paper.outcomes);

  return (
    <div
      className={`relative rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5 ${
        selected ? "border-indigo-400 ring-1 ring-indigo-300" : "border-neutral-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(paper.id)}
          className="mt-1.5 size-4 shrink-0 rounded border-neutral-300 accent-indigo-600"
          aria-label="比較用に選択"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-2 text-base font-bold leading-snug text-neutral-900">
              {paper.title}
            </h3>
            {!paper.isRead && (
              <span className="mt-0.5 shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                未読
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            {paper.authors}
            {paper.journal && <span> ・ {paper.journal}</span>}
            {paper.year && <span> ・ {paper.year}</span>}
            {paper.doi && <span className="text-neutral-400"> ・ DOI: {paper.doi}</span>}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3 pl-0 sm:pl-7">
        <section>
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-xs font-semibold text-neutral-500">【研究概要】</span>
            {paper.isAiSummary && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">
                <Sparkles size={10} />
                AI要約
              </span>
            )}
          </div>
          <p className="line-clamp-3 text-sm text-neutral-700">{paper.summary ?? "—"}</p>
        </section>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <section>
            <span className="text-xs font-semibold text-neutral-500">【対象】</span>
            <p className="mt-0.5 whitespace-pre-line text-sm text-neutral-700">
              {paper.subjects ?? "—"}
            </p>
          </section>
          <section>
            <span className="text-xs font-semibold text-neutral-500">【方法】</span>
            <div className="mt-1">
              {paper.studyDesign ? (
                <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                  {paper.studyDesign}
                </span>
              ) : (
                <span className="text-sm text-neutral-400">—</span>
              )}
            </div>
          </section>
        </div>

        {outcomes.length > 0 && (
          <section>
            <span className="text-xs font-semibold text-neutral-500">【評価項目】</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {outcomes.map((item) => (
                <code
                  key={item}
                  className="rounded bg-emerald-50 px-2 py-0.5 font-mono text-xs text-emerald-700"
                >
                  {item}
                </code>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-lg bg-neutral-50 p-3">
          <span className="text-xs font-semibold text-neutral-500">【主な結果】</span>
          <div className="mt-1">
            <HighlightedResult text={paper.mainResults} />
          </div>
        </section>

        <section className="border-t border-neutral-100 pt-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold text-neutral-500">【研究との関連】</span>
              <div className="mt-0.5">
                <StarRating rating={paper.relevanceRating} />
              </div>
            </div>
            {paper.usageLabels.length > 0 && (
              <div className="flex flex-wrap gap-1 sm:justify-end">
                {paper.usageLabels.map((label) => (
                  <span
                    key={label}
                    className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>
          {paper.relevanceNote && (
            <p className="mt-1.5 text-sm text-neutral-600">「{paper.relevanceNote}」</p>
          )}
        </section>

        {paper.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {paper.tags.map((tag) => (
              <span key={tag.id} className="text-xs font-medium text-indigo-500">
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-1">
          <Link
            href={`/papers/${paper.id}`}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
          >
            詳細を見る
            <ExternalLink size={14} />
          </Link>
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => toggleFavorite(paper.id))}
            className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
              paper.isFavorite
                ? "border-amber-300 bg-amber-50 text-amber-700"
                : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
            }`}
          >
            <Star size={14} className={paper.isFavorite ? "fill-amber-500 text-amber-500" : ""} />
            お気に入り
          </button>
        </div>
      </div>
    </div>
  );
}
