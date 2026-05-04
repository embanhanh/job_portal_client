import { ReactNode } from "react";

interface LoginLayoutProps {
  marketingPanel: ReactNode;
  formPanel: ReactNode;
}

export function LoginLayout({ marketingPanel, formPanel }: LoginLayoutProps) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Cột Marketing bên trái */}
      {marketingPanel}

      {/* Cột Form bên phải */}
      <div className="p-8 lg:p-12 flex h-full items-center justify-center">
        {formPanel}
      </div>
    </div>
  );
}
