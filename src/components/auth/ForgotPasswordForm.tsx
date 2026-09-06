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
      <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm text-emerald-700">
        入力されたメールアドレス宛にパスワード再設定用のリンクを送信しました(該当するアカウントがある場合)。メールをご確認ください。
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-3">
      {state && "error" in state && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}
      <label className="block">
        <span className="mb-1 block text-sm font-medium text-neutral-700">メールアドレス</span>
        <input name="email" type="email" required autoComplete="email" className={inputClass} />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
      >
        {isPending ? "送信中..." : "再設定リンクを送る"}
      </button>
    </form>
  );
}

const inputClass =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100";
