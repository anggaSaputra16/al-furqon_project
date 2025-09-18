'use client'

import { ReactNode } from 'react'
import { useAdminAuthentication } from '../hooks/useAdmin'
import { UserRole, canAccessRoute, ROLE_LABELS } from '../types/roleTypes'
import ForbiddenPage from './pages/ForbiddenPage'

interface RouteGuardProps {
    children: ReactNode
    requiredRoute: string
    fallbackComponent?: ReactNode
}

export function RouteGuard({ children, requiredRoute, fallbackComponent }: RouteGuardProps) {
    const { isAuthenticated, user, isLoading } = useAdminAuthentication()


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memverifikasi akses...</p>
                </div>
            </div>
        )
    }


    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Akses tidak diizinkan. Silakan login terlebih dahulu.</p>
                </div>
            </div>
        )
    }


    const userRole = user.role as UserRole
    const hasAccess = canAccessRoute(userRole, requiredRoute)

    if (!hasAccess) {
        if (fallbackComponent) {
            return <>{fallbackComponent}</>
        }

        return (
            <ForbiddenPage
                requiredRole="Admin atau Super Admin"
                userRole={ROLE_LABELS[userRole]}
            />
        )
    }

    return <>{children}</>
}

export function usePermissions() {
    const { user } = useAdminAuthentication()

    const checkPermission = (route: string): boolean => {
        if (!user) return false
        return canAccessRoute(user.role as UserRole, route)
    }

    const getUserRole = (): UserRole | null => {
        if (!user) return null
        return user.role as UserRole
    }

    return {
        checkPermission,
        getUserRole,
        user
    }
}
