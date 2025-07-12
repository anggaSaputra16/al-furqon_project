'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    FaBell, FaArrowLeft, FaCheck, FaTrash, FaEye, FaFilter,
    FaFileAlt, FaDonate, FaUsers, FaCog, FaExclamationTriangle
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface Notification {
    id: string
    title: string
    description: string
    timestamp: string
    type: 'success' | 'info' | 'warning' | 'error'
    category: 'article' | 'donation' | 'user' | 'system' | 'finance'
    isRead: boolean
    priority: 'low' | 'medium' | 'high'
}

interface AdminNotificationPageProps {
    onBack: () => void
}

export default function AdminNotificationPage({ onBack }: AdminNotificationPageProps) {
    const { colors } = useTheme()
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')
    const [categoryFilter, setCategoryFilter] = useState<'all' | 'article' | 'donation' | 'user' | 'system' | 'finance'>('all')

    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            title: 'Artikel Baru Dipublikasi',
            description: 'Artikel "Kajian Rutin Minggu Pagi" telah berhasil dipublikasi dan dapat dilihat oleh jamaah.',
            timestamp: '2 jam yang lalu',
            type: 'success',
            category: 'article',
            isRead: false,
            priority: 'medium'
        },
        {
            id: '2',
            title: 'Donasi Diterima',
            description: 'Donasi sebesar Rp 5.000.000 untuk program renovasi mihrab telah diterima dari donatur anonim.',
            timestamp: '4 jam yang lalu',
            type: 'info',
            category: 'donation',
            isRead: false,
            priority: 'high'
        },
        {
            id: '3',
            title: 'Artikel Perlu Review',
            description: 'Draft artikel "Pengumuman Libur Hari Raya" menunggu persetujuan untuk dipublikasi.',
            timestamp: '1 hari yang lalu',
            type: 'warning',
            category: 'article',
            isRead: true,
            priority: 'medium'
        },
        {
            id: '4',
            title: 'Pengeluaran Baru',
            description: 'Pengeluaran untuk listrik dan air bulan ini sebesar Rp 450.000 telah dicatat.',
            timestamp: '1 hari yang lalu',
            type: 'info',
            category: 'finance',
            isRead: true,
            priority: 'low'
        },
        {
            id: '5',
            title: 'User Baru Terdaftar',
            description: 'Admin baru "Ahmad Fauzi" telah terdaftar dan menunggu aktivasi akun.',
            timestamp: '2 hari yang lalu',
            type: 'info',
            category: 'user',
            isRead: false,
            priority: 'medium'
        },
        {
            id: '6',
            title: 'Backup Sistem Gagal',
            description: 'Backup otomatis sistem gagal dilakukan. Silakan lakukan backup manual.',
            timestamp: '3 hari yang lalu',
            type: 'error',
            category: 'system',
            isRead: true,
            priority: 'high'
        }
    ])

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'success': return '#10b981'
            case 'info': return '#3b82f6'
            case 'warning': return '#f59e0b'
            case 'error': return '#ef4444'
            default: return colors.detail
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'success': return FaCheck
            case 'info': return FaBell
            case 'warning': return FaExclamationTriangle
            case 'error': return FaExclamationTriangle
            default: return FaBell
        }
    }

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'article': return FaFileAlt
            case 'donation': return FaDonate
            case 'user': return FaUsers
            case 'system': return FaCog
            case 'finance': return FaDonate
            default: return FaBell
        }
    }

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return '#ef4444'
            case 'medium': return '#f59e0b'
            case 'low': return '#10b981'
            default: return colors.detail
        }
    }

    const markAsRead = (id: string) => {
        setNotifications(prev =>
            prev.map(notif =>
                notif.id === id ? { ...notif, isRead: true } : notif
            )
        )
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notif => ({ ...notif, isRead: true }))
        )
    }

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id))
    }

    const filteredNotifications = notifications.filter(notif => {
        const statusMatch = filter === 'all' ||
            (filter === 'read' && notif.isRead) ||
            (filter === 'unread' && !notif.isRead)

        const categoryMatch = categoryFilter === 'all' || notif.category === categoryFilter

        return statusMatch && categoryMatch
    })

    const unreadCount = notifications.filter(n => !n.isRead).length

    return (
        <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <header
                className="sticky top-0 z-50 px-6 py-4 border-b backdrop-blur-md"
                style={{
                    backgroundColor: colors.card + 'CC',
                    borderColor: colors.border + '30'
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={onBack}
                            className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                            style={{ color: colors.cardText }}
                        >
                            <FaArrowLeft size={18} />
                        </button>
                        <div>
                            <h1
                                className="text-2xl font-bold"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-header-modern)'
                                }}
                            >
                                Notifikasi
                            </h1>
                            <p className="text-sm" style={{ color: colors.detail }}>
                                {unreadCount} notifikasi belum dibaca
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={markAllAsRead}
                        className="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                        style={{
                            backgroundColor: colors.accent + '15',
                            color: colors.accent
                        }}
                        disabled={unreadCount === 0}
                    >
                        Tandai Semua Dibaca
                    </button>
                </div>
            </header>

            <div className="p-6">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6"
                >
                    <div
                        className="p-4 rounded-xl border"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '30'
                        }}
                    >
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center space-x-2">
                                <FaFilter size={16} style={{ color: colors.detail }} />
                                <span className="text-sm font-medium" style={{ color: colors.cardText }}>
                                    Filter:
                                </span>
                            </div>

                            {/* Status Filter */}
                            <div className="flex items-center space-x-2">
                                {['all', 'unread', 'read'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setFilter(status as any)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200`}
                                        style={{
                                            backgroundColor: filter === status ? colors.accent + '15' : 'transparent',
                                            color: filter === status ? colors.accent : colors.detail
                                        }}
                                    >
                                        {status === 'all' ? 'Semua' : status === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
                                    </button>
                                ))}
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center space-x-2">
                                {[
                                    { key: 'all', label: 'Semua Kategori' },
                                    { key: 'article', label: 'Artikel' },
                                    { key: 'donation', label: 'Donasi' },
                                    { key: 'finance', label: 'Keuangan' },
                                    { key: 'user', label: 'Pengguna' },
                                    { key: 'system', label: 'Sistem' }
                                ].map((cat) => (
                                    <button
                                        key={cat.key}
                                        onClick={() => setCategoryFilter(cat.key as any)}
                                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200`}
                                        style={{
                                            backgroundColor: categoryFilter === cat.key ? colors.accent + '15' : 'transparent',
                                            color: categoryFilter === cat.key ? colors.accent : colors.detail
                                        }}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Notifications List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="space-y-4"
                >
                    {filteredNotifications.length === 0 ? (
                        <div
                            className="text-center py-12 rounded-xl border"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border + '30'
                            }}
                        >
                            <FaBell size={48} style={{ color: colors.detail }} className="mx-auto mb-4 opacity-50" />
                            <p style={{ color: colors.detail }}>Tidak ada notifikasi yang sesuai filter</p>
                        </div>
                    ) : (
                        filteredNotifications.map((notification, index) => {
                            const TypeIcon = getTypeIcon(notification.type)
                            const CategoryIcon = getCategoryIcon(notification.category)

                            return (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${!notification.isRead ? 'ring-2 ring-opacity-20' : ''
                                        }`}
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border + '30',
                                        '--tw-ring-color': !notification.isRead ? colors.accent : 'transparent'
                                    } as React.CSSProperties}
                                >
                                    <div className="flex items-start space-x-4">
                                        {/* Type Icon */}
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                            style={{ backgroundColor: getTypeColor(notification.type) + '20' }}
                                        >
                                            <TypeIcon size={18} style={{ color: getTypeColor(notification.type) }} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <h3
                                                            className="font-semibold"
                                                            style={{ color: colors.cardText }}
                                                        >
                                                            {notification.title}
                                                        </h3>
                                                        {!notification.isRead && (
                                                            <div
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: colors.accent }}
                                                            />
                                                        )}
                                                    </div>
                                                    <p
                                                        className="text-sm mb-2"
                                                        style={{ color: colors.detail }}
                                                    >
                                                        {notification.description}
                                                    </p>
                                                    <div className="flex items-center space-x-4 text-xs">
                                                        <div className="flex items-center space-x-1">
                                                            <CategoryIcon size={12} style={{ color: colors.detail }} />
                                                            <span style={{ color: colors.detail }}>
                                                                {notification.category}
                                                            </span>
                                                        </div>
                                                        <span style={{ color: colors.detail }}>
                                                            {notification.timestamp}
                                                        </span>
                                                        <span
                                                            className="px-2 py-1 rounded-full text-xs font-medium"
                                                            style={{
                                                                backgroundColor: getPriorityColor(notification.priority) + '20',
                                                                color: getPriorityColor(notification.priority)
                                                            }}
                                                        >
                                                            {notification.priority === 'high' ? 'Tinggi' :
                                                                notification.priority === 'medium' ? 'Sedang' : 'Rendah'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center space-x-2 ml-4">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                                                            title="Tandai sebagai dibaca"
                                                            style={{ color: colors.detail }}
                                                        >
                                                            <FaEye size={14} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => deleteNotification(notification.id)}
                                                        className="p-2 rounded-lg transition-colors duration-200 hover:bg-red-50"
                                                        title="Hapus notifikasi"
                                                        style={{ color: '#ef4444' }}
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })
                    )}
                </motion.div>
            </div>
        </div>
    )
}
