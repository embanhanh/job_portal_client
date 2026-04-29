# Progress — Recruitment Platform

## ✅ Completed

### Phase 1: Foundation Setup (2026-04-27)

#### Dependencies
- [x] Production: next-intl ^4.9.1, zustand ^5.0.12, @tanstack/react-query ^5.100.5, zod ^4.3.6, react-hook-form ^7.74.0, lucide-react ^1.11.0, clsx, tailwind-merge, tw-animate-css, class-variance-authority, @base-ui/react
- [x] Dev: babel-plugin-react-compiler ^1.0.0

#### Configuration
- [x] shadcn/ui initialized (style: base-nova, color: neutral, Tailwind 4 compatible)
- [x] Core shadcn components: button, input, card, badge, dialog, dropdown-menu
- [x] React Compiler enabled (`next.config.ts`)
- [x] next-intl plugin integrated (`next.config.ts` → `src/i18n/request.ts`)
- [x] tsconfig.json paths updated: `@/*` → `./src/*`
- [x] postcss.config.mjs: `@tailwindcss/postcss` (Tailwind 4, không dùng tailwind.config.js)

#### Folder Structure
- [x] Migrated `app/` → `src/app/`
- [x] Feature-based: `src/features/{auth,jobs,candidate,employer}/`
- [x] Shared: `src/components/{ui,craft}/`, `src/hooks/`, `src/lib/`, `src/utils/`
- [x] i18n: `src/i18n/`
- [x] Context: `.context/`

#### Design System
- [x] `src/app/globals.css` — Professional tokens (Primary: #FECE14/oklch, Radius: 0.5rem, Fonts: Poppins + IBM Plex Mono)
- [x] Light + Dark mode variables
- [x] shadcn CSS variables mapped to Tailwind @theme

#### Craft Layout System
- [x] `src/components/craft/index.tsx`: Main, Section, Container, Grid

#### Internationalization
- [x] `src/i18n/routing.ts` — locales: ["vi", "en"], default: "vi"
- [x] `src/i18n/request.ts` — server-side message loader
- [x] `src/middleware.ts` — next-intl routing middleware
- [x] `messages/vi.json` — hero.{welcome_title, welcome_desc, find_job, post_job}, metadata.{title, description}
- [x] `messages/en.json` — same keys, English

#### Pages & Layouts
- [x] `src/app/layout.tsx` — Minimal root (pass-through, imports globals.css)
- [x] `src/app/[locale]/layout.tsx` — Poppins + IBM Plex Mono fonts, NextIntlClientProvider, generateMetadata, generateStaticParams
- [x] `src/app/[locale]/page.tsx` — Hero Section (Craft + shadcn Button + Lucide icons + stats)

#### Documentation & Context
- [x] `README.md` — Full project documentation
- [x] `AGENTS.md` — Updated với exact versions và tech stack thực tế
- [x] `.context/activeContext.md` — Active context với tech stack thực tế
- [x] `.context/progress.md` — Progress tracker này
- [x] `.context/systemPatterns.md` — Architecture patterns & conventions

#### Verification
- [x] TypeScript: 0 errors (`tsc --noEmit`)
- [x] Dev server: 223ms startup (Turbopack)
- [x] `GET /vi` → 200, "Kết nối tài năng với cơ hội nghề nghiệp"
- [x] `GET /en` → 200, "Connect talent with career opportunities"
- [x] Auto-redirect `/` → `/vi` ✓

---

## 🔲 Pending

### Phase 2: Multi-Role Architecture
- [x] Route group `(public)` — `src/app/[locale]/(public)/`
  - [x] `layout.tsx` — Global Header (Sticky & Smart), Footer (Multi-column)
  - [x] `Header.tsx`, `ClientHeaderActions.tsx`, `MobileMenu.tsx`, `Footer.tsx`
  - [x] `QuickSearch.tsx` — Tích hợp giữa Header
  - [x] `template.tsx` — Page transitions (Fade + Slide)
  - [x] Type checking & Lucide icon fallbacks fixed ✅
- [ ] Route group `(candidate)` — `src/app/[locale]/(candidate)/`
  - [ ] `layout.tsx` — Top Navigation, radius override 0.75rem
  - [ ] `error.tsx`
- [ ] Route group `(employer)` — `src/app/[locale]/(employer)/`
  - [ ] `layout.tsx` — Sidebar Navigation
  - [ ] `error.tsx`
- [ ] Route group `(admin)` — `src/app/[locale]/(admin)/`
  - [ ] `layout.tsx` — Minimal Dashboard
  - [ ] `error.tsx`
- [x] Auth middleware (role-gating, kiểm tra `user.role` qua cookie)

### Phase 3: Feature Modules
- [x] **API Layer & Architecture Core**
  - [x] Axios Client & Interceptors (Token + Refresh Flow)
  - [x] React Query Provider + `useMe` làm Source of Truth cho Auth
  - [x] Service Layer cho `auth`, `job`, `user`
  - [x] Zustand store cho Access Token
- [x] **Auth** (`src/features/auth/`)
  - [x] Login page + Client Form (zod validation, React Query)
  - [x] Register page + Client Form (zod validation, React Query)
  - [ ] Forgot password
- [ ] **Jobs** (`src/features/jobs/`)
  - [ ] Job listing (PPR enabled)
  - [ ] Job detail
  - [ ] Search & Filter
- [ ] **Candidate** (`src/features/candidate/`)
  - [ ] Profile page
  - [ ] Applications list (useOptimistic)
  - [ ] Saved jobs
- [ ] **Employer** (`src/features/employer/`)
  - [ ] Dashboard
  - [ ] Job posting form
  - [ ] Applicant management

### Phase 4: Polish & SEO
- [ ] `generateMetadata` cho tất cả trang Candidate
- [ ] `not-found.tsx` per route group
- [ ] `loading.tsx` với Suspense boundaries
- [ ] OG images
- [ ] sitemap.xml
