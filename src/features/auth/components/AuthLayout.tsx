import * as React from "react";
import { Main, Section, Container } from "@/components/craft";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Main className="min-h-screen flex items-center justify-center bg-muted/30">
      <Section className="w-full py-12 md:py-24">
        <Container className="max-w-xl mx-auto px-4 md:px-6">
          <div className="bg-background border border-border shadow-sm rounded-xl p-6 md:p-10">
            {children}
          </div>
        </Container>
      </Section>
    </Main>
  );
}
