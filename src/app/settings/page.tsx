import { prisma } from "@/lib/prisma";
import { DefaultViewSetting } from "@/components/settings/DefaultViewSetting";
import { ChangePasswordForm } from "@/components/settings/ChangePasswordForm";
import { requireCurrentUserId } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const userId = await requireCurrentUserId();
  const [user, paperCount, tagCount, projectCount] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } }),
    prisma.paper.count({ where: { userId } }),
    prisma.tag.count({ where: { userId } }),
    prisma.researchProject.count({ where: { userId } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-8">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">設定</h1>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{user?.email}でログイン中</p>

      <section className="mt-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">表示設定</h2>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          検索結果を開いたときに最初に表示するビューを選べます。
        </p>
        <div className="mt-3">
          <DefaultViewSetting />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">パスワード変更</h2>
        <div className="mt-3">
          <ChangePasswordForm />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5">
        <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">データ概要</h2>
        <dl className="mt-3 grid grid-cols-3 gap-4 text-center">
          <div>
            <dt className="text-xs text-neutral-500 dark:text-neutral-400">論文</dt>
            <dd className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-100">{paperCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500 dark:text-neutral-400">タグ</dt>
            <dd className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-100">{tagCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500 dark:text-neutral-400">研究プロジェクト</dt>
            <dd className="mt-1 text-xl font-bold text-neutral-900 dark:text-neutral-100">{projectCount}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
