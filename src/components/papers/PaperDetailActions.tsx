"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Star, BookOpenCheck, Pencil, Trash2 } from "lucide-react";
import { toggleFavorite, toggleRead, deletePaper } from "@/app/papers/actions";

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

  const handleDelete = () => {
    if (window.confirm("この論文を削除します。この操作は取り消せません。よろしいですか?")) {
      startTransition(() => deletePaper(id));
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleFavorite(id))}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
          isFavorite
            ? "border-amber-300 bg-amber-50 text-amber-700"
            : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        <Star size={14} className={isFavorite ? "fill-amber-500 text-amber-500" : ""} />
        お気に入り
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => toggleRead(id))}
        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
          isRead
            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
            : "border-neutral-200 text-neutral-700 hover:bg-neutral-50"
        }`}
      >
        <BookOpenCheck size={14} />
        {isRead ? "既読" : "未読"}
      </button>
      <Link
        href={`/papers/${id}/edit`}
        className="inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        <Pencil size={14} />
        編集
      </Link>
      <button
        type="button"
        disabled={isPending}
        onClick={handleDelete}
        className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        <Trash2 size={14} />
        削除
      </button>
    </div>
  );
}
