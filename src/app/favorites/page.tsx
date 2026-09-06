import { prisma } from "@/lib/prisma";
import { ResultsView } from "@/components/papers/ResultsView";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const papers = await prisma.paper.findMany({
    where: { isFavorite: true },
    include: { tags: true, researchProjects: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-6xl p-8">
      <h1 className="text-2xl font-bold text-neutral-900">お気に入り</h1>
      <p className="mt-1 text-sm text-neutral-500">
        お気に入り登録した論文だけを表示しています。
      </p>

      <div className="mt-8">
        <ResultsView papers={papers} />
      </div>
    </div>
  );
}
