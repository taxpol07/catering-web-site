import type { EquipmentCategory, EquipmentCondition } from "@/types";

export const EQUIPMENT_CATEGORIES: {
  slug: EquipmentCategory;
  name: string;
  description: string;
}[] = [
  {
    slug: "pizza-ovens",
    name: "Pizza Ovens",
    description: "Stone deck, conveyor and rotary pizza ovens",
  },
  {
    slug: "combi-ovens",
    name: "Combi Ovens",
    description: "Rational, Unox and other combi steam ovens",
  },
  {
    slug: "refrigeration",
    name: "Refrigeration",
    description: "Fridges, freezers, blast chillers and cold rooms",
  },
  {
    slug: "dishwashers",
    name: "Dishwashers",
    description: "Pass-through, hood and undercounter dishwashers",
  },
  {
    slug: "coffee-machines",
    name: "Coffee Machines",
    description: "Espresso, bean-to-cup and filter coffee equipment",
  },
  {
    slug: "fryers",
    name: "Fryers",
    description: "Single and twin tank commercial fryers",
  },
  {
    slug: "preparation-equipment",
    name: "Preparation Equipment",
    description: "Slicers, processors and prep tables",
  },
  {
    slug: "mixers",
    name: "Mixers",
    description: "Planetary and spiral dough mixers",
  },
  {
    slug: "grills",
    name: "Grills",
    description: "Chargrills, salamanders and griddles",
  },
  {
    slug: "other-equipment",
    name: "Other Equipment",
    description: "Miscellaneous commercial catering equipment",
  },
];

export const EQUIPMENT_CONDITIONS: { value: EquipmentCondition; label: string }[] = [
  { value: "excellent", label: "Excellent" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "refurbished", label: "Refurbished" },
  { value: "as-is", label: "As-Is" },
];

export const EQUIPMENT_STATUSES = [
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
] as const;

export const POPULAR_BRANDS = [
  "Rational",
  "Unox",
  "Lincat",
  "Falcon",
  "Blue Seal",
  "Williams",
  "Foster",
  "Electrolux",
  "Zanussi",
  "PizzaMaster",
  "Middleby Marshall",
  "La Marzocco",
  "Other",
];

export const ITEMS_PER_PAGE = 12;

export const BUSINESS = {
  name: process.env.NEXT_PUBLIC_BUSINESS_NAME || "Premier Catering Equipment UK",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "+44 7700 900000",
  email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || "info@premiercatering.co.uk",
  address:
    process.env.NEXT_PUBLIC_BUSINESS_ADDRESS ||
    "Unit 5, Industrial Estate, Manchester, M1 2AB, UK",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "447700900000",
  facebook:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://www.facebook.com/premiercateringequipment",
};

export function getCategoryName(slug: EquipmentCategory): string {
  return EQUIPMENT_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function getWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encoded}`;
}
