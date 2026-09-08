"use client";

import { useActionState } from "react";
import { resetPassword } from "@/lib/auth-actions";
import type { AuthFormState } from "@/lib/auth-actions";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(
    resetPassword,
    null
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="token" value={token} />
      {state?.error && (
        <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">新しいパスワード</span>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-neutral-400 dark:text-neutral-500">8文字以上</span>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          新しいパスワード(確認)
        </span>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 dark:text-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
      >
        {isPending ? "変更中..." : "パスワードを設定する"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";
