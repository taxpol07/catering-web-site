import type { Metadata } from "next";
import { Suspense } from "react";
import { EquipmentListing } from "./EquipmentListing";
import { LoadingPage } from "@/components/ui/LoadingSpinner";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Equipment Catalogue",
  description: `Browse our full range of used commercial catering equipment at ${BUSINESS.name}. Filter by category, brand and availability.`,
};

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    brand?: string;
    status?: string;
    page?: string;
  }>;
}

export default async function EquipmentPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="py-10 lg:py-16">
      <div className="container-app">
        <div className="mb-10">
          <h1 className="section-title">Equipment Catalogue</h1>
          <p className="section-subtitle">
            Browse our warehouse of quality used commercial catering equipment
          </p>
        </div>

        <Suspense fallback={<LoadingPage />}>
          <EquipmentListing
            search={params.search}
            category={params.category}
            brand={params.brand}
            status={params.status}
            page={params.page ? parseInt(params.page, 10) : 1}
          />
        </Suspense>
      </div>
    </div>
  );
}
