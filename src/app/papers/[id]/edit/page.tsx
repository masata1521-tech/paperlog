import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PaperForm } from "@/components/papers/PaperForm";
import { requireCurrentUserId } from "@/lib/current-user";

export default async function EditPaperPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireCurrentUserId();
  const { id } = await params;
  const [paper, tags, projects] = await Promise.all([
    prisma.paper.findFirst({
      where: { id, userId },
      include: { tags: true, researchProjects: true },
    }),
    prisma.tag.findMany({ where: { userId }, orderBy: { name: "asc" } }),
    prisma.researchProject.findMany({ where: { userId }, orderBy: { title: "asc" } }),
  ]);

  if (!paper) notFound();

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8">
      <Link
        href={`/papers/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        <ArrowLeft size={16} />
        詳細に戻る
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900 dark:text-neutral-100">論文を編集</h1>

      <div className="mt-6">
        <PaperForm paper={paper} existingTags={tags.map((t) => t.name)} projects={projects} />
      </div>
    </div>
  );
}
