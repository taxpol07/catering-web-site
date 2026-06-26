"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  className?: string;
}

export function Pagination({
  page,
  totalPages,
  hasNext,
  hasPrev,
  className,
}: PaginationProps) {
  const searchParams = useSearchParams();

  const buildUrl = (pageNum: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pageNum));
    return `/equipment?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      {hasPrev ? (
        <Link
          href={buildUrl(page - 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-700 text-surface-300 transition-colors hover:bg-surface-800 hover:text-white"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-800 text-surface-600">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-surface-500">
            ...
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(p as number)}
            className={cn(
              "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors",
              p === page
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-surface-700 text-surface-300 hover:bg-surface-800 hover:text-white"
            )}
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </Link>
        )
      )}

      {hasNext ? (
        <Link
          href={buildUrl(page + 1)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-700 text-surface-300 transition-colors hover:bg-surface-800 hover:text-white"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-surface-800 text-surface-600">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, "...", total];
  }

  if (current >= total - 2) {
    return [1, "...", total - 3, total - 2, total - 1, total];
  }

  return [1, "...", current - 1, current, current + 1, "...", total];
}
