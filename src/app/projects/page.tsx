import Link from "next/link";
import { Plus, FlaskConical } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.researchProject.findMany({
    include: { _count: { select: { papers: true } } },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">研究プロジェクト</h1>
          <p className="mt-1 text-sm text-neutral-500">
            研究テーマごとに論文をまとめて管理できます。
          </p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800"
        >
          <Plus size={16} />
          プロジェクトを作成
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-neutral-300 bg-white p-12 text-center text-sm text-neutral-500">
          まだ研究プロジェクトがありません。「プロジェクトを作成」から始めてください。
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-center gap-2 text-neutral-400">
                <FlaskConical size={16} />
                <span className="text-xs font-medium">{project._count.papers}件の論文</span>
              </div>
              <h2 className="mt-2 text-base font-bold text-neutral-900">{project.title}</h2>
              {project.description && (
                <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                  {project.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
