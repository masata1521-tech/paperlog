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
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">新しいパスワード</span>
        <input
          name="newPassword"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-neutral-400">8文字以上</span>
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">
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
        className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "変更中..." : "パスワードを設定する"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";
