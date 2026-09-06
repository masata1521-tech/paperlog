"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProject } from "@/app/projects/actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function ProjectDangerActions({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

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
        onClick={() => setConfirmingDelete(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={14} />
        削除
      </button>

      <ConfirmDialog
        open={confirmingDelete}
        title="このプロジェクトを削除しますか?"
        message="論文自体は削除されません。この操作は取り消せません。"
        isPending={isPending}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => startTransition(() => deleteProject(id))}
      />
    </div>
  );
}
