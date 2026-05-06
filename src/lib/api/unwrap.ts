// lib/api/unwrap.ts
import { ApiException, ApiResponse, PaginationMeta } from "./types";

export function unwrapData<T>(res: ApiResponse<T>): T {
  if (!res.success) {
    // ✅ Throw ApiException thay vì throw res
    throw new ApiException({
      message: res.message,
      statusCode: res.statusCode,
      errors: res.errors,
    });
  }

  // ✅ Handle null data — một số endpoint không trả data (VD: DELETE)
  return res.data as T;
}

export function unwrapPaginated<T>(res: ApiResponse<T[], PaginationMeta>): {
  data: T[];
  meta: PaginationMeta;
} {
  if (!res.success) {
    throw new ApiException({
      message: res.message,
      statusCode: res.statusCode,
      errors: res.errors,
    });
  }

  if (!res.meta) {
    throw new ApiException({
      message: "Paginated response missing meta",
      statusCode: 500,
    });
  }

  return {
    data: res.data as T[],
    meta: res.meta,
  };
}
