import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { JobSearchForm } from "@/features/jobs/components/JobSearchForm";
import { JobFilterSidebar } from "@/features/jobs/components/filters";
import { JobCard } from "@/features/jobs/components/JobCard";
import { JobPagination } from "@/features/jobs/components/JobPagination";
import { jobService } from "@/services/job/job.service";
import { JobFilter } from "@/features/jobs/types/job.type";
import { SearchX } from "lucide-react";
import { Container } from "@/components/craft";
import { JobType } from "@/features/jobs/enums/job.enum";

interface JobsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title", { fallback: "Việc làm IT | JobPortal" }),
    description: t("description", {
      fallback: "Tìm kiếm hàng nghìn việc làm IT hấp dẫn",
    }),
  };
}

export default async function JobsPage({
  params,
  searchParams,
}: JobsPageProps) {
  const { locale } = await params;
  const sp = await searchParams;
  const t = await getTranslations({ locale, namespace: "jobs.results" });

  const parseJobType = (value?: string): JobType | undefined => {
    if (!value) return undefined;
    return Object.values(JobType).includes(value as JobType)
      ? (value as JobType)
      : undefined;
  };

  // Parse filters from URL
  const filters: JobFilter = {
    page: Number(sp.page) || 1,
    limit: 10,
    q: sp.q || undefined,
    categoryId: sp.categoryId || undefined,
    locationId: sp.locationId || undefined,
    type: parseJobType(sp.type),
    salaryMin: sp.salaryMin ? Number(sp.salaryMin) : undefined,
    salaryMax: sp.salaryMax ? Number(sp.salaryMax) : undefined,
  };

  let data = null;
  let isError = false;

  try {
    data = await jobService.getJobs(filters);
  } catch (err) {
    isError = true;
    console.error("Error fetching jobs on server:", err);
  }

  return (
    <div className="bg-slate-50/50 min-h-screen">
      {/* Search Header Section */}
      <div className="bg-white border-b py-12 px-4">
        <div className="container max-w-7xl mx-auto space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              {t("found", { count: data?.meta?.totalItems || 0 })}
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl">
              {t("subtitle")}
            </p>
          </div>
          <div>
            <Suspense
              fallback={
                <div className="h-14 bg-muted animate-pulse rounded-lg" />
              }
            >
              <JobSearchForm />
            </Suspense>
          </div>
        </div>
      </div>

      <Container className="py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-[280px] shrink-0 bg-white p-6 rounded-2xl border shadow-sm h-fit sticky top-24">
            <Suspense
              fallback={
                <div className="h-96 bg-muted animate-pulse rounded-lg" />
              }
            >
              <JobFilterSidebar />
            </Suspense>
          </aside>

          {/* Main Results Area */}
          <main className="flex-1 space-y-6">
            {isError ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-destructive/30">
                <p className="text-destructive font-bold text-lg">
                  {t("error")}
                </p>
              </div>
            ) : data?.data.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-dashed space-y-4">
                <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <SearchX className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{t("empty_title")}</h3>
                  <p className="text-muted-foreground">{t("empty_desc")}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {data?.data.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>

                {data?.meta && data.meta.totalPages > 1 && (
                  <JobPagination
                    currentPage={data.meta.page}
                    lastPage={data.meta.totalPages}
                  />
                )}
              </div>
            )}
          </main>
        </div>
      </Container>
    </div>
  );
}
