// lib/api/config.ts
import { AxiosRequestConfig } from "axios";

export const BASE_API_CONFIG: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1",
  withCredentials: true,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
};
