# Active Context

## Current Focus
**Phase 2 — Multi-Role Architecture: ĐANG TRIỂN KHAI** 🚀
Dự án đã hoàn thành luồng xác thực (Login/Register) cho Public/Candidate. Đang tiến tới xây dựng giao diện và layout riêng cho từng Role.

---

## Tech Stack Thực Tế (Đã Cài Đặt)

| Package | Version | Ghi chú |
|---------|---------|---------|
| next | 16.2.4 | App Router, Turbopack |
| react | 19.2.4 | |
| react-dom | 19.2.4 | |
| tailwindcss | ^4 | CSS-first, không có tailwind.config.js |
| @tailwindcss/postcss | ^4 | PostCSS plugin |
| shadcn (base-nova) | 4.5.0 | Style: base-nova, Color: neutral |
| next-intl | ^4.9.1 | Middleware-based, sub-path routing |
| zustand | ^5.0.12 | Auth + Global UI state |
| @tanstack/react-query | ^5.100.5 | Server state caching |
| zod | ^4.3.6 | Schema validation |
| react-hook-form | ^7.74.0 | Form management |
| lucide-react | ^1.11.0 | Icon library |
| clsx | ^2.1.1 | Class utilities |
| tailwind-merge | ^3.5.0 | Class merging |
| tw-animate-css | ^1.4.0 | Animation utilities |
| class-variance-authority | ^0.7.1 | shadcn variants |
| sonner | ^2.0.1 | Toaster notifications |
| @base-ui/react | ^1.4.1 | Base UI primitives (shadcn dep) |
| babel-plugin-react-compiler | ^1.0.0 | React Compiler (dev) |

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

## Recent Changes (Phase 3 - API Layer)
- Cài đặt `axios` client với cấu hình chuẩn.
- Tách Endpoint constants theo domain vào `src/lib/api/endpoints`.
- Setup API Interceptor hỗ trợ tự động inject `accessToken` và Refresh Token Flow với request queue.
- Áp dụng pattern Service Layer gọi api độc lập khỏi UI.
- Tích hợp `react-query` làm source of truth cho Auth state (`useMe`).
- Sử dụng `zustand` chỉ cho `accessToken`.
- Bọc toàn bộ app với `QueryClientProvider`.
- Refactor `ClientHeaderActions` để dùng `useMe` (thay vì mock).
- Hoàn thiện luồng đăng nhập (LoginForm + useLogin).
- Hoàn thiện tính năng đăng ký ứng viên (RegisterForm + useRegister) với đầy đủ validation và i18n.
- Tích hợp `sonner` Toaster vào root layout (`position="top-right", richColors`).
- Cập nhật `types.ts`: `errors` trong `ApiError` và `ApiResponse` giờ là `Record<string, string[]>` đồng bộ với backend.
- Viết lại `LoginForm` và `RegisterForm` với pattern chuẩn:
  - `toast.error(apiError.message)` cho thông báo lỗi tổng quát.
  - `form.setError(field, { type: "server", message })` để map lỗi field-level từ backend.
  - `FormMessage` phân biệt lỗi server (hiển thị trực tiếp) vs lỗi Zod (qua `tCommon` i18n).
- Cập nhật `AGENTS.md` section 7 với protocol đầy đủ và code examples chuẩn.
- Đồng bộ giao diện (rounded-none, enterprise style) theo Stitch Design System.

---

## Architecture Decisions

- **Root Layout** (`src/app/[locale]/layout.tsx`): Đóng vai trò là Root Layout thực sự cho toàn bộ ứng dụng. Chịu trách nhiệm render thẻ `<html>`, `<body>`, set động `lang` attribute, import `globals.css` và bọc app với các Providers (`QueryClientProvider`, `NextIntlClientProvider`). File `src/app/layout.tsx` đã bị xóa để tránh xung đột.
- **Auth State Source of Truth**: Backend session `/auth/me` thông qua React Query là source of truth duy nhất.
- **Dark Mode**: Dùng `.dark` class toggle (shadcn default), không dùng `prefers-color-scheme` media query.
- **Color Space**: oklch (shadcn 4 default) — mọi màu HEX trong tokens cần convert sang oklch.
- **Role Guard Frontend**: Client Components (`ClientHeaderActions.tsx`) lấy Role từ `useMe()` (React Query) để render UI tương ứng.

---

## Files Quan Trọng

| File | Mục đích |
|------|----------|
| `src/app/globals.css` | Toàn bộ design tokens, shadcn variables, dark mode |
| `src/components/craft/index.tsx` | Semantic layout system |
| `src/components/shared/ClientHeaderActions.tsx` | Nút đăng nhập/điều hướng dựa trên Role (useMe) |
| `src/lib/api/interceptor.ts` | Xử lý Refresh Token Flow và đính kèm Bearer token |
| `src/features/auth/hooks/useMe.ts` | Hook lấy dữ liệu user hiện tại (Source of truth) |
| `src/providers/query-provider.tsx` | React Query provider wrapper |

---

## Next Steps
1. Xây dựng Layouts cho từng Role:
   - `(candidate)`: Top Navigation tinh tế.
   - `(employer)`: Sidebar chuyên nghiệp.
   - `(admin)`: Dashboard tối giản.
2. Cập nhật components navigation dựa theo auth state thật.
3. Bắt đầu Phase 3: Core Business (Job Management).

