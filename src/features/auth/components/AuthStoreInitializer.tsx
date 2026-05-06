"use client";

import { useRef } from "react";
import { useAuthStore } from "../model/auth.store";

interface AuthStoreInitializerProps {
  accessToken: string | null;
}

export function AuthStoreInitializer({
  accessToken,
}: AuthStoreInitializerProps) {
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    useAuthStore.getState().setAccessToken(accessToken);
    isInitialized.current = true;
  }

  return null;
}
