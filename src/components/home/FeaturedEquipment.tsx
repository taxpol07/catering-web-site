import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EquipmentCard } from "@/components/equipment/EquipmentCard";
import { getFeaturedEquipment } from "@/lib/firebase/firestore";
import { Button } from "@/components/ui/Button";
import type { Equipment } from "@/types";

export async function FeaturedEquipment() {
  let equipment: Equipment[] = [];

  try {
    equipment = await getFeaturedEquipment(6);
  } catch {
    equipment = [];
  }

  if (equipment.length === 0) {
    return (
      <section className="py-16 lg:py-24 bg-surface-900/50">
        <div className="container-app text-center">
          <h2 className="section-title">Featured Equipment</h2>
          <p className="section-subtitle mt-2">
            New stock arriving soon. Configure Firebase to see live inventory.
          </p>
          <Link href="/equipment" className="mt-8 inline-block">
            <Button>View All Equipment</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 lg:py-24 bg-surface-900/50">
      <div className="container-app">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="section-title">Featured Equipment</h2>
            <p className="section-subtitle">Hand-picked items from our warehouse</p>
          </div>
          <Link href="/equipment" className="hidden sm:block">
            <Button variant="secondary">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {equipment.map((item) => (
            <EquipmentCard key={item.id} equipment={item} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/equipment">
            <Button variant="secondary">View All Equipment</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
