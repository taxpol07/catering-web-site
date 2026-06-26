import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { EquipmentFilters } from "@/components/equipment/EquipmentFilters";
import { Pagination } from "@/components/equipment/Pagination";
import {
  getFilteredEquipment,
  getUniqueBrands,
} from "@/lib/firebase/firestore";
import type { EquipmentCategory, EquipmentStatus } from "@/types";

interface EquipmentListingProps {
  search?: string;
  category?: string;
  brand?: string;
  status?: string;
  page?: number;
}

export async function EquipmentListing({
  search,
  category,
  brand,
  status,
  page = 1,
}: EquipmentListingProps) {
  let result = {
    items: [] as Awaited<ReturnType<typeof getFilteredEquipment>>["items"],
    total: 0,
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  };
  let brands: string[] = [];

  try {
    [result, brands] = await Promise.all([
      getFilteredEquipment({
        search,
        category: category as EquipmentCategory | undefined,
        brand,
        status: status as EquipmentStatus | undefined,
        page,
      }),
      getUniqueBrands(),
    ]);
  } catch {
    // Firebase not configured yet
  }

  return (
    <div className="space-y-8">
      <EquipmentFilters brands={brands} />

      <div className="flex items-center justify-between text-sm text-surface-400">
        <p>
          Showing {result.items.length} of {result.total} items
          {result.totalPages > 1 && ` — Page ${result.page} of ${result.totalPages}`}
        </p>
      </div>

      {result.items.length === 0 ? (
        <div className="card py-16 text-center">
          <p className="text-lg font-medium text-white">No equipment found</p>
          <p className="mt-2 text-surface-400">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {result.items.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>
      )}

      <Pagination
        page={result.page}
        totalPages={result.totalPages}
        hasNext={result.hasNext}
        hasPrev={result.hasPrev}
      />
    </div>
  );
}
