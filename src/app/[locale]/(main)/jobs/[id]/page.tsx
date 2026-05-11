import { Metadata } from "next";
import { notFound } from "next/navigation";
import { jobService } from "@/services/job/job.service";

import { JobDetailContent } from "@/features/jobs/components/JobDetailContent";
import { BackButton } from "@/components/shared/BackButton";
import { getLocalizedValue } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, locale } = await params;
  try {
    const job = await jobService.getJobById(id);
    if (!job) return {};

    const title = getLocalizedValue(job.title, locale);
    const companyName = job.company.companyName;

    return {
      title: `${title} | ${companyName} | JobPortal`,
      description: getLocalizedValue(job.description, locale).substring(0, 160),
    };
  } catch (error) {
    return {
      title: "Job Details | JobPortal",
    };
  }
}

export default async function JobDetailPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("common");

  // Next.js will automatically handle errors and notFound calls
  const job = await jobService.getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="bg-slate-50/50 min-h-screen py-8 md:py-12">
      <div className="container max-w-7xl mx-auto px-4">
        <BackButton>{t("back")}</BackButton>
        <JobDetailContent job={job} />
      </div>
    </div>
  );
}
