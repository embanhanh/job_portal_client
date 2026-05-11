"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export function BackButton({ children }: { children?: React.ReactNode }) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      onClick={() => router.back()}
      className="mb-4 -ml-4 text-muted-foreground hover:text-primary hover:bg-transparent flex items-center gap-1 group"
    >
      <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
      {children}
    </Button>
  );
}
