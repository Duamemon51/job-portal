"use client";

import { useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  // Clamped rather than reset via an effect: when a filter shrinks the result set,
  // this settles on the last valid page instead of always snapping back to page 1.
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => items.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [items, currentPage, pageSize]
  );

  const firstItem = items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastItem = Math.min(currentPage * pageSize, items.length);

  return { page: currentPage, setPage, totalPages, pageItems, firstItem, lastItem, total: items.length };
}
