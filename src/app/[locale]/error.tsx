"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-background">
      <div className="bg-destructive/10 p-5 rounded-full mb-6">
        <AlertCircle className="h-16 w-16 text-destructive" />
      </div>
      
      <h2 className="text-3xl font-extrabold mb-3 text-foreground tracking-tight">
        Oops! Đã có lỗi xảy ra.
      </h2>
      
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        Hệ thống đang gặp một chút sự cố trong quá trình xử lý yêu cầu của bạn. Vui lòng thử lại sau.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => reset()} 
          className="flex items-center gap-2 h-11 px-6 font-medium"
        >
          <RefreshCw className="h-4 w-4" />
          Thử lại
        </Button>
        <Link href="/">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 h-11 px-6 font-medium w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Về trang chủ
          </Button>
        </Link>
      </div>

      {process.env.NODE_ENV === "development" && (
        <div className="mt-12 p-5 bg-muted/50 rounded-xl text-left w-full max-w-3xl overflow-auto text-sm font-mono border shadow-sm">
          <p className="font-bold text-destructive mb-3 border-b border-destructive/20 pb-2">
            Developer Details: {error.message}
          </p>
          {error.stack && (
            <pre className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {error.stack}
            </pre>
          )}
          {error.digest && (
            <p className="mt-4 text-xs text-muted-foreground">
              Digest: {error.digest}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
