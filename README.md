# 🚀 JobPortal — Nền tảng tuyển dụng chuyên nghiệp

> Production-ready Recruitment Platform xây dựng trên Next.js 16, React 19, Tailwind CSS 4.1 và shadcn/ui — phục vụ 3 vai trò: **Candidate**, **Employer**, **Admin**.

---

## 📋 Tổng quan

JobPortal là nền tảng tuyển dụng đa vai trò được thiết kế theo tiêu chuẩn "Bleeding Edge 2026":

- **Candidate**: Tìm kiếm & ứng tuyển việc làm
- **Employer**: Đăng tin & quản lý ứng viên
- **Admin**: Quản trị toàn hệ thống

---

## 🛠 Tech Stack

| Layer        | Technology                         | Version |
| ------------ | ---------------------------------- | ------- |
| Framework    | Next.js (App Router + Turbopack)   | 16.2.4  |
| UI Library   | React                              | 19.2.4  |
| Styling      | Tailwind CSS (CSS-first, `@theme`) | 4.x     |
| Components   | shadcn/ui (base-nova style)        | 4.5.0   |
| Icons        | Lucide React                       | 1.11.0  |
| State        | Zustand                            | 5.0.12  |
| Server State | TanStack Query                     | v5      |
| Forms        | React Hook Form                    | 7.74.0  |
| Validation   | Zod                                | 4.3.6   |
| i18n         | next-intl                          | 4.9.1   |
| Optimizer    | React Compiler (babel-plugin)      | 1.0.0   |
| Language     | TypeScript                         | 5.x     |

---

## 🗂 Cấu trúc dự án

```
job-portal/
├── src/
│   ├── app/
│   │   ├── globals.css              # Design tokens (@theme)
│   │   ├── layout.tsx               # Root layout (pass-through)
│   │   └── [locale]/
│   │       ├── layout.tsx           # Locale layout (fonts + i18n)
│   │       └── page.tsx             # Hero landing page
│   │
│   ├── components/
│   │   ├── ui/                      # shadcn/ui atoms
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── dropdown-menu.tsx
│   │   └── craft/
│   │       └── index.tsx            # Semantic layout: Main, Section, Container, Grid
│   │
│   ├── features/                    # Feature-based modules (encapsulated)
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── schemas/
│   │   │   ├── types/
│   │   │   ├── enums/
│   │   │   ├── constants/
│   │   ├── jobs/
│   │   ├── company/
│   │   └── profile/
│   │
│   ├── i18n/
│   │   ├── routing.ts               # Locale config (vi, en)
│   │   └── request.ts               # Server-side message loader
│   │
│   ├── hooks/                       # Custom hooks
│   ├── lib/
│   │   └── utils.ts                 # cn() helper
│   ├── utils/                       # Shared utilities
│   ├── middleware.ts                # next-intl routing middleware
│   └── services/
│       ├── auth
│       ├── jobs
│       ├── company
│       └── user
│
├── messages/
│   ├── vi.json                      # Vietnamese translations
│   └── en.json                      # English translations
│
├── .context/                        # AI Agent memory bank
│   ├── activeContext.md             # Current task focus
│   ├── progress.md                  # Project progress tracker
│   └── systemPatterns.md            # Architecture patterns & conventions
│
│
├── public/                          # Static assets
├── components.json                  # shadcn/ui config
├── next.config.ts                   # Next.js + next-intl + React Compiler
├── tsconfig.json                    # TypeScript (paths: @/* → src/*)
└── postcss.config.mjs               # Tailwind CSS 4 PostCSS plugin
```

---

## 🎨 Design System

### Colors (oklch)

| Token         | Value                   | Dùng cho              |
| ------------- | ----------------------- | --------------------- |
| `--primary`   | `#FECE14` (Yellow-Gold) | CTA, highlight        |
| `--secondary` | `#000000`               | Text chính            |
| `--success`   | `#16A34A`               | Trạng thái thành công |
| `--warning`   | `#D97706`               | Cảnh báo              |
| `--danger`    | `#DC2626`               | Lỗi / huỷ             |

### Typography

- **Primary/Display**: Poppins (300–800)
- **Monospace**: IBM Plex Mono (400–600)

### Radius

- Employer / Admin: `0.5rem` (base)
- Candidate: `0.75rem` (large — sẽ override tại route group)

---

## 🌐 Internationalization

| Locale     | URL       | Default |
| ---------- | --------- | ------- |
| Tiếng Việt | `/vi/...` | ✅      |
| English    | `/en/...` |         |

Auto-redirect: `/` → `/vi`

---

## 🚀 Khởi động nhanh

```bash
# Cài dependencies
npm install

# Chạy dev server (Turbopack)
npm run dev
# → http://localhost:3000  (redirect tới /vi)

# Type check
npx tsc --noEmit

# Build production
npm run build
```

---

## 🏗 Kiến trúc multi-role (Đang phát triển)

```
src/app/[locale]/
├── (candidate)/        # Top Navigation — "Refined" typography
├── (employer)/         # Sidebar — "Enterprise" data-heavy
└── (admin)/            # Dashboard — High density
```

Role-gating thực hiện tại middleware, kiểm tra `user.role` từ backend.

---

## 📐 Craft Layout System

```tsx
import { Main, Section, Container, Grid } from "@/components/craft";

<Main>
  <Section>
    <Container>
      <Grid cols={3}>{children}</Grid>
    </Container>
  </Section>
</Main>;
```

---

## 🤖 AI Agent Context (`.context/`)

Hệ thống Memory Bank cho AI agents. **Bắt buộc đọc trước khi code:**

- [`activeContext.md`](./.context/activeContext.md) — Task đang làm dở
- [`progress.md`](./.context/progress.md) — Tiến độ tổng thể
- [`systemPatterns.md`](./.context/systemPatterns.md) — Patterns & conventions

---

## 📚 Quy tắc phát triển

- ❌ Không dùng `useMemo`, `useCallback`, `React.memo` (React Compiler lo)
- ❌ Không hardcode text — dùng `t('namespace.key')`
- ❌ Không thêm màu HEX mới — chỉ dùng tokens trong `@theme`
- ✅ Server Components mặc định — `'use client'` chỉ khi cần interactivity
- ✅ Validate input bằng `zod` trong mọi Server Action
- ✅ `generateMetadata` cho tất cả trang Candidate
