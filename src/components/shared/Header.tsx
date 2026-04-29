"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/craft";
import { ClientHeaderActions } from "./ClientHeaderActions";
import { MobileMenu } from "./MobileMenu";
import { QuickSearch } from "./QuickSearch";

export function Header() {
  const tNav = useTranslations("navigation");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Left: Logo & Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold tracking-tight text-primary">
                JobPortal<span className="text-foreground">.</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="#" className="hover:text-primary transition-colors">{tNav("find_job")}</Link>
              <Link href="#" className="hover:text-primary transition-colors">{tNav("companies")}</Link>
              <Link href="#" className="hover:text-primary transition-colors">{tNav("guide")}</Link>
              <Link href="#" className="hover:text-primary transition-colors">{tNav("about_us")}</Link>
            </nav>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <QuickSearch />
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <ClientHeaderActions />
            </div>
            <MobileMenu />
          </div>
        </div>
      </Container>
    </header>
  );
}
