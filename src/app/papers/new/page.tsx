import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PaperForm } from "@/components/papers/PaperForm";
import { requireCurrentUserId } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function NewPaperPage() {
  const userId = await requireCurrentUserId();
  const [tags, projects] = await Promise.all([
    prisma.tag.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.researchProject.findMany({ where: { userId }, orderBy: { title: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-3xl p-8">
      <Link
        href="/papers"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700"
      >
        <ArrowLeft size={16} />
        検索結果に戻る
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900">論文を登録</h1>
      <p className="mt-1 text-sm text-neutral-500">
        タイトルと著者以外は空欄でも登録できます。あとから追記・修正してください。
      </p>

      <div className="mt-6">
        <PaperForm existingTags={tags.map((t) => t.name)} projects={projects} />
      </div>
    </div>
  );
}
