// lib/api/unwrap.ts

import { ApiResponse, PaginationMeta } from "./types";

export function unwrapData<T>(res: ApiResponse<T>): T {
  if (!res.success) throw res;
  return res.data;
}

export function unwrapPaginated<T>(
  res: ApiResponse<T[], PaginationMeta>
): { data: T[]; meta: PaginationMeta } {
  if (!res.success) throw res;

  return {
    data: res.data,
    meta: res.meta!,
  };
}