// lib/api/error.ts
import axios, { AxiosError } from "axios";
import { ApiException, ApiResponse } from "./types";

export const normalizeError = (error: unknown): ApiException => {
  // Case 1: Lỗi từ axios (network error, 4xx, 5xx)
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    const responseData = axiosError.response?.data;

    if (responseData) {
      return new ApiException({
        message: responseData.message || axiosError.message,
        statusCode:
          responseData.statusCode || axiosError.response?.status || 500,
        errors: responseData.errors,
      });
    }

    // Network error (không có response — timeout, CORS, offline)
    return new ApiException({
      message: axiosError.message || "Network error",
      statusCode: axiosError.response?.status || 0,
      // statusCode 0 = không kết nối được server
    });
  }

  // Case 2: ApiException đã được normalize rồi (re-throw từ unwrap)
  if (error instanceof ApiException) return error;

  // Case 3: Lỗi JS thuần
  if (error instanceof Error) {
    return new ApiException({
      message: error.message,
      statusCode: 500,
    });
  }

  // Case 4: Unknown
  return new ApiException({
    message: "An unknown error occurred",
    statusCode: 500,
  });
};
