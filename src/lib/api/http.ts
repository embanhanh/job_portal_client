// lib/api/http.ts
import { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import { ApiResponse, Paginated, PaginationMeta } from "./types";
import { unwrapData, unwrapPaginated } from "./unwrap";

export const http = {
  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await apiClient.get<ApiResponse<TResponse>>(url, config);
    return unwrapData(res.data);
  },

  async getPaginated<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<Paginated<TResponse>> {
    const res = await apiClient.get<ApiResponse<TResponse[], PaginationMeta>>(
      url,
      config,
    );
    return unwrapPaginated(res.data);
  },

  async post<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await apiClient.post<ApiResponse<TResponse>>(url, data, config);
    return unwrapData(res.data);
  },

  async put<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await apiClient.put<ApiResponse<TResponse>>(url, data, config);
    return unwrapData(res.data);
  },

  async patch<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await apiClient.patch<ApiResponse<TResponse>>(
      url,
      data,
      config,
    );
    return unwrapData(res.data);
  },

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<TResponse> {
    const res = await apiClient.delete<ApiResponse<TResponse>>(url, config);
    return unwrapData(res.data);
  },
};
