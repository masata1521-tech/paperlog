import Link from "next/link";
import { FileText, CircleDot, ClipboardX, FlaskConical, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireCurrentUserId } from "@/lib/current-user";

export const dynamic = "force-dynamic";

function formatDate(date: Date | null): string {
  if (!date) return "";
  return date.toLocaleDateString("ja-JP", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export default async function DashboardPage() {
  const userId = await requireCurrentUserId();

  const [
    paperCount,
    unreadCount,
    unassignedCount,
    projectCount,
    projects,
    recentPapers,
    favoritePapers,
  ] = await Promise.all([
    prisma.paper.count({ where: { userId } }),
    prisma.paper.count({ where: { userId, isRead: false } }),
    prisma.paper.count({ where: { userId, researchProjects: { none: {} } } }),
    prisma.researchProject.count({ where: { userId } }),
    prisma.researchProject.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 3,
      include: { papers: { select: { relevanceRating: true } } },
    }),
    prisma.paper.findMany({
      where: { userId, lastViewedAt: { not: null } },
      orderBy: { lastViewedAt: "desc" },
      take: 3,
      select: { id: true, title: true, year: true, lastViewedAt: true },
    }),
    prisma.paper.findMany({
      where: { userId, isFavorite: true },
      orderBy: { updatedAt: "desc" },
      take: 3,
      select: { id: true, title: true },
    }),
  ]);

  const stats = [
    { label: "論文数", value: paperCount, icon: FileText, color: "text-indigo-600 bg-indigo-50" },
    { label: "未読", value: unreadCount, icon: CircleDot, color: "text-sky-600 bg-sky-50" },
    { label: "未登録", value: unassignedCount, icon: ClipboardX, color: "text-rose-600 bg-rose-50" },
    { label: "プロジェクト", value: projectCount, icon: FlaskConical, color: "text-emerald-600 bg-emerald-50" },
  ];

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-neutral-900">ホーム</h1>
      <p className="mt-1 text-sm text-neutral-500">
        未読論文が{unreadCount}件、プロジェクト未登録が{unassignedCount}件あります
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-neutral-200 bg-white p-4">
            <div className={`inline-flex rounded-lg p-2 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="mt-3 text-2xl font-bold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-700">研究プロジェクト</h2>
          <Link href="/projects" className="text-xs font-medium text-indigo-600 hover:underline">
            すべて見る →
          </Link>
        </div>
        {projects.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-400">まだ研究プロジェクトがありません。</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {projects.map((project) => {
              const rated = project.papers
                .map((p) => p.relevanceRating)
                .filter((r): r is number => r != null);
              const avgPercent =
                rated.length > 0
                  ? Math.round((rated.reduce((a, b) => a + b, 0) / rated.length / 5) * 100)
                  : null;
              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                >
                  <p className="line-clamp-1 text-sm font-bold text-neutral-900">{project.title}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                    <span>{project.papers.length}件の論文</span>
                    {avgPercent != null && (
                      <span className="font-semibold text-neutral-700">avg {avgPercent}%</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-700">最近見た論文</h2>
            <Link href="/recent" className="text-xs font-medium text-indigo-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          {recentPapers.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-400">まだ論文を見ていません。</p>
          ) : (
            <div className="mt-3 space-y-2">
              {recentPapers.map((paper) => (
                <Link
                  key={paper.id}
                  href={`/papers/${paper.id}`}
                  className="block rounded-lg border border-neutral-200 bg-white p-3 hover:bg-neutral-50"
                >
                  <p className="line-clamp-1 text-sm font-medium text-neutral-900">{paper.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {paper.year ?? ""} ・ {formatDate(paper.lastViewedAt)}に閲覧
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-700">お気に入り</h2>
            <Link href="/favorites" className="text-xs font-medium text-indigo-600 hover:underline">
              すべて見る →
            </Link>
          </div>
          {favoritePapers.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-400">お気に入りはまだありません。</p>
          ) : (
            <div className="mt-3 space-y-2">
              {favoritePapers.map((paper) => (
                <Link
                  key={paper.id}
                  href={`/papers/${paper.id}`}
                  className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3 hover:bg-neutral-50"
                >
                  <Star size={14} className="shrink-0 fill-amber-400 text-amber-400" />
                  <p className="line-clamp-1 text-sm font-medium text-neutral-900">{paper.title}</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
