"use client";

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "削除する",
  cancelLabel = "キャンセル",
  onConfirm,
  onCancel,
  isPending,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white dark:bg-neutral-900 p-5 shadow-lg">
        <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-md border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? "削除中..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
