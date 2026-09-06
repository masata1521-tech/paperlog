import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 p-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-bold text-neutral-900">PaperLog にログイン</h1>
        <div className="mt-4">
          <LoginForm from={from} />
        </div>
        <p className="mt-3 text-center text-sm">
          <Link href="/forgot-password" className="text-indigo-600 hover:underline">
            パスワードをお忘れですか?
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-neutral-500">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-indigo-600 hover:underline">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
