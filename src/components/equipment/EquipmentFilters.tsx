"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useState } from "react";
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_STATUSES,
  POPULAR_BRANDS,
} from "@/lib/constants";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface EquipmentFiltersProps {
  brands: string[];
  className?: string;
}

export function EquipmentFilters({ brands, className }: EquipmentFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const currentSearch = searchParams.get("search") ?? "";
  const currentCategory = searchParams.get("category") ?? "";
  const currentBrand = searchParams.get("brand") ?? "";
  const currentStatus = searchParams.get("status") ?? "";

  const [search, setSearch] = useState(currentSearch);

  const updateFilters = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      params.delete("page");
      router.push(`/equipment?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search });
  };

  const clearFilters = () => {
    setSearch("");
    router.push("/equipment");
  };

  const hasActiveFilters =
    currentSearch || currentCategory || currentBrand || currentStatus;

  const allBrands = [...new Set([...POPULAR_BRANDS, ...brands])].sort();

  return (
    <div className={cn("space-y-4", className)}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, brand, model..."
            className="input-field pl-10"
          />
        </div>
        <Button type="submit">Search</Button>
        <Button
          type="button"
          variant="secondary"
          className="lg:hidden"
          onClick={() => setFiltersOpen(!filtersOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </form>

      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
          !filtersOpen && "hidden lg:grid"
        )}
      >
        <Select
          label="Category"
          value={currentCategory}
          onChange={(e) => updateFilters({ category: e.target.value })}
          placeholder="All Categories"
          options={EQUIPMENT_CATEGORIES.map((c) => ({
            value: c.slug,
            label: c.name,
          }))}
        />

        <Select
          label="Brand"
          value={currentBrand}
          onChange={(e) => updateFilters({ brand: e.target.value })}
          placeholder="All Brands"
          options={allBrands.map((b) => ({ value: b, label: b }))}
        />

        <Select
          label="Status"
          value={currentStatus}
          onChange={(e) => updateFilters({ status: e.target.value })}
          placeholder="All Status"
          options={EQUIPMENT_STATUSES.map((s) => ({
            value: s.value,
            label: s.label,
          }))}
        />

        <div className="flex items-end">
          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              onClick={clearFilters}
              className="w-full justify-center border border-surface-700"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {currentSearch && (
            <FilterTag label={`Search: ${currentSearch}`} onRemove={() => updateFilters({ search: "" })} />
          )}
          {currentCategory && (
            <FilterTag
              label={EQUIPMENT_CATEGORIES.find((c) => c.slug === currentCategory)?.name ?? currentCategory}
              onRemove={() => updateFilters({ category: "" })}
            />
          )}
          {currentBrand && (
            <FilterTag label={`Brand: ${currentBrand}`} onRemove={() => updateFilters({ brand: "" })} />
          )}
          {currentStatus && (
            <FilterTag
              label={`Status: ${currentStatus}`}
              onRemove={() => updateFilters({ status: "" })}
            />
          )}
        </div>
      )}
    </div>
  );
}

function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface-800 px-3 py-1 text-xs text-surface-300">
      {label}
      <button type="button" onClick={onRemove} className="ml-1 hover:text-white">
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}
