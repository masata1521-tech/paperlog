import { prisma } from "@/lib/prisma";
import { DefaultViewSetting } from "@/components/settings/DefaultViewSetting";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [paperCount, tagCount, projectCount] = await Promise.all([
    prisma.paper.count(),
    prisma.tag.count(),
    prisma.researchProject.count(),
  ]);

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-bold text-neutral-900">設定</h1>

      <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-neutral-500">表示設定</h2>
        <p className="mt-1 text-sm text-neutral-500">
          検索結果を開いたときに最初に表示するビューを選べます。
        </p>
        <div className="mt-3">
          <DefaultViewSetting />
        </div>
      </section>

      <section className="mt-4 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-neutral-500">データ概要</h2>
        <dl className="mt-3 grid grid-cols-3 gap-4 text-center">
          <div>
            <dt className="text-xs text-neutral-500">論文</dt>
            <dd className="mt-1 text-xl font-bold text-neutral-900">{paperCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">タグ</dt>
            <dd className="mt-1 text-xl font-bold text-neutral-900">{tagCount}</dd>
          </div>
          <div>
            <dt className="text-xs text-neutral-500">研究プロジェクト</dt>
            <dd className="mt-1 text-xl font-bold text-neutral-900">{projectCount}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
