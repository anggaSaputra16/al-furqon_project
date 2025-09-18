'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaEye, FaEyeSlash, FaUser, FaLock, FaShieldAlt, FaTimes, FaExclamationTriangle, FaCheck } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import { useAdminAuthentication } from '../../../hooks/useAdmin'
import { useAdminUI } from '../../../stores/adminStore'

interface LoginCredentials {
    username: string
    password: string
    rememberMe?: boolean
}

export default function AdminLoginPage() {
    const { colors } = useTheme()
    const { login, isLoading } = useAdminAuthentication()
    const ui = useAdminUI()
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: '',
        rememberMe: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [showErrorPopup, setShowErrorPopup] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setShowErrorPopup(false)

        try {
            const result = await login(credentials)

            if (!result.success) {
                const errorMessage = result.message || 'Username atau password salah'

                setError(errorMessage)
                setShowErrorPopup(true)
            }
        } catch (error: any) {
            const errorMessage = 'Terjadi kesalahan saat login'
            setError(errorMessage)
            setShowErrorPopup(true)


            let errorTitle = 'Login Gagal'
            let errorDetail = errorMessage

            if (error?.message?.includes('fetch failed') ||
                error?.message?.includes('Network Error') ||
                error?.name === 'TypeError' ||
                !navigator.onLine) {
                errorTitle = 'Masalah Koneksi'
                errorDetail = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
            } else if (error?.message?.includes('Unauthorized') ||
                error?.message?.includes('401')) {
                errorTitle = 'Kredensial Tidak Valid'
                errorDetail = 'Username atau password yang Anda masukkan salah. Silakan periksa kembali.'
            } else if (error?.message) {
                errorDetail = error.message
            }

            ui.addNotification({
                id: Date.now().toString(),
                type: errorTitle.includes('Koneksi') ? 'warning' : 'error',
                title: errorTitle,
                message: errorDetail,
                timestamp: new Date().toISOString(),
                autoClose: true,
                duration: 5000
            })
        }
    }

    const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
        setCredentials(prev => ({ ...prev, [field]: value }))
        if (error) {
            setError('')
            setShowErrorPopup(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{ backgroundColor: colors.background }}
        >
            <div className="w-full max-w-md">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
                        style={{ backgroundColor: colors.accent + '20' }}
                    >
                        <FaShieldAlt
                            size={32}
                            style={{ color: colors.accent }}
                        />
                    </div>
                    <h1
                        className="text-3xl font-bold mb-2"
                        style={{
                            color: colors.cardText,
                            fontFamily: 'var(--font-header-modern)'
                        }}
                    >
                        Admin Panel
                    </h1>
                    <p
                        className="text-sm"
                        style={{
                            color: colors.detail,
                            fontFamily: 'var(--font-body)'
                        }}
                    >
                        Masjid Al-Furqon Content Management System
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="rounded-2xl shadow-xl p-8"
                    style={{
                        backgroundColor: colors.card,
                        border: `1px solid ${colors.border}30`
                    }}
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-4 rounded-lg border-l-4"
                                style={{
                                    backgroundColor: '#fee2e2',
                                    borderLeftColor: '#dc2626',
                                    color: '#dc2626'
                                }}
                            >
                                <div className="flex items-center space-x-2">
                                    <FaExclamationTriangle size={16} />
                                    <span className="text-sm font-medium">
                                        {error.includes('invalid') || error.includes('Invalid') ||
                                            error.includes('Unauthorized') || error.includes('password') || error.includes('username')
                                            ? 'Username atau password yang Anda masukkan salah'
                                            : error.includes('Network') || error.includes('connection')
                                                ? 'Masalah koneksi jaringan'
                                                : error
                                        }
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-sharp-bold)'
                                }}
                            >
                                Username
                            </label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                >
                                    <FaUser
                                        size={16}
                                        style={{ color: colors.detail }}
                                    />
                                </div>
                                <input
                                    type="text"
                                    value={credentials.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    placeholder="Masukkan username"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText,
                                        border: `1px solid ${colors.border}`,
                                        fontFamily: 'var(--font-body)',
                                        '--tw-ring-color': colors.accent
                                    } as React.CSSProperties}
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                className="block text-sm font-semibold mb-2"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-sharp-bold)'
                                }}
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div
                                    className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                                >
                                    <FaLock
                                        size={16}
                                        style={{ color: colors.detail }}
                                    />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={credentials.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    placeholder="Masukkan password"
                                    required
                                    className="w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText,
                                        border: `1px solid ${colors.border}`,
                                        fontFamily: 'var(--font-body)',
                                        '--tw-ring-color': colors.accent
                                    } as React.CSSProperties}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? (
                                        <FaEyeSlash
                                            size={16}
                                            style={{ color: colors.detail }}
                                        />
                                    ) : (
                                        <FaEye
                                            size={16}
                                            style={{ color: colors.detail }}
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                type="checkbox"
                                checked={credentials.rememberMe || false}
                                onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                style={{
                                    accentColor: colors.accent
                                }}
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-body)'
                                }}
                            >
                                Ingat saya
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !credentials.username || !credentials.password}
                            className="w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 hover:transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white',
                                fontFamily: 'var(--font-sharp-bold)',
                                boxShadow: `0 4px 14px ${colors.accent}40`
                            }}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Memverifikasi...
                                </div>
                            ) : (
                                'Masuk ke Admin Panel'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t" style={{ borderColor: colors.border }}>
                        <p
                            className="text-center text-xs"
                            style={{
                                color: colors.detail,
                                fontFamily: 'var(--font-body)'
                            }}
                        >
                            🔒 Akses terbatas hanya untuk administrator
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-4 text-center"
                >
                    <p
                        className="text-xs opacity-60"
                        style={{
                            color: colors.detail,
                            fontFamily: 'var(--font-body)'
                        }}
                    >
                        Demo: admin / admin123
                    </p>
                </motion.div>

                <AnimatePresence>
                    {showErrorPopup && error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="fixed top-6 right-6 z-50 max-w-sm w-full"
                        >
                            <div
                                className="rounded-xl shadow-2xl border-l-4 p-4 backdrop-blur-sm"
                                style={{
                                    backgroundColor: colors.card + 'F5',
                                    borderLeftColor: '#ef4444',
                                    border: '1px solid rgba(239, 68, 68, 0.2)'
                                }}
                            >
                                <div className="flex items-start space-x-3">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: '#ef444420'
                                        }}
                                    >
                                        <FaExclamationTriangle
                                            size={16}
                                            style={{ color: '#ef4444' }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className="text-sm font-semibold mb-1"
                                            style={{ color: colors.cardText }}
                                        >
                                            Login Gagal
                                        </div>
                                        <div
                                            className="text-xs"
                                            style={{ color: colors.detail }}
                                        >
                                            {error.includes('invalid') || error.includes('Invalid') ||
                                                error.includes('Unauthorized') || error.includes('password') || error.includes('username')
                                                ? 'Username atau password yang Anda masukkan salah. Silakan periksa kembali.'
                                                : error
                                            }
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setShowErrorPopup(false)
                                            setError('')
                                        }}
                                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
                                        style={{ color: colors.detail }}
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>

                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 5, ease: "linear" }}
                                    className="mt-3 h-1 rounded-full"
                                    style={{ backgroundColor: '#ef444440' }}
                                    onAnimationComplete={() => {
                                        setShowErrorPopup(false)
                                        setError('')
                                    }}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Global Notifications from Store */}
                <GlobalNotifications />
            </div>
        </div>
    )
}

function GlobalNotifications() {
    const { colors } = useTheme()
    const ui = useAdminUI()
    const notifications = ui.notifications || []

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'error': return FaExclamationTriangle
            case 'warning': return FaExclamationTriangle
            case 'success': return FaCheck
            case 'info':
            default: return FaShieldAlt
        }
    }

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'error': return '#ef4444'
            case 'warning': return '#f59e0b'
            case 'success': return '#10b981'
            case 'info':
            default: return '#3b82f6'
        }
    }

    return (
        <div className="fixed top-6 right-6 z-50 space-y-3">
            <AnimatePresence>
                {notifications.map((notification) => {
                    const Icon = getNotificationIcon(notification.type)
                    const color = getNotificationColor(notification.type)

                    return (
                        <motion.div
                            key={notification.id}
                            initial={{ opacity: 0, scale: 0.9, x: 100 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 100 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="max-w-sm w-full"
                        >
                            <div
                                className="rounded-xl shadow-2xl border-l-4 p-4 backdrop-blur-sm"
                                style={{
                                    backgroundColor: colors.card + 'F5',
                                    borderLeftColor: color,
                                    border: `1px solid ${color}20`
                                }}
                            >
                                <div className="flex items-start space-x-3">
                                    <div
                                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                                        style={{
                                            backgroundColor: color + '20'
                                        }}
                                    >
                                        <Icon
                                            size={16}
                                            style={{ color }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div
                                            className="text-sm font-semibold mb-1"
                                            style={{ color: colors.cardText }}
                                        >
                                            {notification.title}
                                        </div>
                                        <div
                                            className="text-xs leading-relaxed"
                                            style={{ color: colors.detail }}
                                        >
                                            {notification.message}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => ui.removeNotification(notification.id)}
                                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-gray-100"
                                        style={{ color: colors.detail }}
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                </div>

                                {/* Auto-close progress bar */}
                                {notification.autoClose && (
                                    <motion.div
                                        initial={{ width: "100%" }}
                                        animate={{ width: "0%" }}
                                        transition={{
                                            duration: (notification.duration || 5000) / 1000,
                                            ease: "linear"
                                        }}
                                        className="mt-3 h-1 rounded-full"
                                        style={{ backgroundColor: color + '40' }}
                                        onAnimationComplete={() => {
                                            ui.removeNotification(notification.id)
                                        }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}
