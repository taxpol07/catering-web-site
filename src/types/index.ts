export type EquipmentStatus = "available" | "sold";

export type EquipmentCondition =
  | "excellent"
  | "good"
  | "fair"
  | "refurbished"
  | "as-is";

export type EquipmentCategory =
  | "pizza-ovens"
  | "combi-ovens"
  | "refrigeration"
  | "dishwashers"
  | "coffee-machines"
  | "fryers"
  | "preparation-equipment"
  | "mixers"
  | "grills"
  | "other-equipment";

export interface Equipment {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  description: string;
  category: EquipmentCategory;
  condition: EquipmentCondition;
  dimensions: string;
  powerSpecs: string;
  photos: string[];
  status: EquipmentStatus;
  dateAdded: string;
  slug?: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: EquipmentCategory;
  description: string;
  order: number;
  active: boolean;
}

export interface EquipmentFormData {
  title: string;
  brand: string;
  model: string;
  price: number;
  description: string;
  category: EquipmentCategory;
  condition: EquipmentCondition;
  dimensions: string;
  powerSpecs: string;
  photos: string[];
  status: EquipmentStatus;
  featured?: boolean;
}

export interface EquipmentFilters {
  search?: string;
  category?: EquipmentCategory | "";
  brand?: string;
  status?: EquipmentStatus | "";
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  total: number;
  available: number;
  sold: number;
  totalValue: number;
  availableValue: number;
  byCategory: Record<string, number>;
  byBrand: Record<string, number>;
}

export interface PaginatedEquipment {
  items: Equipment[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
