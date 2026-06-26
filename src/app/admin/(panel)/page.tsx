import Link from "next/link";
import { Plus } from "lucide-react";
import { StatsCards, CategoryBreakdown, BrandBreakdown } from "@/components/admin/StatsCards";
import { getDashboardStats, getAllEquipment } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, getCategoryName } from "@/lib/constants";
import type { DashboardStats } from "@/types";

const emptyStats: DashboardStats = {
  total: 0,
  available: 0,
  sold: 0,
  totalValue: 0,
  availableValue: 0,
  byCategory: {},
  byBrand: {},
};

export default async function AdminDashboardPage() {
  let stats = emptyStats;
  let recent: Awaited<ReturnType<typeof getAllEquipment>> = [];

  try {
    [stats, recent] = await Promise.all([getDashboardStats(), getAllEquipment()]);
  } catch {
    // Firebase not configured
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-surface-400">Overview of your equipment inventory</p>
        </div>
        <Link href="/admin/equipment/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Equipment
          </Button>
        </Link>
      </div>

      <StatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryBreakdown stats={stats} />
        <BrandBreakdown stats={stats} />
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-surface-800 px-6 py-4">
          <h2 className="font-semibold text-white">Recent Additions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800 text-left text-surface-500">
                <th className="px-6 py-3 font-medium">Title</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Price</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.slice(0, 5).map((item) => (
                <tr key={item.id} className="border-b border-surface-800/50 hover:bg-surface-800/30">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/equipment/${item.id}/edit`}
                      className="font-medium text-white hover:text-brand-400"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-surface-500">
                      {item.brand} {item.model}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-surface-400">
                    {getCategoryName(item.category)}
                  </td>
                  <td className="px-6 py-4 text-white">{formatPrice(item.price)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={item.status === "available" ? "success" : "danger"}>
                      {item.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-surface-500">
                    No equipment yet. Add your first item to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
