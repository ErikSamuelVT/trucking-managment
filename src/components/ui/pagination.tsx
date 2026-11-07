"use client";

import { cn } from "@/lib/utils/cn";

type PageItem = number | "ellipsis-start" | "ellipsis-end";

function getPageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  const items: PageItem[] = [1];

  if (start > 2) {
    items.push("ellipsis-start");
  }

  for (let current = start; current <= end; current += 1) {
    items.push(current);
  }

  if (end < totalPages - 1) {
    items.push("ellipsis-end");
  }

  items.push(totalPages);

  return items;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Mantiene visibles los controles aunque no haya más de una página. */
  alwaysShow?: boolean;
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className,
  alwaysShow = false,
}: PaginationProps) {
  if (totalPages <= 1 && !alwaysShow) {
    return null;
  }

  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const items = getPageItems(safePage, safeTotalPages);
  const baseButton =
    "inline-flex size-9 cursor-pointer items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-500 disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav
      aria-label="Paginación"
      className={cn("flex items-center justify-center gap-1", className)}
    >
      <button
        type="button"
        onClick={() => onPageChange(safePage - 1)}
        disabled={safePage === 1}
        className={cn(baseButton, "text-slate-600 hover:bg-slate-100")}
        aria-label="Página anterior"
      >
        <svg
          className="size-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.83 10l3.94 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {items.map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() => onPageChange(item)}
            aria-current={item === safePage ? "page" : undefined}
            aria-label={`Página ${item}`}
            className={cn(
              baseButton,
              item === safePage
                ? "font-semibold text-slate-900"
                : "text-slate-600 hover:bg-slate-100",
            )}
          >
            {item}
          </button>
        ) : (
          <span
            key={item}
            className="inline-flex size-9 items-center justify-center text-slate-400"
            aria-hidden="true"
          >
            …
          </span>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(safePage + 1)}
        disabled={safePage === safeTotalPages}
        className={cn(baseButton, "text-slate-600 hover:bg-slate-100")}
        aria-label="Página siguiente"
      >
        <svg
          className="size-4"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.17 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
}
