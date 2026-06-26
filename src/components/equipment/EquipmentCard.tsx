"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Facebook } from "lucide-react";
import type { Equipment } from "@/types";
import {
  formatPrice,
  getCategoryName,
  getWhatsAppLink,
  BUSINESS,
} from "@/lib/constants";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface EquipmentCardProps {
  equipment: Equipment;
  className?: string;
}

export function EquipmentCard({ equipment, className }: EquipmentCardProps) {
  const imageUrl =
    equipment.photos[0] ??
    "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&h=400&fit=crop";

  const whatsappMessage = `Hi, I'm interested in the ${equipment.title} (${equipment.brand} ${equipment.model}) listed at ${formatPrice(equipment.price)}. Is it still available?`;

  return (
    <article className={cn("card group overflow-hidden transition-all hover:border-surface-600", className)}>
      <Link href={`/equipment/${equipment.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface-800">
          <Image
            src={imageUrl}
            alt={equipment.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant={equipment.status === "available" ? "success" : "danger"}>
              {equipment.status === "available" ? "Available" : "Sold"}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-brand-400">
            {getCategoryName(equipment.category)}
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white line-clamp-2 group-hover:text-brand-400 transition-colors">
            {equipment.title}
          </h3>
          <p className="mt-1 text-sm text-surface-400">
            {equipment.brand} &middot; {equipment.model}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xl font-bold text-white">{formatPrice(equipment.price)}</p>
            <Badge variant="default">{equipment.condition}</Badge>
          </div>
        </div>
      </Link>

      {equipment.status === "available" && (
        <div className="flex border-t border-surface-800">
          <a
            href={getWhatsAppLink(whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium text-green-400 transition-colors hover:bg-green-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-4 w-4" />
            Enquire
          </a>
          <a
            href={BUSINESS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-2 border-l border-surface-800 py-3 text-sm font-medium text-blue-400 transition-colors hover:bg-blue-900/20"
            onClick={(e) => e.stopPropagation()}
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </a>
        </div>
      )}
    </article>
  );
}
