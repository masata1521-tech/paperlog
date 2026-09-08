import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
        <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">新しいパスワードを設定</h1>
        {token ? (
          <div className="mt-4">
            <ResetPasswordForm token={token} />
          </div>
        ) : (
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">
            リンクが無効です。
            <Link href="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              もう一度リクエストしてください。
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
