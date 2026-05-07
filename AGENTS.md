# 🚀 Antigravity 2026: Recruitment System Protocol

## 1. Tech Stack & "Bleeding Edge" Standards

| Layer        | Technology                                                     | Version           |
| ------------ | -------------------------------------------------------------- | ----------------- |
| Framework    | Next.js (App Router, Turbopack)                                | **16.2.4**        |
| UI Library   | React                                                          | **19.2.4**        |
| Compiler     | React Compiler (`babel-plugin-react-compiler`)                 | **1.0.0**         |
| Styling      | Tailwind CSS 4.x (CSS-first, `@theme` driven)                  | **^4**            |
| Components   | shadcn/ui (style: `base-nova`, color: `neutral`)               | **4.5.0**         |
| Icons        | Lucide React                                                   | **^1.11.0**       |
| State        | Zustand                                                        | **^5.0.12**       |
| Server State | TanStack Query                                                 | **v5 (^5.100.5)** |
| Forms        | React Hook Form                                                | **^7.74.0**       |
| Validation   | Zod                                                            | **^4.3.6**        |
| i18n         | next-intl                                                      | **^4.9.1**        |
| Utilities    | clsx, tailwind-merge, tw-animate-css, class-variance-authority | latest            |
| Language     | TypeScript                                                     | **^5**            |

### React 19 Rules

- **No Manual Memo:** Cấm sử dụng `useMemo`, `useCallback`, `React.memo` (React Compiler tự xử lý).
- **Actions-First:** Sử dụng `useActionState` cho Form, `useOptimistic` cho các tương tác Like/Apply.

---

## 2. Multi-Role Architecture (Crucial)

Dự án có 3 vai trò: **Candidate**, **Employer**, **Admin**.

- **Shared UI:** `src/components/ui` (shadcn atoms — trung tính, không lệch theme).
- **Craft Layout:** `src/components/craft` — Main, Section, Container, Grid.
- **Role Layouts:**
  - `(candidate)/*`: Top Navigation, phong cách "Refined" (Typography cao cấp).
  - `(employer)/*`: Sidebar Navigation, phong cách "Enterprise" (Data-heavy).
  - `(admin)/*`: Dashboard tối giản, mật độ thông tin cao.
- **Role-Gating:** Mọi Route trong nhóm vai trò phải được bảo vệ bởi Middleware và kiểm tra `user.role` từ backend.

---

## 3. Design System (Professional Skill)

- **Base Skill:** "Professional" — Poppins font, Yellow-Gold primary.
- **Consistency:**
  - Bán kính bo góc: `0.5rem` (base, Employer/Admin), `0.75rem` (override cho Candidate).
  - Bảng màu: Chỉ dùng tokens từ `@theme` trong `src/app/globals.css`.
  - Dark mode: `.dark` class toggle (shadcn convention).
- **Constraint:** Agent không được phép tự ý thêm màu HEX mới. Chỉ dùng màu từ hệ thống `@theme`.
- **Color Space:** oklch (shadcn 4 default) — convert HEX sang oklch trước khi thêm vào theme.

### Design Tokens Hiện Tại

| Token        | oklch                     | HEX tham khảo |
| ------------ | ------------------------- | ------------- |
| `--primary`  | `oklch(0.873 0.176 86.3)` | `#FECE14`     |
| `--radius`   | `0.5rem`                  | —             |
| Font primary | Poppins                   | —             |
| Font mono    | IBM Plex Mono             | —             |

---

## 4. Vibe Coding Workflow (Memory Bank Protocol)

### Context Files (BẮT BUỘC đọc trước khi code)

Agent PHẢI đọc theo thứ tự:

1. **`.context/activeContext.md`** — Task đang làm dở, tech stack thực tế, files quan trọng.
2. **`.context/progress.md`** — Tiến độ tổng thể, những gì đã done/pending.
3. **`.context/systemPatterns.md`** — Patterns, conventions, code examples chuẩn.

### Mandatory Update

Sau khi hoàn thành một Task, Agent **PHẢI** tự động cập nhật:

- `progress.md` — Đánh dấu items completed, thêm items mới nếu có.
- `activeContext.md` — Cập nhật "Current Focus" và "Recent Changes".

### Artifacts First

Luôn mô tả cấu trúc File và Data Flow trong Implementation Plan trước khi gõ code.

---

## 5. Coding Standards (2026 Optimized)

- **Server Components (RSC):** Mặc định mọi component là Server Component. Chỉ dùng `'use client'` khi thực sự cần Interactivity.
- **I18n:** Cấm hardcode text Việt/Anh. Luôn dùng `t('namespace.key')`. Nếu key chưa có, tự đề xuất key vào file messages JSON.
- **Error Handling:** Sử dụng `error.tsx` của Next.js cho từng Route Group. Cấm dùng `try-catch` rỗng.
- **SEO:** Mọi trang Candidate phải có định nghĩa `generateMetadata`.
- **Imports:** Import trực tiếp, không dùng barrel files. Dùng path alias `@/*`.
- **Hook Layer Rules:** Hook = orchestration (React Query), không chứa business logic core, không gọi axios trực tiếp.
- **Service Layer Rules:** chỉ gọi api, không dùng react, không chứa state.

### 5.1 Type Safety & Data Contract (Strict Mode)

Để tận dụng tối đa sức mạnh của TypeScript 5+, Agent phải tuân thủ:

- **Zod-First Source of Truth:** - Mọi dữ liệu từ API hoặc Form đều phải có một Zod Schema tương ứng.
  - Sử dụng `z.infer<typeof schema>` để tạo TypeScript types. KHÔNG định nghĩa type thủ công nếu đã có schema.
- **Strict "any" Ban:** - Tuyệt đối cấm sử dụng `any`. Nếu không biết rõ kiểu dữ liệu, bắt buộc dùng `unknown` và thực hiện type guarding.
- **Discriminated Unions:** - Sử dụng cho các trạng thái phức tạp (ví dụ: Auth State: `unauthenticated | authenticating | authenticated`).
- **Explicit Return Types:** - Tất cả các hàm (Actions, Services, Helpers) bắt buộc phải khai báo kiểu dữ liệu trả về rõ ràng.
- **API Contract:**
  - Mọi API Service phải có định nghĩa Request và Response interface tại folder `types/` của feature đó.
- **Form Safety:** - `useForm` của React Hook Form phải đi kèm với `zodResolver(schema)`.

### 5.2 Data Fetching Strategy (CRITICAL)

- **Server Components (default):**
  - Fetch data trực tiếp bằng `fetch()` hoặc server services
  - Cache sử dụng Next.js cache (`force-cache`, `revalidate`)

- **Client Components:**
  - Dùng React Query cho client components:
    - Realtime / polling
    - Mutations (apply job, like job)
    - Optimistic UI

- **ABSOLUTELY FORBIDDEN:**
  - Dùng React Query cho initial page load data

---

## 6. Security & Performance

- **Server Actions:** Luôn validate input bằng `zod` ngay trong Action.
- **PPR (Partial Prerendering):** Áp dụng cho các trang danh sách việc làm để đạt tốc độ load < 200ms.
- **Images:** Luôn sử dụng `next/image` với `priority` cho các banner trang chủ.
- **Fonts:** Load qua `next/font/google` — hoisted tại module level (server-hoist-static-io).

---

## 7. UI Notifications & Error Handling

### Toaster (`sonner`)

- Cấu hình **một lần duy nhất** tại root layout: `<Toaster position="top-right" richColors />`.
- API sử dụng: `toast.success('...')`, `toast.error('...')`, `toast.info('...')`.
- **Luôn** hiển thị `apiError.message` qua `toast.error()` trong mọi catch block.

### API Error Normalization

- **BẮT BUỘC** dùng `normalizeError(err)` từ `@/lib/api/error` — KHÔNG bắt lỗi thủ công bằng `isAxiosError`.
- `normalizeError` trả về `ApiError`:
  ```ts
  interface ApiError {
    message: string; // Thông báo lỗi chung — hiển thị qua toast.error()
    statusCode?: number; // HTTP status code
    errors?: Record<string, string[]>; // Lỗi chi tiết theo field — map vào form
  }
  ```

### Form Error Mapping (Critical Pattern)

Khi backend trả về `errors: Record<string, string[]>`, **phải** map vào form fields:

```ts
if (apiError.errors) {
  Object.entries(apiError.errors).forEach(([field, messages]) => {
    form.setError(field as keyof FormInput, {
      type: "server",
      message: messages[0],
    });
  });
}
```

### Phân biệt lỗi Zod vs lỗi Server trong FormMessage

- Lỗi **Zod** (client-side): `type !== "server"` → dùng `tCommon(message as ValidationKey)` để i18n.
- Lỗi **Server**: `type === "server"` → hiển thị trực tiếp `message` (đã là string từ backend).

```tsx
<FormMessage>
  {error.type === "server"
    ? error.message
    : tCommon(error.message as ValidationKey)}
</FormMessage>
```

---

## 8. Path Structure

```
src/                          # Toàn bộ application code
├── app/[locale]/             # Route: /vi/... hoặc /en/...
│   ├── (public)/          # public route — Phase 2
│   ├── (employer)/           # Role group — Phase 2
│   └── (admin)/              # Role group — Phase 2
├── components/ui/            # shadcn atoms
├── components/craft/         # Semantic layout system
├── features/                 # Feature modules (encapsulated)
│   ├── auth/
│   └── jobs/
├── i18n/                     # next-intl config
├── hooks/                    # generic hooks ONLY
├── lib/                      # Shared libs (utils.ts)
│   └── api/
│       └── client.ts
│       └── interceptor.ts
└── utils/                    # Shared utilities
messages/                     # Translation files (vi.json, en.json)
.context/                     # AI Agent memory bank
```
