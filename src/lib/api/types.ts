export interface ApiResponse<T, M = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: M;
  errors?: string[];
  timestamp: string;
  path: string
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type Paginated<T> = {
  data: T[];
  meta: PaginationMeta;
};

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: string[];
}
