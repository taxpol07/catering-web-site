import { notFound } from "next/navigation";
import { EquipmentForm } from "@/components/admin/EquipmentForm";
import { getEquipmentById } from "@/lib/firebase/firestore";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEquipmentPage({ params }: PageProps) {
  const { id } = await params;

  let equipment = null;
  try {
    equipment = await getEquipmentById(id);
  } catch {
    notFound();
  }

  if (!equipment) notFound();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Equipment</h1>
        <p className="text-sm text-surface-400">{equipment.title}</p>
      </div>
      <EquipmentForm mode="edit" equipment={equipment} />
    </div>
  );
}
