'use client'

import { useMe } from '@/features/auth/hooks/useMe'
import { Role } from '@/features/auth'

interface RoleGuardProps {
  roles: Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Guard theo role — dùng useMe() (React Query) làm source of truth.
 * Không còn phụ thuộc vào Zustand auth store.
 */
export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const { data: user, isLoading } = useMe()

  // Đang fetch session → không render gì, tránh layout shift
  if (isLoading) return null

  // Không đủ role → render fallback hoặc null
  if (!user || !roles.includes(user.role)) return <>{fallback}</>

  return <>{children}</>
}
