'use client'

import { useTheme } from '@/context/themeContext'
import { useRouter } from 'next/navigation'
import { FaShieldAlt, FaArrowLeft, FaExclamationTriangle } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface ForbiddenPageProps {
    requiredRole?: string
    userRole?: string
    onBack?: () => void
}

export default function ForbiddenPage({ requiredRole, userRole, onBack }: Readonly<ForbiddenPageProps>) {
    const { colors } = useTheme()
    const router = useRouter()

    const handleGoBack = () => {
        if (onBack) {
            onBack()
        } else {
            router.back()
        }
    }

    const handleGoHome = () => {
        router.push('/admin')
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{ backgroundColor: colors.background }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-md w-full text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-8"
                >
                    <div
                        className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{ backgroundColor: '#ef444420' }}
                    >
                        <FaShieldAlt size={48} style={{ color: '#ef4444' }} />
                    </div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h1
                        className="text-6xl font-bold mb-4"
                        style={{ color: '#ef4444' }}
                    >
                        403
                    </h1>
                    <h2
                        className="text-2xl font-bold mb-4"
                        style={{
                            color: colors.cardText,
                            fontFamily: 'var(--font-header-modern)'
                        }}
                    >
                        Akses Ditolak
                    </h2>
                    <div
                        className="text-base mb-6 leading-relaxed"
                        style={{ color: colors.detail }}
                    >
                        <p className="mb-3">
                            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                        </p>
                        {requiredRole && userRole && (
                            <div
                                className="p-4 rounded-lg border-l-4 mb-4"
                                style={{
                                    backgroundColor: '#f59e0b20',
                                    borderColor: '#f59e0b'
                                }}
                            >
                                <div className="flex items-start space-x-3">
                                    <FaExclamationTriangle
                                        size={16}
                                        style={{ color: '#f59e0b' }}
                                        className="mt-0.5 flex-shrink-0"
                                    />
                                    <div className="text-sm text-left">
                                        <p style={{ color: colors.cardText }}>
                                            <strong>Role Anda:</strong> {userRole}
                                        </p>
                                        <p style={{ color: colors.cardText }}>
                                            <strong>Role yang Diperlukan:</strong> {requiredRole}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                        <p>
                            Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                >
                    <button
                        onClick={handleGoBack}
                        className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                        style={{
                            backgroundColor: colors.accent,
                            color: 'white'
                        }}
                    >
                        <FaArrowLeft size={16} />
                        <span>Kembali</span>
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="w-full px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                        style={{
                            backgroundColor: colors.card,
                            color: colors.cardText,
                            border: `1px solid ${colors.border}`
                        }}
                    >
                        Ke Dashboard
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 pt-6 border-t"
                    style={{ borderColor: colors.border + '30' }}
                >
                    <p
                        className="text-sm"
                        style={{ color: colors.detail }}
                    >
                        Butuh bantuan? Hubungi administrator sistem.
                    </p>
                </motion.div>
            </motion.div>
        </div>
    )
}
