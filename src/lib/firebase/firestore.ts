import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { getFirebaseDb } from "./config";
import type {
  Equipment,
  EquipmentFormData,
  EquipmentFilters,
  PaginatedEquipment,
  DashboardStats,
  Category,
} from "@/types";
import { ITEMS_PER_PAGE, slugify } from "@/lib/constants";

const EQUIPMENT_COLLECTION = "equipment";
const CATEGORIES_COLLECTION = "categories";

function docToEquipment(id: string, data: DocumentData): Equipment {
  const dateAdded =
    data.dateAdded instanceof Timestamp
      ? data.dateAdded.toDate().toISOString()
      : (data.dateAdded as string);

  return {
    id,
    title: data.title,
    brand: data.brand,
    model: data.model,
    price: data.price,
    description: data.description,
    category: data.category,
    condition: data.condition,
    dimensions: data.dimensions,
    powerSpecs: data.powerSpecs,
    photos: data.photos ?? [],
    status: data.status,
    dateAdded,
    slug: data.slug,
    featured: data.featured ?? false,
  };
}

function docToCategory(id: string, data: DocumentData): Category {
  return {
    id,
    name: data.name,
    slug: data.slug,
    description: data.description,
    order: data.order,
    active: data.active ?? true,
  };
}

export async function getAllEquipment(): Promise<Equipment[]> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, EQUIPMENT_COLLECTION),
    orderBy("dateAdded", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToEquipment(d.id, d.data()));
}

export async function getEquipmentById(id: string): Promise<Equipment | null> {
  const db = getFirebaseDb();
  const snap = await getDoc(doc(db, EQUIPMENT_COLLECTION, id));
  if (!snap.exists()) return null;
  return docToEquipment(snap.id, snap.data());
}

export async function getFeaturedEquipment(limit = 6): Promise<Equipment[]> {
  const all = await getAllEquipment();
  const featured = all.filter((e) => e.featured && e.status === "available");
  if (featured.length >= limit) return featured.slice(0, limit);
  const available = all.filter((e) => e.status === "available");
  return [...featured, ...available.filter((e) => !e.featured)].slice(0, limit);
}

export async function getFilteredEquipment(
  filters: EquipmentFilters
): Promise<PaginatedEquipment> {
  const all = await getAllEquipment();
  let filtered = [...all];

  if (filters.search) {
    const term = filters.search.toLowerCase();
    filtered = filtered.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.brand.toLowerCase().includes(term) ||
        e.model.toLowerCase().includes(term) ||
        e.description.toLowerCase().includes(term)
    );
  }

  if (filters.category) {
    filtered = filtered.filter((e) => e.category === filters.category);
  }

  if (filters.brand) {
    filtered = filtered.filter(
      (e) => e.brand.toLowerCase() === filters.brand!.toLowerCase()
    );
  }

  if (filters.status) {
    filtered = filtered.filter((e) => e.status === filters.status);
  }

  const page = filters.page ?? 1;
  const limit = filters.limit ?? ITEMS_PER_PAGE;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return {
    items,
    total,
    page,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export async function getUniqueBrands(): Promise<string[]> {
  const all = await getAllEquipment();
  const brands = new Set(all.map((e) => e.brand));
  return Array.from(brands).sort();
}

export async function createEquipment(data: EquipmentFormData): Promise<string> {
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, EQUIPMENT_COLLECTION), {
    ...data,
    slug: slugify(`${data.brand}-${data.model}-${data.title}`),
    dateAdded: Timestamp.now(),
  });
  return docRef.id;
}

export async function updateEquipment(
  id: string,
  data: Partial<EquipmentFormData>
): Promise<void> {
  const db = getFirebaseDb();
  const updateData: Record<string, unknown> = { ...data };
  if (data.title || data.brand || data.model) {
    const existing = await getEquipmentById(id);
    if (existing) {
      updateData.slug = slugify(
        `${data.brand ?? existing.brand}-${data.model ?? existing.model}-${data.title ?? existing.title}`
      );
    }
  }
  await updateDoc(doc(db, EQUIPMENT_COLLECTION, id), updateData);
}

export async function deleteEquipment(id: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, EQUIPMENT_COLLECTION, id));
}

export async function markEquipmentSold(id: string): Promise<void> {
  await updateEquipment(id, { status: "sold" });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const all = await getAllEquipment();
  const available = all.filter((e) => e.status === "available");
  const sold = all.filter((e) => e.status === "sold");

  const byCategory: Record<string, number> = {};
  const byBrand: Record<string, number> = {};

  for (const item of all) {
    byCategory[item.category] = (byCategory[item.category] ?? 0) + 1;
    byBrand[item.brand] = (byBrand[item.brand] ?? 0) + 1;
  }

  return {
    total: all.length,
    available: available.length,
    sold: sold.length,
    totalValue: all.reduce((sum, e) => sum + e.price, 0),
    availableValue: available.reduce((sum, e) => sum + e.price, 0),
    byCategory,
    byBrand,
  };
}

export async function getCategories(): Promise<Category[]> {
  const db = getFirebaseDb();
  const q = query(collection(db, CATEGORIES_COLLECTION), orderBy("order", "asc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToCategory(d.id, d.data()));
}

export async function createCategory(
  data: Omit<Category, "id">
): Promise<string> {
  const db = getFirebaseDb();
  const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), data);
  return docRef.id;
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, "id">>
): Promise<void> {
  const db = getFirebaseDb();
  await updateDoc(doc(db, CATEGORIES_COLLECTION, id), data);
}

export async function deleteCategory(id: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
}

export async function getEquipmentByCategory(
  category: string
): Promise<Equipment[]> {
  const db = getFirebaseDb();
  const q = query(
    collection(db, EQUIPMENT_COLLECTION),
    where("category", "==", category),
    orderBy("dateAdded", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => docToEquipment(d.id, d.data()));
}
