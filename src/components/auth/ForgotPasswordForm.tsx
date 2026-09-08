"use client";

import { useActionState } from "react";
import { requestPasswordReset } from "@/lib/auth-actions";
import type { RequestResetState } from "@/lib/auth-actions";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<RequestResetState, FormData>(
    requestPasswordReset,
    null
  );

  if (state && "success" in state) {
    return (
      <div className="rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-3 py-3 text-sm text-emerald-700 dark:text-emerald-300">
        入力されたメールアドレス宛にパスワード再設定用のリンクを送信しました(該当するアカウントがある場合)。メールをご確認ください。
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {state && "error" in state && (
        <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">メールアドレス</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 dark:text-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
      >
        {isPending ? "送信中..." : "再設定リンクを送る"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";
