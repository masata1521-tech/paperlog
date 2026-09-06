"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProject } from "@/app/projects/actions";

export function ProjectDangerActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (
      window.confirm(
        "このプロジェクトを削除します(論文自体は削除されません)。よろしいですか?"
      )
    ) {
      startTransition(() => deleteProject(id));
    }
  };

  return (
    <div className="flex shrink-0 items-center gap-2">
      <Link
        href={`/projects/${id}/edit`}
        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        <Pencil size={14} />
        編集
      </Link>
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={14} />
        削除
      </button>
    </div>
  );
}
