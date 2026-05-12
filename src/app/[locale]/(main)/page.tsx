import { useTranslations } from "next-intl";
import { Briefcase, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Main, Section, Container } from "@/components/craft";
import { HomeSearch } from "@/features/jobs/components/HomeSearch";

export default function HomePage() {
  const t = useTranslations("hero");

  return (
    <Main>
      {/* ─── Hero Section ─── */}
      <Section className="relative overflow-hidden py-20 md:py-32">
        {/* Background decoration */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          aria-hidden="true"
        >
          <div className="absolute -top-24 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 right-0 h-[300px] w-[400px] rounded-full bg-primary/5 blur-2xl" />
        </div>

        <Container className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            JobPortal 2026
          </div>

          {/* Heading */}
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("welcome_title")}
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {t("welcome_desc")}
          </p>

          {/* Search Component */}
          <div className="mt-10 w-full">
            <HomeSearch />
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "10K+", label: "Việc làm" },
              { value: "5K+", label: "Công ty" },
              { value: "50K+", label: "Ứng viên" },
              { value: "98%", label: "Hài lòng" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── Trusted By Section ─── */}
      <Section className="py-12 bg-muted/30 border-y">
        <Container>
          <p className="text-center text-sm font-medium text-muted-foreground mb-8">
            Được tin tưởng bởi các công ty công nghệ hàng đầu
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholder for logos */}
            <div className="text-xl font-bold">Google</div>
            <div className="text-xl font-bold">Microsoft</div>
            <div className="text-xl font-bold">Amazon</div>
            <div className="text-xl font-bold">Meta</div>
            <div className="text-xl font-bold">Netflix</div>
          </div>
        </Container>
      </Section>

      {/* ─── Popular Categories Section ─── */}
      <Section className="py-20">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Ngành Nghề Nổi Bật</h2>
            <p className="text-muted-foreground">Khám phá các cơ hội nghề nghiệp theo ngành nghề phổ biến nhất</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Công Nghệ Thông Tin", count: "1,234", icon: "💻" },
              { title: "Marketing", count: "856", icon: "📈" },
              { title: "Thiết Kế", count: "642", icon: "🎨" },
              { title: "Kinh Doanh", count: "951", icon: "🤝" },
              { title: "Tài Chính", count: "432", icon: "💰" },
              { title: "Nhân Sự", count: "215", icon: "👥" },
              { title: "Giáo Dục", count: "348", icon: "📚" },
              { title: "Y Tế", count: "512", icon: "⚕️" },
            ].map((cat, i) => (
              <div key={i} className="p-6 rounded-2xl border bg-card hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{cat.title}</h3>
                <p className="text-sm text-muted-foreground">{cat.count} việc làm</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ─── Featured Jobs Section ─── */}
      <Section className="py-20 bg-muted/10">
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Việc Làm Nổi Bật</h2>
              <p className="text-muted-foreground">Các cơ hội hấp dẫn mới nhất dành cho bạn</p>
            </div>
            <Button variant="outline" className="hidden md:flex">Xem tất cả</Button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((job) => (
              <div key={job} className="p-6 rounded-2xl border bg-card flex gap-4 hover:border-primary hover:shadow-md transition-all">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                  <Briefcase className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary cursor-pointer">
                    Senior Fullstack Developer (React/Nodejs)
                  </h3>
                  <p className="text-primary font-medium mt-1">20,000,000 - 40,000,000 VND</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">Hồ Chí Minh</span>
                    <span className="px-2 py-1 bg-muted rounded-md text-xs font-medium">Remote</span>
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium">Full-time</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Button variant="outline" className="w-full">Xem tất cả việc làm</Button>
          </div>
        </Container>
      </Section>
    </Main>
  );
}
