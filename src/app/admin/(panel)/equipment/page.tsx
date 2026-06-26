"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Pencil, Trash2, CheckCircle } from "lucide-react";
import { getAllEquipment, deleteEquipment, markEquipmentSold } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import {
  formatPrice,
  getCategoryName,
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_STATUSES,
} from "@/lib/constants";
import type { Equipment, EquipmentStatus } from "@/types";

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadEquipment = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllEquipment();
      setEquipment(data);
    } catch {
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const filtered = equipment.filter((item) => {
    if (search) {
      const term = search.toLowerCase();
      const match =
        item.title.toLowerCase().includes(term) ||
        item.brand.toLowerCase().includes(term) ||
        item.model.toLowerCase().includes(term);
      if (!match) return false;
    }
    if (categoryFilter && item.category !== categoryFilter) return false;
    if (statusFilter && item.status !== statusFilter) return false;
    return true;
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this equipment?")) return;
    setDeleting(id);
    try {
      await deleteEquipment(id);
      setEquipment((prev) => prev.filter((e) => e.id !== id));
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkSold = async (id: string) => {
    await markEquipmentSold(id);
    setEquipment((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: "sold" as EquipmentStatus } : e))
    );
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-sm text-surface-400">{filtered.length} items</p>
        </div>
        <Link href="/admin/equipment/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Equipment
          </Button>
        </Link>
      </div>

      <div className="card p-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="relative sm:col-span-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="input-field pl-10"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            placeholder="All Categories"
            options={EQUIPMENT_CATEGORIES.map((c) => ({
              value: c.slug,
              label: c.name,
            }))}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            placeholder="All Status"
            options={EQUIPMENT_STATUSES.map((s) => ({
              value: s.value,
              label: s.label,
            }))}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-800 text-left text-surface-500">
                <th className="px-4 py-3 font-medium">Item</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-surface-800/50 hover:bg-surface-800/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-surface-800">
                        {item.photos[0] ? (
                          <Image
                            src={item.photos[0]}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-surface-600">
                            N/A
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-white">{item.title}</p>
                        <p className="text-xs text-surface-500">
                          {item.brand} {item.model}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-surface-400">
                    {getCategoryName(item.category)}
                  </td>
                  <td className="px-4 py-3 font-medium text-white">
                    {formatPrice(item.price)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={item.status === "available" ? "success" : "danger"}>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link href={`/admin/equipment/${item.id}/edit`}>
                        <button
                          type="button"
                          className="rounded-lg p-2 text-surface-400 hover:bg-surface-800 hover:text-white"
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                      </Link>
                      {item.status === "available" && (
                        <button
                          type="button"
                          onClick={() => handleMarkSold(item.id)}
                          className="rounded-lg p-2 text-surface-400 hover:bg-green-900/20 hover:text-green-400"
                          aria-label="Mark as sold"
                          title="Mark as sold"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={deleting === item.id}
                        className="rounded-lg p-2 text-surface-400 hover:bg-red-900/20 hover:text-red-400 disabled:opacity-50"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-surface-500">
                    No equipment found
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
