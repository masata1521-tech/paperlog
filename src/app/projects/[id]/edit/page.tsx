import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProjectForm } from "@/components/projects/ProjectForm";
import { requireCurrentUserId } from "@/lib/current-user";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireCurrentUserId();
  const { id } = await params;
  const project = await prisma.researchProject.findFirst({ where: { id, userId } });

  if (!project) notFound();

  return (
    <div className="mx-auto max-w-2xl p-8">
      <Link
        href={`/projects/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700"
      >
        <ArrowLeft size={16} />
        プロジェクトに戻る
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900">プロジェクトを編集</h1>

      <div className="mt-6">
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
