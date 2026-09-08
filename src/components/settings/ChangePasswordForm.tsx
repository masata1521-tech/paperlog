"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePassword } from "@/lib/auth-actions";
import type { ChangePasswordState } from "@/lib/auth-actions";

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState<ChangePasswordState, FormData>(
    changePassword,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state && "success" in state) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state && "error" in state && (
        <div className="rounded-md border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950 px-3 py-2 text-sm text-red-700 dark:text-red-300">
          {state.error}
        </div>
      )}
      {state && "success" in state && (
        <div className="rounded-md border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
          パスワードを変更しました
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">現在のパスワード</span>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className={inputClass}
        />
      </label>
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

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-md bg-neutral-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-neutral-900 dark:text-neutral-100 hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50"
        >
          {isPending ? "変更中..." : "パスワードを変更"}
        </button>
      </div>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 px-3 py-2 text-sm focus:border-indigo-400 dark:focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900";
