import type { MetadataRoute } from "next";
import { getAllEquipment } from "@/lib/firebase/firestore";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/equipment`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const categoryPages: MetadataRoute.Sitemap = EQUIPMENT_CATEGORIES.map((cat) => ({
    url: `${BASE_URL}/equipment?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  let equipmentPages: MetadataRoute.Sitemap = [];
  try {
    const equipment = await getAllEquipment();
    equipmentPages = equipment.map((item) => ({
      url: `${BASE_URL}/equipment/${item.id}`,
      lastModified: new Date(item.dateAdded),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Firebase not configured during build
  }

  return [...staticPages, ...categoryPages, ...equipmentPages];
}
