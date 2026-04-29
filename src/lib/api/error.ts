import axios, { AxiosError } from "axios";
import { ApiError, ApiResponse } from "./types";

export const normalizeError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<null>>;
    
    // If the backend returns our standard format inside the error response
    if (axiosError.response?.data) {
      const responseData = axiosError.response.data;
      return {
        message: responseData.message || axiosError.message,
        statusCode: responseData.statusCode || axiosError.response.status,
        errors: responseData.errors,
      };
    }

    return {
      message: axiosError.message,
      statusCode: axiosError.response?.status,
    };
  }

  // Fallback for non-axios errors
  return {
    message: error instanceof Error ? error.message : "An unknown error occurred",
    statusCode: 500,
  };
};
