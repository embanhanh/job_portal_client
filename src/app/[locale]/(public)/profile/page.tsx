"use client";

import { useTranslations } from "next-intl";
import { User, Building2, Settings, History } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Main, Section, Container } from "@/components/craft";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMe } from "@/features/auth/hooks/useMe";
import { useMyCompany } from "@/features/company/hooks/useCompany";
import { CompanyStatus } from "@/features/company/enums/company.enum";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProfilePage() {
  const t = useTranslations("company.registration");
  const { data: user } = useMe();
  const { data: company } = useMyCompany();
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") || "info";

  return (
    <Main>
      <Section>
        <Container>
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold Poppins">{user?.fullName}</h1>
                <p className="text-muted-foreground">{user?.email}</p>
                <Badge variant="secondary" className="mt-2 capitalize">
                  {user?.role}
                </Badge>
              </div>
            </div>

            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-8">
                <TabsTrigger
                  value="info"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 px-2"
                >
                  <User className="mr-2 h-4 w-4" />
                  Thông tin cá nhân
                </TabsTrigger>
                {(user?.role === "candidate" || user?.role === "employer") && (
                  <TabsTrigger
                    value="company"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 px-2"
                  >
                    <Building2 className="mr-2 h-4 w-4" />
                    Quản lý doanh nghiệp
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="settings"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent pb-4 px-2"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Họ và tên
                        </p>
                        <p>{user?.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Số điện thoại
                        </p>
                        <p>{user?.phone || "Chưa cập nhật"}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="company" className="pt-6">
                {company ? (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-2xl font-bold Poppins">
                          {company.companyName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {company.industry}
                        </p>
                      </div>
                      <Badge
                        className={cn("px-4 py-1", {
                          "bg-yellow-100 text-yellow-700 hover:bg-yellow-100":
                            company.status === CompanyStatus.PENDING,
                          "bg-green-100 text-green-700 hover:bg-green-100":
                            company.status === CompanyStatus.APPROVED,
                          "bg-red-100 text-red-700 hover:bg-red-100":
                            company.status === CompanyStatus.REJECTED,
                        })}
                      >
                        {company.status.toUpperCase()}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Website
                          </p>
                          <a
                            href={company.website || "#"}
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            {company.website || "N/A"}
                          </a>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            Địa chỉ
                          </p>
                          <p>{company.address || "N/A"}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground uppercase text-[10px] tracking-wider">
                          Giới thiệu (Tiếng Việt)
                        </p>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {company.description.vi}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto" />
                    <p className="text-muted-foreground">
                      Bạn chưa đăng ký doanh nghiệp nào.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
