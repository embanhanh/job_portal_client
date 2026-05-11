import * as React from "react";
import { Container, Main, Section } from "@/components/craft";
import { ProfileHeader } from "./ProfileHeader";
import { ProfileNavigation } from "./ProfileNavigation";
import type { User } from "@/features/auth/types/auth.type";

interface ProfileLayoutProps {
  user: User;
  activeTab: string;
  children: React.ReactNode;
}

export function ProfileLayout({
  user,
  activeTab,
  children,
}: ProfileLayoutProps) {
  return (
    <Main className="bg-muted/30 min-h-screen">
      <Section className="py-8">
        <Container>
          <div className="flex flex-col gap-8">
            {/* Header Area */}
            <ProfileHeader user={user} />

            {/* Main Content Area: Sidebar + Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Sidebar: 3 cols on LG */}
              <aside className="lg:col-span-3 sticky top-24">
                <ProfileNavigation
                  activeTab={activeTab}
                  userRole={user?.role}
                />
              </aside>

              {/* Content: 9 cols on LG */}
              <div className="lg:col-span-9 min-h-[500px]">
                <div className="bg-white border rounded-xl shadow-sm p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
