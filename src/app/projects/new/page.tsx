import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProjectForm } from "@/components/projects/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700"
      >
        <ArrowLeft size={16} />
        プロジェクト一覧に戻る
      </Link>
      <h1 className="mt-3 text-2xl font-bold text-neutral-900">研究プロジェクトを作成</h1>

      <div className="mt-6">
        <ProjectForm />
      </div>
    </div>
  );
}
