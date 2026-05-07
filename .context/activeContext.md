# Active Context

## Current Focus

**Phase 2 — Multi-Role Architecture: ĐANG TRIỂN KHAI** 🚀
Dự án đã hoàn thành luồng xác thực và hạ tầng Header được module hóa hoàn toàn (LocaleSwitcher, UserAccountMenu). Đang tiến tới xây dựng giao diện và layout riêng cho từng Role.

---

## Tech Stack Thực Tế (Đã Cài Đặt)

| Package                     | Version  | Ghi chú                                |
| --------------------------- | -------- | -------------------------------------- |
| next                        | 16.2.4   | App Router, Turbopack                  |
| react                       | 19.2.4   |                                        |
| react-dom                   | 19.2.4   |                                        |
| tailwindcss                 | ^4       | CSS-first, không có tailwind.config.js |
| @tailwindcss/postcss        | ^4       | PostCSS plugin                         |
| shadcn (base-nova)          | 4.5.0    | Style: base-nova, Color: neutral       |
| next-intl                   | ^4.9.1   | Middleware-based, sub-path routing     |
| zustand                     | ^5.0.12  | Auth + Global UI state                 |
| @tanstack/react-query       | ^5.100.5 | Server state caching                   |
| zod                         | ^4.3.6   | Schema validation                      |
| react-hook-form             | ^7.74.0  | Form management                        |
| lucide-react                | ^1.11.0  | Icon library                           |
| clsx                        | ^2.1.1   | Class utilities                        |
| tailwind-merge              | ^3.5.0   | Class merging                          |
| tw-animate-css              | ^1.4.0   | Animation utilities                    |
| class-variance-authority    | ^0.7.1   | shadcn variants                        |
| sonner                      | ^2.0.1   | Toaster notifications                  |
| @base-ui/react              | ^1.4.1   | Base UI primitives (shadcn dep)        |
| babel-plugin-react-compiler | ^1.0.0   | React Compiler (dev)                   |

---

## Cấu Hình Thực Tế

### Path Alias

```json
"@/*" → "./src/*"
```

### shadcn/ui

- Style: `base-nova`
- CSS file: `src/app/globals.css`
- Base color: `neutral`
- Aliases: `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`

### i18n

- Locales: `["vi", "en"]`
- Default: `"vi"`
- Pattern: sub-path (`/vi/...`, `/en/...`)
- Config: `src/i18n/routing.ts`, `src/i18n/request.ts`
- Middleware: `src/middleware.ts`
- Messages: `messages/vi.json`, `messages/en.json`

### Design Tokens (globals.css)

- Primary: `oklch(0.873 0.176 86.3)` ≈ `#FECE14`
- Radius base: `0.5rem`
- Fonts: Poppins (primary), IBM Plex Mono (mono)
- Dark mode: `.dark` class toggle

---

## Recent Changes

- [x] **Phase 1: API Layer & Types**
  - [x] Define `companyEndpoints` & Register in `endpoints/index.ts`
  - [x] Create `Company` interfaces & `CompanyStatus` enum
  - [x] Implement `companyService` with FormData serialization
- [x] **Phase 2: Business Logic (Hooks & Schemas)**
  - [x] Create `companySchema` (Zod) with i18n support
  - [x] Implement `useMyCompany`, `useCreateCompany` hooks
- [x] **Phase 3: UI Components (Atomic & Clean)**
  - [x] Create `CompanyFileUpload.tsx` (Logo/License)
  - [x] Create `CompanyGeneralInfo.tsx`
  - [x] Implement `EmployerRegistrationForm.tsx` (Multilingual support)
- [x] **Phase 4: Routing & Integration**
  - [x] Create `/employer-registration` page with guard logic
  - [x] Update `ClientHeaderActions.tsx` (User Menu & Locale Switcher)
  - [x] Create/Update `/profile` page with Company tab
- [ ] **Phase 5: Refinement & Testing**
  - [ ] Manual testing for file uploads
  - [ ] Verify i18n description serialization

---

## Architecture Decisions

- **Root Layout** (`src/app/[locale]/layout.tsx`): Đóng vai trò là Root Layout thực sự cho toàn bộ ứng dụng. Chịu trách nhiệm render thẻ `<html>`, `<body>`, set động `lang` attribute, import `globals.css` và bọc app với các Providers (`QueryClientProvider`, `NextIntlClientProvider`). File `src/app/layout.tsx` đã bị xóa để tránh xung đột.
- **Auth State Source of Truth**: Backend session `/auth/me` thông qua React Query là source of truth duy nhất.
- **Dark Mode**: Dùng `.dark` class toggle (shadcn default), không dùng `prefers-color-scheme` media query.
- **Color Space**: oklch (shadcn 4 default) — mọi màu HEX trong tokens cần convert sang oklch.
- **Role Guard Frontend**: Client Components (`ClientHeaderActions.tsx`) lấy Role từ `useMe()` (React Query) để render UI tương ứng.

---

## Files Quan Trọng

| File                                            | Mục đích                                           |
| ----------------------------------------------- | -------------------------------------------------- |
| `src/app/globals.css`                           | Toàn bộ design tokens, shadcn variables, dark mode |
| `src/components/layout/header/ClientHeaderActions.tsx` | Nút đăng nhập/điều hướng, User Menu, Locale Switcher |
| `src/components/layout/header/LocaleSwitcher.tsx` | Component chuyển đổi ngôn ngữ (VI/EN) |
| `src/components/layout/header/UserAccountMenu.tsx` | Component menu tài khoản người dùng |
| `src/lib/api/interceptor.ts`                    | Xử lý Refresh Token Flow và đính kèm Bearer token  |
| `src/features/auth/hooks/useMe.ts`              | Hook lấy dữ liệu user hiện tại (Source of truth)   |
| `src/providers/query-provider.tsx`              | React Query provider wrapper                       |

---

## Next Steps

1. Xây dựng Layouts cho từng Role:
   - `(public)`: Top Navigation tinh tế.
   - `(employer)`: Sidebar chuyên nghiệp.
   - `(admin)`: Dashboard tối giản.
2. Cập nhật components navigation dựa theo auth state thật.
3. Bắt đầu Phase 3: Core Business (Job Management).
