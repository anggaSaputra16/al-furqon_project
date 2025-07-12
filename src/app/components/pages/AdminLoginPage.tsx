'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEye, FaEyeSlash, FaUser, FaLock, FaShieldAlt } from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface LoginCredentials {
    username: string
    password: string
}

interface AdminLoginPageProps {
    onLogin: (credentials: LoginCredentials) => Promise<boolean>
}

export default function AdminLoginPage({ onLogin }: AdminLoginPageProps) {
    const { colors } = useTheme()
    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const success = await onLogin(credentials)
            if (!success) {
                setError('Username atau password salah')
            }
        } catch (error) {
            setError('Terjadi kesalahan saat login')
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: keyof LoginCredentials, value: string) => {
        setCredentials(prev => ({ ...prev, [field]: value }))
        if (error) setError('')
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-8"
            style={{ backgroundColor: colors.background }}
        >
            <div className="w-full max-w-md">
                {/* Header */}
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

                {/* Login Form */}
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
                        {/* Error Message */}
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
                                <div className="flex items-center">
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Username Field */}
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

                        {/* Password Field */}
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

                        {/* Login Button */}
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

                    {/* Footer */}
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

                {/* Development Notice */}
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
            </div>
        </div>
    )
}
