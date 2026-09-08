import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">パスワードをお忘れですか?</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          登録済みのメールアドレスを入力してください。再設定用のリンクをお送りします。
        </p>
        <div className="mt-4">
          <ForgotPasswordForm />
        </div>
        <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            ログイン画面に戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
