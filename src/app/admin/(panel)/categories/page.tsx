"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/firebase/firestore";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import type { Category, EquipmentCategory } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "other-equipment" as EquipmentCategory,
    description: "",
    order: 0,
    active: true,
  });

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      slug: "other-equipment",
      description: "",
      order: categories.length,
      active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateCategory(editingId, form);
    } else {
      await createCategory(form);
    }
    await loadCategories();
    resetForm();
  };

  const handleEdit = (cat: Category) => {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      order: cat.order,
      active: cat.active,
    });
    setEditingId(cat.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await deleteCategory(id);
    await loadCategories();
  };

  const seedDefaults = async () => {
    for (let i = 0; i < EQUIPMENT_CATEGORIES.length; i++) {
      const cat = EQUIPMENT_CATEGORIES[i];
      await createCategory({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        order: i,
        active: true,
      });
    }
    await loadCategories();
  };

  if (loading) return <LoadingPage />;

  const displayCategories =
    categories.length > 0
      ? categories
      : EQUIPMENT_CATEGORIES.map((c, i) => ({
          id: c.slug,
          name: c.name,
          slug: c.slug,
          description: c.description,
          order: i,
          active: true,
        }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-sm text-surface-400">Manage equipment categories</p>
        </div>
        <div className="flex gap-2">
          {categories.length === 0 && (
            <Button variant="secondary" onClick={seedDefaults}>
              Seed Default Categories
            </Button>
          )}
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-4 p-6">
          <h2 className="font-semibold text-white">
            {editingId ? "Edit Category" : "New Category"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <Input
              label="Order"
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
            />
          </div>
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="h-4 w-4 rounded"
            />
            <span className="text-sm text-surface-300">Active</span>
          </label>
          <div className="flex gap-2">
            <Button type="submit">{editingId ? "Save" : "Create"}</Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800 text-left text-surface-500">
              <th className="px-6 py-3 font-medium">Name</th>
              <th className="px-6 py-3 font-medium">Slug</th>
              <th className="px-6 py-3 font-medium">Order</th>
              <th className="px-6 py-3 font-medium">Status</th>
              {categories.length > 0 && (
                <th className="px-6 py-3 font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {displayCategories.map((cat) => (
              <tr key={cat.id} className="border-b border-surface-800/50">
                <td className="px-6 py-4">
                  <p className="font-medium text-white">{cat.name}</p>
                  <p className="text-xs text-surface-500">{cat.description}</p>
                </td>
                <td className="px-6 py-4 text-surface-400">{cat.slug}</td>
                <td className="px-6 py-4 text-surface-400">{cat.order}</td>
                <td className="px-6 py-4">
                  <span
                    className={`text-xs ${cat.active ? "text-green-400" : "text-surface-500"}`}
                  >
                    {cat.active ? "Active" : "Inactive"}
                  </span>
                </td>
                {categories.length > 0 && (
                  <td className="px-6 py-4">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handleEdit(cat as Category)}
                        className="rounded-lg p-2 text-surface-400 hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id)}
                        className="rounded-lg p-2 text-surface-400 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
