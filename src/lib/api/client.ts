// lib/api/client.ts
import axios from "axios";
import { BASE_API_CONFIG } from "./config";
import { initializeInterceptors } from "./interceptor";

export const apiClient = axios.create(BASE_API_CONFIG);

// Khởi tạo interceptors ngay lập tức (cho cả Client và Server)
initializeInterceptors(apiClient);
