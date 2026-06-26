import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MessageCircle,
  Facebook,
  Ruler,
  Zap,
  Calendar,
  Tag,
} from "lucide-react";
import { ImageGallery } from "@/components/equipment/ImageGallery";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getEquipmentById } from "@/lib/firebase/firestore";
import {
  formatPrice,
  formatDate,
  getCategoryName,
  getWhatsAppLink,
  BUSINESS,
} from "@/lib/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const equipment = await getEquipmentById(id);
    if (!equipment) return { title: "Equipment Not Found" };

    return {
      title: `${equipment.title} — ${equipment.brand} ${equipment.model}`,
      description: equipment.description.slice(0, 160),
      openGraph: {
        title: equipment.title,
        description: equipment.description.slice(0, 160),
        images: equipment.photos[0] ? [{ url: equipment.photos[0] }] : [],
      },
    };
  } catch {
    return { title: "Equipment Details" };
  }
}

export default async function EquipmentDetailPage({ params }: PageProps) {
  const { id } = await params;

  let equipment = null;
  try {
    equipment = await getEquipmentById(id);
  } catch {
    notFound();
  }

  if (!equipment) notFound();

  const whatsappMessage = `Hi, I'm interested in the ${equipment.title} (${equipment.brand} ${equipment.model}) listed at ${formatPrice(equipment.price)}. Could you provide more details?`;

  return (
    <div className="py-10 lg:py-16">
      <div className="container-app">
        <Link
          href="/equipment"
          className="mb-8 inline-flex items-center gap-2 text-sm text-surface-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Equipment
        </Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <ImageGallery photos={equipment.photos} title={equipment.title} />

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={equipment.status === "available" ? "success" : "danger"}>
                {equipment.status === "available" ? "Available" : "Sold"}
              </Badge>
              <Badge variant="info">{getCategoryName(equipment.category)}</Badge>
              <Badge>{equipment.condition}</Badge>
            </div>

            <h1 className="mt-4 text-3xl font-bold text-white lg:text-4xl">
              {equipment.title}
            </h1>
            <p className="mt-2 text-lg text-surface-400">
              {equipment.brand} &middot; {equipment.model}
            </p>

            <p className="mt-6 text-4xl font-bold text-brand-400">
              {formatPrice(equipment.price)}
            </p>

            {equipment.status === "available" && (
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={getWhatsAppLink(whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg">
                    <MessageCircle className="h-5 w-5" />
                    Enquire via WhatsApp
                  </Button>
                </a>
                <a href={BUSINESS.facebook} target="_blank" rel="noopener noreferrer">
                  <Button variant="secondary" size="lg">
                    <Facebook className="h-5 w-5" />
                    View on Facebook
                  </Button>
                </a>
              </div>
            )}

            <div className="mt-8 card divide-y divide-surface-800">
              <SpecRow icon={Tag} label="Brand" value={equipment.brand} />
              <SpecRow icon={Tag} label="Model" value={equipment.model} />
              <SpecRow icon={Ruler} label="Dimensions" value={equipment.dimensions} />
              <SpecRow icon={Zap} label="Power" value={equipment.powerSpecs} />
              <SpecRow
                icon={Calendar}
                label="Date Added"
                value={formatDate(equipment.dateAdded)}
              />
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-semibold text-white">Description</h2>
          <div className="mt-4 card p-6">
            <p className="whitespace-pre-line leading-relaxed text-surface-300">
              {equipment.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Icon className="h-5 w-5 shrink-0 text-brand-500" />
      <span className="w-28 shrink-0 text-sm text-surface-500">{label}</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  );
}
