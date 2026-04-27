# System Patterns & Conventions

> File này ghi lại các quyết định kiến trúc, patterns, và conventions của dự án.
> Agent PHẢI đọc file này trước khi tạo bất kỳ component hoặc feature mới nào.

---

## 1. Import Conventions

### Path Alias
```typescript
// ✅ Đúng — dùng alias
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ❌ Sai — relative paths
import { Button } from "../../components/ui/button";
```

### Import trực tiếp (bundle-barrel-imports)
```typescript
// ✅ Đúng — import thẳng
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// ❌ Sai — barrel file
import { Button, Card } from "@/components/ui";
```

---

## 2. Component Patterns

### Server Components (RSC) — Default
```typescript
// ✅ Không cần directive, mặc định là RSC
export default function MyComponent() {
  return <div>...</div>;
}
```

### Client Components — Chỉ khi cần
```typescript
"use client";

// Dùng khi: useState, useEffect, event handlers, browser APIs
export function InteractiveComponent() { ... }
```

### Không dùng manual memo
```typescript
// ❌ Cấm — React Compiler lo
const memoized = useMemo(() => expensive(), [dep]);
const cb = useCallback(() => {}, []);
const Comp = React.memo(MyComp);

// ✅ Viết bình thường, React Compiler tự tối ưu
const result = expensive();
```

---

## 3. Styling Conventions

### Tailwind CSS 4.1 — CSS-first
- Không có `tailwind.config.js`
- Tất cả tokens trong `src/app/globals.css` → `@theme inline {}`
- Dark mode: `.dark` class (class-based, không phải media query)

### Class utility
```typescript
// cn() được phép dùng trong shadcn components
import { cn } from "@/lib/utils";
className={cn("base-class", conditional && "extra-class")}

// Với components thường — ưu tiên string template
className={`base-class ${conditional ? "extra" : ""}`}
```

### Màu sắc — Chỉ dùng tokens
```typescript
// ✅ Tokens từ @theme
className="bg-primary text-primary-foreground"
className="text-muted-foreground"
className="border-border"

// ❌ Cấm HEX cứng
className="bg-[#FECE14]"
style={{ color: "#000" }}
```

---

## 4. i18n Conventions

### Không hardcode text
```typescript
// ✅ Đúng
const t = useTranslations("hero");
<h1>{t("welcome_title")}</h1>

// ❌ Cấm
<h1>Kết nối tài năng với cơ hội</h1>
<h1>Connect talent with opportunities</h1>
```

### Server Component i18n
```typescript
// RSC — dùng getTranslations
import { getTranslations } from "next-intl/server";
const t = await getTranslations("namespace");
```

### Client Component i18n
```typescript
"use client";
import { useTranslations } from "next-intl";
const t = useTranslations("namespace");
```

### Thêm key mới
1. Thêm vào `messages/vi.json`
2. Thêm vào `messages/en.json`
3. Sử dụng `t("namespace.key")`

---

## 5. Form Conventions

```typescript
// ✅ React Hook Form + Zod + useActionState
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

// Server Action luôn validate với Zod
async function loginAction(prevState: unknown, formData: FormData) {
  const result = schema.safeParse(Object.fromEntries(formData));
  if (!result.success) return { error: result.error.flatten() };
  // ...
}
```

---

## 6. Craft Layout System

```typescript
import { Main, Section, Container, Grid } from "@/components/craft";

// Cấu trúc chuẩn
<Main>
  <Section>                     {/* py-12 md:py-24 */}
    <Container>                 {/* max-w-7xl mx-auto px-4 md:px-6 */}
      <Grid cols={3} gap={6}>  {/* responsive grid */}
        {items.map(...)}
      </Grid>
    </Container>
  </Section>
</Main>
```

---

## 7. SEO & Metadata

```typescript
// ✅ Bắt buộc cho trang Candidate
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("title"),
    description: t("description"),
  };
}
```

---

## 8. Error Handling

```typescript
// ✅ Mỗi route group có error.tsx riêng
// src/app/[locale]/(candidate)/error.tsx
"use client";
export default function CandidateError({ error, reset }: { error: Error; reset: () => void }) { ... }

// ❌ Cấm try-catch rỗng
try { ... } catch (e) {} // KHÔNG
```

---

## 9. Role-Based Routing Structure (Kế hoạch Phase 2)

```
src/app/[locale]/
├── (candidate)/            radius: 0.75rem, Top Navigation
│   ├── layout.tsx
│   ├── error.tsx
│   ├── jobs/
│   └── profile/
├── (employer)/             radius: 0.5rem, Sidebar Navigation
│   ├── layout.tsx
│   ├── error.tsx
│   └── dashboard/
└── (admin)/                radius: 0.5rem, Minimal Dashboard
    ├── layout.tsx
    ├── error.tsx
    └── users/
```

---

## 10. Zustand Store Pattern

```typescript
// src/features/auth/store/auth.store.ts
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

---

## 11. TanStack Query Pattern

```typescript
// src/features/jobs/hooks/use-jobs.ts
import { useQuery } from "@tanstack/react-query";

export function useJobs(filters: JobFilters) {
  return useQuery({
    queryKey: ["jobs", filters],
    queryFn: () => fetchJobs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

---

## 12. Naming Conventions

| Loại | Pattern | Ví dụ |
|------|---------|-------|
| Components | PascalCase | `JobCard.tsx`, `HeroSection.tsx` |
| Hooks | camelCase với `use` | `useJobFilters.ts` |
| Stores | camelCase với `.store` | `auth.store.ts` |
| Types | PascalCase với `Type`/`Interface` | `JobType`, `UserInterface` |
| Utils | camelCase | `formatDate.ts` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_JOBS_PER_PAGE` |
| i18n keys | snake_case | `welcome_title`, `find_job` |
