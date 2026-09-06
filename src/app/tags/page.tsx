import Link from "next/link";
import { Tag as TagIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireCurrentUserId } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const userId = await requireCurrentUserId();
  const tags = await prisma.tag.findMany({
    where: { userId },
    include: { _count: { select: { papers: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-neutral-900">タグ</h1>
      <p className="mt-1 text-sm text-neutral-500">
        タグをクリックすると、そのタグが付いた論文を検索結果で絞り込めます。
      </p>

      {tags.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
          まだタグがありません。論文を登録・編集するときにタグを追加できます。
        </div>
      ) : (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/papers?tag=${encodeURIComponent(tag.name)}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-700 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
            >
              <TagIcon size={14} />
              {tag.name}
              <span className="text-xs text-neutral-400">{tag._count.papers}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
