# Active Context

## Current Focus
**Phase 1 — Foundation Setup: HOÀN TẤT** ✅
Dự án đã sẵn sàng cho Phase 2: Multi-Role Architecture.

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

## Recent Changes (Phase 1)
- Cài đặt toàn bộ production + dev dependencies
- Di chuyển `app/` → `src/app/`
- Cập nhật tsconfig paths: `@/*` → `./src/*`
- Khởi tạo shadcn/ui (base-nova, Tailwind 4 compatible)
- Cài shadcn components: button, input, card, badge, dialog, dropdown-menu
- Tạo `globals.css` với Professional design tokens (oklch)
- Tạo Craft layout system: `Main`, `Section`, `Container`, `Grid`
- Tạo i18n: `routing.ts`, `request.ts`, `middleware.ts`
- Tạo messages: `vi.json`, `en.json`
- Tạo `[locale]/layout.tsx` (Poppins + IBM Plex Mono + NextIntlClientProvider)
- Tạo `[locale]/page.tsx` (Hero Section)
- Bật React Compiler trong `next.config.ts`
- Tạo `README.md`

---

## Architecture Decisions

- **Root Layout** (`src/app/layout.tsx`): Pass-through — chỉ import globals.css. Locale layout chịu trách nhiệm `<html>` và `<body>` để động hoá `lang` attribute.
- **Dark Mode**: Dùng `.dark` class toggle (shadcn default), không dùng `prefers-color-scheme` media query.
- **Color Space**: oklch (shadcn 4 default) — mọi màu HEX trong tokens cần convert sang oklch.
- **Middleware deprecation**: Next.js 16 deprecated `middleware.ts` → `proxy.ts` nhưng next-intl 4.x vẫn dùng `middleware.ts`. Hoạt động bình thường, chờ next-intl cập nhật.

---

## Files Quan Trọng

| File | Mục đích |
|------|----------|
| `src/app/globals.css` | Toàn bộ design tokens, shadcn variables, dark mode |
| `src/components/craft/index.tsx` | Semantic layout system |
| `src/i18n/routing.ts` | Locale config |
| `src/i18n/request.ts` | Server message loader |
| `src/middleware.ts` | i18n routing middleware |
| `messages/vi.json` | Vietnamese translations |
| `messages/en.json` | English translations |
| `next.config.ts` | React Compiler + next-intl plugin |
| `components.json` | shadcn/ui config |

---

## Next Steps (Phase 2)
1. Tạo route groups: `(candidate)`, `(employer)`, `(admin)` trong `src/app/[locale]/`
2. Tạo layouts riêng cho từng role (Top Nav / Sidebar / Dashboard)
3. Implement auth feature module (`src/features/auth/`)
4. Thiết kế Navigation components
5. Tạo `error.tsx` cho từng route group
