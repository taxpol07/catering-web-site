"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { PhotoUpload } from "@/components/admin/PhotoUpload";
import {
  EQUIPMENT_CATEGORIES,
  EQUIPMENT_CONDITIONS,
  EQUIPMENT_STATUSES,
  POPULAR_BRANDS,
} from "@/lib/constants";
import {
  createEquipment,
  updateEquipment,
} from "@/lib/firebase/firestore";
import type { Equipment, EquipmentFormData } from "@/types";

interface EquipmentFormProps {
  equipment?: Equipment;
  mode: "create" | "edit";
}

const defaultForm: EquipmentFormData = {
  title: "",
  brand: "",
  model: "",
  price: 0,
  description: "",
  category: "other-equipment",
  condition: "good",
  dimensions: "",
  powerSpecs: "",
  photos: [],
  status: "available",
  featured: false,
};

export function EquipmentForm({ equipment, mode }: EquipmentFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<EquipmentFormData>(
    equipment
      ? {
          title: equipment.title,
          brand: equipment.brand,
          model: equipment.model,
          price: equipment.price,
          description: equipment.description,
          category: equipment.category,
          condition: equipment.condition,
          dimensions: equipment.dimensions,
          powerSpecs: equipment.powerSpecs,
          photos: equipment.photos,
          status: equipment.status,
          featured: equipment.featured ?? false,
        }
      : defaultForm
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const updateField = <K extends keyof EquipmentFormData>(
    key: K,
    value: EquipmentFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (!form.title || !form.brand || !form.price) {
        throw new Error("Title, brand and price are required.");
      }

      if (mode === "create") {
        const id = await createEquipment(form);
        router.push(`/admin/equipment/${id}/edit`);
      } else if (equipment) {
        await updateEquipment(equipment.id, form);
        router.push("/admin/equipment");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save equipment");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Input
          label="Title *"
          value={form.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="e.g. Rational SCC 101 Combi Oven"
          required
        />
        <Input
          label="Price (£) *"
          type="number"
          min={0}
          step={1}
          value={form.price || ""}
          onChange={(e) => updateField("price", parseFloat(e.target.value) || 0)}
          required
        />
        <Select
          label="Brand *"
          value={form.brand}
          onChange={(e) => updateField("brand", e.target.value)}
          placeholder="Select brand"
          options={POPULAR_BRANDS.map((b) => ({ value: b, label: b }))}
        />
        <Input
          label="Model *"
          value={form.model}
          onChange={(e) => updateField("model", e.target.value)}
          placeholder="e.g. SCC 101"
          required
        />
        <Select
          label="Category"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value as EquipmentFormData["category"])}
          options={EQUIPMENT_CATEGORIES.map((c) => ({ value: c.slug, label: c.name }))}
        />
        <Select
          label="Condition"
          value={form.condition}
          onChange={(e) => updateField("condition", e.target.value as EquipmentFormData["condition"])}
          options={EQUIPMENT_CONDITIONS.map((c) => ({ value: c.value, label: c.label }))}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => updateField("status", e.target.value as EquipmentFormData["status"])}
          options={EQUIPMENT_STATUSES.map((s) => ({ value: s.value, label: s.label }))}
        />
        <Input
          label="Dimensions"
          value={form.dimensions}
          onChange={(e) => updateField("dimensions", e.target.value)}
          placeholder='e.g. 850 x 771 x 757 mm (W x D x H)'
        />
        <Input
          label="Power Specifications"
          value={form.powerSpecs}
          onChange={(e) => updateField("powerSpecs", e.target.value)}
          placeholder="e.g. 3 Phase, 18.9 kW"
          className="lg:col-span-2"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-surface-300">
          Description
        </label>
        <textarea
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          rows={6}
          className="input-field resize-y"
          placeholder="Detailed description of the equipment, condition notes, included accessories..."
        />
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.featured ?? false}
          onChange={(e) => updateField("featured", e.target.checked)}
          className="h-4 w-4 rounded border-surface-600 bg-surface-900 text-brand-600 focus:ring-brand-500"
        />
        <span className="text-sm text-surface-300">Feature on homepage</span>
      </label>

      <PhotoUpload
        photos={form.photos}
        onChange={(photos) => updateField("photos", photos)}
        equipmentId={equipment?.id ?? "new"}
      />

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : mode === "create" ? "Add Equipment" : "Save Changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin/equipment")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
