import type { DashboardStats } from "@/types";
import { formatPrice, getCategoryName } from "@/lib/constants";
import { Package, CheckCircle, XCircle, PoundSterling } from "lucide-react";

interface StatsCardsProps {
  stats: DashboardStats;
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      label: "Total Items",
      value: stats.total,
      icon: Package,
      color: "text-blue-400",
    },
    {
      label: "Available",
      value: stats.available,
      icon: CheckCircle,
      color: "text-green-400",
    },
    {
      label: "Sold",
      value: stats.sold,
      icon: XCircle,
      color: "text-red-400",
    },
    {
      label: "Available Value",
      value: formatPrice(stats.availableValue),
      icon: PoundSterling,
      color: "text-brand-400",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="card p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-surface-400">{card.label}</p>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <p className="mt-2 text-3xl font-bold text-white">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

export function CategoryBreakdown({ stats }: StatsCardsProps) {
  const sorted = Object.entries(stats.byCategory).sort(([, a], [, b]) => b - a);

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-white">Inventory by Category</h3>
      <div className="mt-4 space-y-3">
        {sorted.length === 0 ? (
          <p className="text-sm text-surface-500">No data yet</p>
        ) : (
          sorted.map(([category, count]) => {
            const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
            return (
              <div key={category}>
                <div className="flex justify-between text-sm">
                  <span className="text-surface-300">
                    {getCategoryName(category as Parameters<typeof getCategoryName>[0])}
                  </span>
                  <span className="text-surface-400">{count}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-800">
                  <div
                    className="h-full rounded-full bg-brand-600 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function BrandBreakdown({ stats }: StatsCardsProps) {
  const sorted = Object.entries(stats.byBrand).sort(([, a], [, b]) => b - a).slice(0, 8);

  return (
    <div className="card p-6">
      <h3 className="font-semibold text-white">Top Brands</h3>
      <div className="mt-4 space-y-2">
        {sorted.length === 0 ? (
          <p className="text-sm text-surface-500">No data yet</p>
        ) : (
          sorted.map(([brand, count]) => (
            <div key={brand} className="flex items-center justify-between text-sm">
              <span className="text-surface-300">{brand}</span>
              <span className="rounded-full bg-surface-800 px-2.5 py-0.5 text-xs text-surface-400">
                {count}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
