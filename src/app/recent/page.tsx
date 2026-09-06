import { prisma } from "@/lib/prisma";
import { ResultsView } from "@/components/papers/ResultsView";
import { requireCurrentUserId } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function RecentPage() {
  const userId = await requireCurrentUserId();
  const papers = await prisma.paper.findMany({
    where: { userId, lastViewedAt: { not: null } },
    include: { tags: true, researchProjects: true },
    orderBy: { lastViewedAt: "desc" },
    take: 20,
  });

  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="text-2xl font-bold text-neutral-900">最近見た論文</h1>
      <p className="mt-1 text-sm text-neutral-500">
        直近で詳細を開いた論文を新しい順に表示しています。
      </p>

      <div className="mt-8">
        <ResultsView papers={papers} />
      </div>
    </div>
  );
}
