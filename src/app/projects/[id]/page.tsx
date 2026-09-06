import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, X } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { addPaperToProject, removePaperFromProject } from "@/app/projects/actions";
import { ProjectDangerActions } from "@/components/projects/ProjectDangerActions";
import { StarRating } from "@/components/papers/StarRating";
import { requireCurrentUserId } from "@/lib/current-user";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const userId = await requireCurrentUserId();
  const { id } = await params;
  const project = await prisma.researchProject.findFirst({
    where: { id, userId },
    include: { papers: { orderBy: { createdAt: "desc" } } },
  });

  if (!project) notFound();

  const availablePapers = await prisma.paper.findMany({
    where: { userId, researchProjects: { none: { id } } },
    orderBy: { title: "asc" },
    select: { id: true, title: true },
  });

  return (
    <div className="mx-auto max-w-3xl p-4 sm:p-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700"
      >
        <ArrowLeft size={16} />
        プロジェクト一覧に戻る
      </Link>

      <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-xl font-bold text-neutral-900">{project.title}</h1>
          <ProjectDangerActions id={project.id} />
        </div>
        {project.description && (
          <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">
            {project.description}
          </p>
        )}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-500">
            論文({project.papers.length}件)
          </h2>
        </div>

        {availablePapers.length > 0 && (
          <form
            action={addPaperToProject.bind(null, project.id)}
            className="mt-3 flex items-center gap-2"
          >
            <select
              name="paperId"
              required
              className="flex-1 rounded-md border border-neutral-300 px-3 py-2 text-sm"
              defaultValue=""
            >
              <option value="" disabled>
                論文を選んで追加...
              </option>
              {availablePapers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
            >
              追加
            </button>
          </form>
        )}

        {project.papers.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
            このプロジェクトにはまだ論文がありません。上のフォームから追加してください。
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {project.papers.map((paper) => (
              <div
                key={paper.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-4"
              >
                <div className="min-w-0">
                  <Link
                    href={`/papers/${paper.id}`}
                    className="line-clamp-2 text-sm font-semibold text-neutral-900 hover:text-indigo-600 hover:underline"
                  >
                    {paper.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {paper.authors}
                    {paper.year && <span> ・ {paper.year}</span>}
                  </p>
                  <div className="mt-1">
                    <StarRating rating={paper.relevanceRating} />
                  </div>
                </div>
                <form action={removePaperFromProject.bind(null, project.id, paper.id)}>
                  <button
                    type="submit"
                    title="プロジェクトから外す"
                    className="shrink-0 rounded-md p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <X size={16} />
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
