// lib/api/client.ts
import axios from "axios";
import { BASE_API_CONFIG } from "./config";

export const apiClient = axios.create(BASE_API_CONFIG);
