// components/RoleGuard.tsx
'use client'

import { useAuthStore } from '@/features/auth/model/auth.store'
import { Role } from '@/features/auth'

interface RoleGuardProps {
  roles: Role[]           // role nào được phép thấy
  children: React.ReactNode
  fallback?: React.ReactNode // hiển thị gì nếu không đủ quyền
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)

  // Đang check session → không render gì, tránh layout shift
  if (isLoading) return null

  // Không đủ role → render fallback hoặc null
  if (!user || !roles.includes(user.role)) return <>{fallback}</>

  return <>{children}</>
}
