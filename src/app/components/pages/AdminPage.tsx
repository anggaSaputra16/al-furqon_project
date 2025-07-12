'use client'

import { useState, useEffect } from 'react'
import AdminLoginPage from './AdminLoginPage'
import AdminHomePage from './AdminHomePage'

interface LoginCredentials {
    username: string
    password: string
}

interface AdminUser {
    id: string
    username: string
    name: string
    role: string
    lastLogin: string
}

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Check if user is already logged in (from localStorage or session)
    useEffect(() => {
        const checkAuthStatus = () => {
            try {
                const storedAuth = localStorage.getItem('admin_auth')
                const storedUser = localStorage.getItem('admin_user')

                if (storedAuth && storedUser) {
                    const authData = JSON.parse(storedAuth)
                    const userData = JSON.parse(storedUser)

                    // Check if token is still valid (simple expiration check)
                    const currentTime = new Date().getTime()
                    if (authData.expires && currentTime < authData.expires) {
                        setIsAuthenticated(true)
                        setCurrentUser(userData)
                    } else {
                        // Token expired, clear storage
                        localStorage.removeItem('admin_auth')
                        localStorage.removeItem('admin_user')
                    }
                }
            } catch (error) {
                console.error('Error checking auth status:', error)
                // Clear corrupted data
                localStorage.removeItem('admin_auth')
                localStorage.removeItem('admin_user')
            } finally {
                setIsLoading(false)
            }
        }

        checkAuthStatus()
    }, [])

    const handleLogin = async (credentials: LoginCredentials): Promise<boolean> => {
        try {
            // Demo credentials - in production, this would be an API call
            const demoCredentials = {
                username: 'admin',
                password: 'admin123'
            }

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            if (
                credentials.username === demoCredentials.username &&
                credentials.password === demoCredentials.password
            ) {
                const user: AdminUser = {
                    id: '1',
                    username: credentials.username,
                    name: 'Administrator Al-Furqon',
                    role: 'super_admin',
                    lastLogin: new Date().toISOString()
                }

                const authData = {
                    token: 'demo_token_' + Date.now(),
                    expires: new Date().getTime() + (24 * 60 * 60 * 1000) // 24 hours
                }

                // Store authentication data
                localStorage.setItem('admin_auth', JSON.stringify(authData))
                localStorage.setItem('admin_user', JSON.stringify(user))

                setCurrentUser(user)
                setIsAuthenticated(true)
                return true
            }

            return false
        } catch (error) {
            console.error('Login error:', error)
            return false
        }
    }

    const handleLogout = () => {
        // Clear authentication data
        localStorage.removeItem('admin_auth')
        localStorage.removeItem('admin_user')

        setIsAuthenticated(false)
        setCurrentUser(null)
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        )
    }

    // Show admin home if authenticated, otherwise show login
    if (isAuthenticated && currentUser) {
        return (
            <AdminHomePage
                onLogout={handleLogout}
                adminName={currentUser.name}
            />
        )
    }

    return <AdminLoginPage onLogin={handleLogin} />
}
