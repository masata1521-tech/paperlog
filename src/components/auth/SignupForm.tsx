"use client";

import { useActionState } from "react";
import { signup } from "@/lib/auth-actions";
import type { AuthFormState } from "@/lib/auth-actions";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(signup, null);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">お名前(任意)</span>
        <input name="name" type="text" autoComplete="name" className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">メールアドレス</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">パスワード</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-neutral-400 dark:text-neutral-500">8文字以上</span>
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2.5 text-sm font-medium text-white dark:text-neutral-900 dark:text-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
      >
        {isPending ? "登録中..." : "アカウントを作成"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";
