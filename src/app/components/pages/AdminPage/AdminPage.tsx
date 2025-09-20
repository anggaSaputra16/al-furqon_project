'use client'

import { useState, useEffect } from 'react'
import { useAdminAuthentication } from '../../../hooks/useAdmin'
import AdminLoginPage from './AdminLoginPage'
import AdminHomePage from './AdminHomePage'

interface LoginCredentials {
    username: string
    password: string
}

export default function AdminPage() {
    const { isAuthenticated, user, isLoading } = useAdminAuthentication()
    const [mounted, setMounted] = useState(false)


    useEffect(() => {
        setMounted(true)
    }, [])


    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        )
    }


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memverifikasi...</p>
                </div>
            </div>
        )
    }


    if (isAuthenticated && user) {
        return <AdminHomePage adminName={user.name} />
    }

    return <AdminLoginPage />
}
