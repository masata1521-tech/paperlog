"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Star, BookOpenCheck, Pencil, Trash2 } from "lucide-react";
import { toggleFavorite, toggleRead, deletePaper } from "@/app/papers/actions";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function PaperDetailActions({
  id,
  isFavorite,
  isRead,
}: {
  id: string;
  isFavorite: boolean;
  isRead: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleFavorite(id))}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
          isFavorite
            ? "border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
            : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        }`}
      >
        <Star size={14} className={isFavorite ? "fill-amber-500 text-amber-500 dark:text-amber-400" : ""} />
        お気に入り
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleRead(id))}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
          isRead
            ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
            : "border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        }`}
      >
        <BookOpenCheck size={14} />
        {isRead ? "既読" : "未読"}
      </button>
      <Link
        href={`/papers/${id}/edit`}
        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
      >
        <Pencil size={14} />
        編集
      </Link>
      <button
        type="button"
        disabled={isPending}
        onClick={() => setConfirmingDelete(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50 sm:ml-auto"
      >
        <Trash2 size={14} />
        削除
      </button>

      <ConfirmDialog
        open={confirmingDelete}
        title="この論文を削除しますか?"
        message="この操作は取り消せません。"
        isPending={isPending}
        onCancel={() => setConfirmingDelete(false)}
        onConfirm={() => startTransition(() => deletePaper(id))}
      />
    </div>
  );
}
