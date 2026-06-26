import { EquipmentForm } from "@/components/admin/EquipmentForm";

export default function NewEquipmentPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Add Equipment</h1>
        <p className="text-sm text-surface-400">Add a new item to your inventory</p>
      </div>
      <EquipmentForm mode="create" />
    </div>
  );
}
