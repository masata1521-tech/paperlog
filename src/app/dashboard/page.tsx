import { prisma } from "@/lib/prisma";
import { requireCurrentUserId } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const userId = await requireCurrentUserId();
  const paperCount = await prisma.paper.count({ where: { userId } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-900">ダッシュボード</h1>
      <p className="mt-2 text-neutral-500">
        登録されている論文数: {paperCount}
      </p>
    </div>
  );
}
