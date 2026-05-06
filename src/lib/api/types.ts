export interface ApiResponse<T, M = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T | null;
  meta?: M;
  errors?: Record<string, string[]>;
  timestamp: string;
  path: string;
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
  statusCode: number;
  errors?: Record<string, string[]>;
}

export class ApiException extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.name = "ApiException";
    this.statusCode = apiError.statusCode;
    this.errors = apiError.errors;
  }

  // Type guard dùng ở component
  static isApiException(error: unknown): error is ApiException {
    return error instanceof ApiException;
  }
}
