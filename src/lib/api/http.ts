// lib/api/http.ts
import { AxiosRequestConfig } from "axios";
import { apiClient } from "./client";

export const http = {
  async get<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const res = await apiClient.get<TResponse>(url, config);
    return res.data;
  },

  async post<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const res = await apiClient.post<TResponse>(url, data, config);
    return res.data;
  },

  async put<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const res = await apiClient.put<TResponse>(url, data, config);
    return res.data;
  },

  async delete<TResponse>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> {
    const res = await apiClient.delete<TResponse>(url, config);
    return res.data;
  },
};