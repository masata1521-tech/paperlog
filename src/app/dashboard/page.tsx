import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const paperCount = await prisma.paper.count();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-900">ダッシュボード</h1>
      <p className="mt-2 text-neutral-500">
        登録されている論文数: {paperCount}
      </p>
    </div>
  );
}