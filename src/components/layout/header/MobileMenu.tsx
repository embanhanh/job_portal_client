"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Menu, X, LogIn, PlusCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function MobileMenu() {
  const tNav = useTranslations("navigation");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const [open, setOpen] = useState(false);

  // Mock role (tương tự như ClientHeaderActions)
  const role = null;

  const closeMenu = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger 
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        }
      />
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        {/* Title/Description for accessibility */}
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Mobile navigation menu for the site</SheetDescription>
        
        <nav className="flex flex-col gap-6 mt-12">
          <div className="flex flex-col space-y-4">
            <Link href="#" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMenu}>
              {tNav("find_job")}
            </Link>
            <Link href="#" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMenu}>
              {tNav("companies")}
            </Link>
            <Link href="#" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMenu}>
              {tNav("guide")}
            </Link>
            <Link href="#" className="text-lg font-medium hover:text-primary transition-colors" onClick={closeMenu}>
              {tNav("about_us")}
            </Link>
          </div>

          <div className="h-px bg-border my-2" />

          <div className="flex flex-col space-y-4">
            <Button variant="ghost" className="justify-start px-0 font-medium" onClick={() => console.log("Toggle language")}>
              <Globe className="mr-2 h-5 w-5" />
              {tCommon("language_switch")}
            </Button>

            {role === "employer" && (
              <Button 
                render={<Link href="/employer/post-job" />}
                className="w-full justify-start rounded-full font-medium" 
                onClick={closeMenu}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                {tAuth("post_job")}
              </Button>
            )}

            {role === "admin" && (
              <Button 
                render={<Link href="/admin" />}
                variant="outline" 
                className="w-full justify-start rounded-full font-medium" 
                onClick={closeMenu}
              >
                {tAuth("admin_dashboard")}
              </Button>
            )}

            {(role === "candidate" || role === null) && (
              <Button 
                render={<Link href="/login" />}
                className="w-full justify-start rounded-full font-medium" 
                onClick={closeMenu}
              >
                <LogIn className="mr-2 h-4 w-4" />
                {tAuth("login")}
              </Button>
            )}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
