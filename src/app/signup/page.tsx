import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">PaperLog のアカウントを作成</h1>
        <div className="mt-4">
          <SignupForm />
        </div>
        <p className="mt-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  );
}
