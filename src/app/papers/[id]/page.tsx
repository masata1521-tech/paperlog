import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { splitList } from "@/lib/paper-utils";
import { StarRating } from "@/components/papers/StarRating";
import { HighlightedResult } from "@/components/papers/HighlightedResult";
import { PaperDetailActions } from "@/components/papers/PaperDetailActions";
import { requireCurrentUserId } from "@/lib/current-user";

export default async function PaperDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireCurrentUserId();
  const { id } = await params;
  const paper = await prisma.paper.findFirst({
    where: { id, userId },
    include: { tags: true, researchProjects: true },
  });

  if (!paper) notFound();

  await prisma.paper.update({
    where: { id },
    data: { lastViewedAt: new Date() },
  });

  const outcomes = splitList(paper.outcomes);

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8">
      <Link
        href="/papers"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700"
      >
        <ArrowLeft size={16} />
        検索結果に戻る
      </Link>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-xl font-bold leading-snug text-neutral-900">{paper.title}</h1>
          {!paper.isRead && (
            <span className="mt-1 shrink-0 rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold text-sky-700">
              未読
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-neutral-500">
          {paper.authors}
          {paper.journal && <span> ・ {paper.journal}</span>}
          {paper.year && <span> ・ {paper.year}</span>}
        </p>
        {paper.doi && (
          <p className="mt-1 text-sm text-neutral-400">
            DOI:{" "}
            <a
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-indigo-500 hover:underline"
            >
              {paper.doi}
              <ExternalLink size={12} />
            </a>
          </p>
        )}

        <div className="mt-4">
          <PaperDetailActions id={paper.id} isFavorite={paper.isFavorite} isRead={paper.isRead} />
        </div>

        <div className="mt-6 space-y-5">
          <section>
            <div className="mb-1 flex items-center gap-1.5">
              <h2 className="text-sm font-semibold text-neutral-500">研究概要</h2>
              {paper.isAiSummary && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-50 px-1.5 py-0.5 text-[10px] font-medium text-violet-600">
                  <Sparkles size={10} />
                  AI要約
                </span>
              )}
            </div>
            <p className="text-sm text-neutral-700">{paper.summary ?? "未入力"}</p>
          </section>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <section>
              <h2 className="text-sm font-semibold text-neutral-500">対象</h2>
              <p className="mt-1 whitespace-pre-line text-sm text-neutral-700">
                {paper.subjects ?? "未入力"}
              </p>
            </section>
            <section>
              <h2 className="text-sm font-semibold text-neutral-500">方法</h2>
              <div className="mt-1">
                {paper.studyDesign ? (
                  <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-700">
                    {paper.studyDesign}
                  </span>
                ) : (
                  <span className="text-sm text-neutral-400">未入力</span>
                )}
              </div>
            </section>
          </div>

          {outcomes.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-neutral-500">評価項目</h2>
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

          <section className="rounded-lg bg-neutral-50 p-4">
            <h2 className="text-sm font-semibold text-neutral-500">主な結果</h2>
            <div className="mt-1">
              <HighlightedResult text={paper.mainResults} />
            </div>
          </section>

          <section className="border-t border-neutral-100 pt-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-neutral-500">研究との関連</h2>
                <div className="mt-1">
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
              <p className="mt-2 text-sm text-neutral-600">「{paper.relevanceNote}」</p>
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

          {paper.researchProjects.length > 0 && (
            <section>
              <h2 className="text-sm font-semibold text-neutral-500">研究プロジェクト</h2>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {paper.researchProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200"
                  >
                    {project.title}
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
