"use client";

import { useActionState } from "react";
import { signup } from "@/lib/auth-actions";
import type { AuthFormState } from "@/lib/auth-actions";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState<AuthFormState, FormData>(signup, null);

  return (
    <form action={formAction} className="space-y-3">
      {state?.error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">お名前(任意)</span>
        <input name="name" type="text" autoComplete="name" className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">メールアドレス</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">パスワード</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputClass}
        />
        <span className="mt-1 block text-xs text-neutral-400">8文字以上</span>
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "登録中..." : "アカウントを作成"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";
