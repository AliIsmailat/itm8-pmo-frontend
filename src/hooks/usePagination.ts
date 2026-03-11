import { useState, useMemo } from "react";

export function usePagination<T>(items: T[], perPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginated = useMemo(
    () => items.slice((safePage - 1) * perPage, safePage * perPage),
    [items, safePage, perPage],
  );

  return {
    currentPage: safePage,
    totalPages,
    paginated,
    pageCount: paginated.length,
    setCurrentPage,
  };
}