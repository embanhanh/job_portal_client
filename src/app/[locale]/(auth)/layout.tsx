import { AuthMarketing } from "@/features/auth/components/AuthMarketing";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <AuthMarketing />
      <div className="p-8 lg:p-12 flex h-full items-center justify-center">
        {children}
      </div>
    </div>
  );
}
