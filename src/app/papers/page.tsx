import Link from "next/link";
import { Search, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { ResultsView } from "@/components/papers/ResultsView";
import { requireCurrentUserId } from "@/lib/current-user";

type SearchParams = Record<string, string | string[] | undefined>;

function toStr(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export default async function PapersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const userId = await requireCurrentUserId();
  const params = await searchParams;
  const q = toStr(params.q);
  const year = toStr(params.year);
  const design = toStr(params.design);
  const journal = toStr(params.journal);
  const keyword = toStr(params.keyword);
  const relevance = toStr(params.relevance);
  const readStatus = toStr(params.read);
  const project = toStr(params.project);
  const tag = toStr(params.tag);
  const favorite = toStr(params.favorite);

  const conditions: Prisma.PaperWhereInput[] = [];
  if (q) {
    conditions.push({
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { authors: { contains: q, mode: "insensitive" } },
        { doi: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  if (year) conditions.push({ year: Number(year) });
  if (design) conditions.push({ studyDesign: design });
  if (journal) conditions.push({ journal });
  if (keyword) {
    conditions.push({
      OR: [
        { outcomes: { contains: keyword, mode: "insensitive" } },
        { subjects: { contains: keyword, mode: "insensitive" } },
        { summary: { contains: keyword, mode: "insensitive" } },
        { tags: { some: { name: { contains: keyword, mode: "insensitive" } } } },
      ],
    });
  }
  if (relevance) conditions.push({ relevanceRating: { gte: Number(relevance) } });
  if (readStatus === "unread") conditions.push({ isRead: false });
  if (readStatus === "read") conditions.push({ isRead: true });
  if (project) conditions.push({ researchProjects: { some: { id: project } } });
  if (tag) conditions.push({ tags: { some: { name: tag } } });
  if (favorite === "1") conditions.push({ isFavorite: true });

  const [papers, yearRows, designRows, journalRows, projects] = await Promise.all([
    prisma.paper.findMany({
      where: { userId, AND: conditions },
      include: { tags: true, researchProjects: true },
      orderBy: [{ relevanceRating: "desc" }, { createdAt: "desc" }],
    }),
    prisma.paper.findMany({
      where: { userId, year: { not: null } },
      distinct: ["year"],
      select: { year: true },
      orderBy: { year: "desc" },
    }),
    prisma.paper.findMany({
      where: { userId, studyDesign: { not: null } },
      distinct: ["studyDesign"],
      select: { studyDesign: true },
    }),
    prisma.paper.findMany({
      where: { userId, journal: { not: null } },
      distinct: ["journal"],
      select: { journal: true },
    }),
    prisma.researchProject.findMany({ where: { userId }, orderBy: { title: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">論文検索</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            論文を開かなくても、目的・対象・方法・結果を一覧で比較できます。
          </p>
        </div>
        <Link
          href="/papers/new"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 dark:text-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200"
        >
          <Plus size={16} />
          論文を登録
        </Link>
      </div>

      {(tag || favorite === "1") && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-indigo-50 dark:bg-indigo-950 px-3 py-2 text-sm text-indigo-700 dark:text-indigo-300">
          <span>
            {tag && `タグ「${tag}」で絞り込み中`}
            {favorite === "1" && "お気に入りのみ表示中"}
          </span>
          <Link href="/papers" className="ml-auto text-xs font-medium underline">
            解除
          </Link>
        </div>
      )}

      <form method="GET" className="mt-6 space-y-3">
        {tag && <input type="hidden" name="tag" value={tag} />}
        {favorite === "1" && <input type="hidden" name="favorite" value="1" />}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" size={20} />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="タイトル・キーワード・著者・DOI・研究テーマを検索"
            className="w-full rounded-xl border border-neutral-300 dark:border-neutral-700 py-3.5 pl-12 pr-4 text-base shadow-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            name="year"
            defaultValue={year}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <option value="">発表年: すべて</option>
            {yearRows.map(
              (row) =>
                row.year != null && (
                  <option key={row.year} value={row.year}>
                    {row.year}年
                  </option>
                )
            )}
          </select>

          <select
            name="design"
            defaultValue={design}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <option value="">研究デザイン: すべて</option>
            {designRows.map(
              (row) =>
                row.studyDesign && (
                  <option key={row.studyDesign} value={row.studyDesign}>
                    {row.studyDesign}
                  </option>
                )
            )}
          </select>

          <select
            name="journal"
            defaultValue={journal}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <option value="">ジャーナル: すべて</option>
            {journalRows.map(
              (row) =>
                row.journal && (
                  <option key={row.journal} value={row.journal}>
                    {row.journal}
                  </option>
                )
            )}
          </select>

          <input
            type="text"
            name="keyword"
            defaultValue={keyword}
            placeholder="評価項目・対象・キーワード"
            className="w-48 rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
          />

          <select
            name="relevance"
            defaultValue={relevance}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <option value="">重要度: すべて</option>
            <option value="5">★5のみ</option>
            <option value="4">★4以上</option>
            <option value="3">★3以上</option>
            <option value="2">★2以上</option>
            <option value="1">★1以上</option>
          </select>

          <select
            name="read"
            defaultValue={readStatus}
            className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
          >
            <option value="">未読/既読: すべて</option>
            <option value="unread">未読のみ</option>
            <option value="read">既読のみ</option>
          </select>

          {projects.length > 0 && (
            <select
              name="project"
              defaultValue={project}
              className="rounded-md border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-sm text-neutral-700 dark:text-neutral-300"
            >
              <option value="">研究プロジェクト: すべて</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            className="ml-auto rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 dark:text-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            絞り込む
          </button>
        </div>
      </form>

      <div className="mt-8">
        <ResultsView papers={papers} />
      </div>
    </div>
  );
}
