'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FaHome, FaNewspaper, FaDonate, FaImages, FaUsers, FaCog,
    FaChartBar, FaFileAlt, FaCalendarAlt, FaSignOutAlt,
    FaEye, FaEdit, FaTrash, FaPlus, FaBell, FaSearch,
    FaMoneyBillWave, FaFileInvoiceDollar
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import AdminArticlePage from './AdminArticlePage'
import AdminDonationPage from './AdminDonationPage'
import AdminUserPage from './AdminUserPage'
import AdminReportPage from './AdminReportPage'
import AdminSettingsPage from './AdminSettingsPage'
import AdminFinancePage from './AdminFinancePage'
import AdminFinancialReportPage from './AdminFinancialReportPage'

interface AdminStats {
    totalArticles: number
    totalDonations: number
    totalGallery: number
    totalUsers: number
    monthlyViews: number
    activeDonations: number
    monthlyIncome: number
    monthlyExpense: number
    totalBalance: number
}

interface RecentActivity {
    id: string
    type: 'article' | 'donation' | 'gallery' | 'user'
    title: string
    timestamp: string
    status: 'published' | 'draft' | 'pending'
}

interface AdminHomePageProps {
    onLogout: () => void
    adminName?: string
}

export default function AdminHomePage({ onLogout, adminName = 'Administrator' }: AdminHomePageProps) {
    const { colors } = useTheme()
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'articles' | 'donations' | 'users' | 'reports' | 'settings' | 'finance' | 'financial-reports'>('dashboard')
    const [stats, setStats] = useState<AdminStats>({
        totalArticles: 45,
        totalDonations: 12,
        totalGallery: 156, // Gallery images dari artikel
        totalUsers: 3, // Admin CMS users
        monthlyViews: 8750,
        activeDonations: 8,
        monthlyIncome: 18250000, // Pemasukan bulan ini
        monthlyExpense: 8750000, // Pengeluaran bulan ini
        totalBalance: 9500000 // Saldo bersih bulan ini
    })

    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
        {
            id: '1',
            type: 'article',
            title: 'Kajian Rutin Minggu Pagi',
            timestamp: '2 jam yang lalu',
            status: 'published'
        },
        {
            id: '2',
            type: 'donation',
            title: 'Donasi Renovasi Mihrab - Rp 5.000.000',
            timestamp: '4 jam yang lalu',
            status: 'published'
        },
        {
            id: '3',
            type: 'donation',
            title: 'Pengeluaran Listrik & Air - Rp 450.000',
            timestamp: '1 hari yang lalu',
            status: 'published'
        },
        {
            id: '4',
            type: 'article',
            title: 'Pengumuman Libur Hari Raya',
            timestamp: '2 hari yang lalu',
            status: 'draft'
        }
    ])

    const menuItems = [
        { title: 'Dashboard', icon: FaHome, page: 'dashboard' as const, active: currentPage === 'dashboard' },
        { title: 'Artikel', icon: FaFileAlt, page: 'articles' as const, count: stats.totalArticles, active: currentPage === 'articles' },
        { title: 'Donasi', icon: FaDonate, page: 'donations' as const, count: stats.activeDonations, active: currentPage === 'donations' },
        { title: 'Keuangan', icon: FaMoneyBillWave, page: 'finance' as const, active: currentPage === 'finance' },
        { title: 'Laporan Keuangan', icon: FaFileInvoiceDollar, page: 'financial-reports' as const, active: currentPage === 'financial-reports' },
        { title: 'Pengguna', icon: FaUsers, page: 'users' as const, count: stats.totalUsers, active: currentPage === 'users' },
        { title: 'Laporan', icon: FaChartBar, page: 'reports' as const, active: currentPage === 'reports' },
        { title: 'Pengaturan', icon: FaCog, page: 'settings' as const, active: currentPage === 'settings' }
    ]

    const quickActions = [
        { title: 'Buat Artikel Baru', icon: FaFileAlt, action: () => setCurrentPage('articles'), color: colors.accent },
        { title: 'Tambah Donasi', icon: FaDonate, action: () => setCurrentPage('donations'), color: '#10b981' },
        { title: 'Kelola Keuangan', icon: FaMoneyBillWave, action: () => setCurrentPage('finance'), color: '#f59e0b' },
        { title: 'Kelola Pengguna', icon: FaUsers, action: () => setCurrentPage('users'), color: '#6366f1' }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return '#10b981'
            case 'draft': return '#f59e0b'
            case 'pending': return '#ef4444'
            default: return colors.detail
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'published': return 'Dipublikasi'
            case 'draft': return 'Draft'
            case 'pending': return 'Menunggu'
            default: return status
        }
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'article': return FaFileAlt
            case 'donation': return FaDonate
            case 'gallery': return FaImages
            case 'user': return FaUsers
            default: return FaFileAlt
        }
    }

    // Show specific admin page based on currentPage
    if (currentPage === 'articles') {
        return <AdminArticlePage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'donations') {
        return <AdminDonationPage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'finance') {
        return <AdminFinancePage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'financial-reports') {
        return <AdminFinancialReportPage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'users') {
        return <AdminUserPage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'reports') {
        return <AdminReportPage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'settings') {
        return <AdminSettingsPage onBack={() => setCurrentPage('dashboard')} />
    }

    // Dashboard view
    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: colors.background }}
        >
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
                        <h1
                            className="text-2xl font-bold"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)'
                            }}
                        >
                            Admin Panel
                        </h1>
                        <div
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: colors.accent + '20',
                                color: colors.accent
                            }}
                        >
                            Al-Furqon CMS
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <FaSearch
                                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                                size={14}
                                style={{ color: colors.detail }}
                            />
                            <input
                                type="text"
                                placeholder="Cari konten..."
                                className="pl-10 pr-4 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`,
                                    width: '250px'
                                }}
                            />
                        </div>

                        {/* Notifications */}
                        <button
                            className="relative p-2 rounded-lg transition-colors duration-200"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText
                            }}
                        >
                            <FaBell size={18} />
                            <span
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white"
                                style={{ backgroundColor: '#ef4444' }}
                            >
                                3
                            </span>
                        </button>

                        {/* Admin Profile */}
                        <div className="flex items-center space-x-3">
                            <div className="text-right hidden sm:block">
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.cardText }}
                                >
                                    {adminName}
                                </div>
                                <div
                                    className="text-xs"
                                    style={{ color: colors.detail }}
                                >
                                    Administrator
                                </div>
                            </div>
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                                style={{ backgroundColor: colors.accent }}
                            >
                                {adminName.charAt(0).toUpperCase()}
                            </div>
                        </div>

                        {/* Logout */}
                        <button
                            onClick={onLogout}
                            className="p-2 rounded-lg transition-colors duration-200 hover:bg-red-50"
                            style={{ color: '#ef4444' }}
                            title="Logout"
                        >
                            <FaSignOutAlt size={18} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside
                    className="w-64 min-h-screen border-r hidden lg:block"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border + '30'
                    }}
                >
                    <nav className="p-6">
                        <div className="space-y-2">                {menuItems.map((item, index) => {
                            const Icon = item.icon
                            return (
                                <motion.button
                                    key={item.title}
                                    onClick={() => item.page && setCurrentPage(item.page)}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105 w-full text-left ${item.active ? 'shadow-md' : ''
                                        }`}
                                    style={{
                                        backgroundColor: item.active ? colors.accent + '15' : 'transparent',
                                        color: item.active ? colors.accent : colors.cardText
                                    }}
                                >
                                    <div className="flex items-center space-x-3">
                                        <Icon size={18} />
                                        <span className="font-medium">{item.title}</span>
                                    </div>
                                    {item.count && (
                                        <span
                                            className="px-2 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: colors.accent + '20',
                                                color: colors.accent
                                            }}
                                        >
                                            {item.count}
                                        </span>
                                    )}
                                </motion.button>
                            )
                        })}
                        </div>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {/* Welcome Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <h2
                            className="text-3xl font-bold mb-2"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)'
                            }}
                        >
                            Selamat datang, {adminName}! 👋
                        </h2>
                        <p
                            className="text-lg"
                            style={{ color: colors.detail }}
                        >
                            Kelola konten Masjid Al-Furqon dengan mudah dari dashboard ini.
                        </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        {[
                            {
                                label: 'Total Artikel',
                                value: stats.totalArticles,
                                icon: FaFileAlt,
                                color: colors.accent,
                                description: 'Artikel yang telah dipublikasi',
                                formatter: (value: number) => value.toString()
                            },
                            {
                                label: 'Program Donasi',
                                value: stats.activeDonations,
                                icon: FaDonate,
                                color: '#10b981',
                                description: 'Program donasi aktif',
                                formatter: (value: number) => value.toString()
                            },
                            {
                                label: 'Pemasukan Bulan Ini',
                                value: stats.monthlyIncome,
                                icon: FaMoneyBillWave,
                                color: '#10b981',
                                description: 'Total pemasukan bulan Juli',
                                formatter: (value: number) => new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(value)
                            },
                            {
                                label: 'Saldo Bersih',
                                value: stats.totalBalance,
                                icon: FaFileInvoiceDollar,
                                color: '#6366f1',
                                description: 'Saldo bersih bulan ini',
                                formatter: (value: number) => new Intl.NumberFormat('id-ID', {
                                    style: 'currency',
                                    currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(value)
                            }
                        ].map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div
                                    key={stat.label}
                                    className="p-6 rounded-xl border hover:shadow-lg transition-all duration-300 group"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border + '30'
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: stat.color + '20' }}
                                        >
                                            <Icon size={24} style={{ color: stat.color }} />
                                        </div>
                                        <div
                                            className="text-2xl font-bold"
                                            style={{ color: colors.cardText }}
                                        >
                                            {stat.formatter(stat.value)}
                                        </div>
                                    </div>
                                    <div
                                        className="text-sm font-medium mb-1"
                                        style={{ color: colors.detail }}
                                    >
                                        {stat.label}
                                    </div>
                                    <div
                                        className="text-xs opacity-70 group-hover:opacity-100 transition-opacity"
                                        style={{ color: colors.detail }}
                                    >
                                        {stat.description}
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-2"
                        >
                            <div
                                className="p-6 rounded-xl border"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border + '30'
                                }}
                            >
                                <h3
                                    className="text-xl font-bold mb-6"
                                    style={{
                                        color: colors.cardText,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Aksi Cepat
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {quickActions.map((action, index) => {
                                        const Icon = action.icon
                                        return (
                                            <button
                                                key={action.title}
                                                onClick={action.action}
                                                className="p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid hover:shadow-md hover:scale-105"
                                                style={{
                                                    borderColor: action.color + '40',
                                                    color: action.color
                                                }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <Icon size={20} />
                                                    <span className="font-medium">{action.title}</span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Activity */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div
                                className="p-6 rounded-xl border"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border + '30'
                                }}
                            >
                                <h3
                                    className="text-xl font-bold mb-6"
                                    style={{
                                        color: colors.cardText,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Aktivitas Terbaru
                                </h3>
                                <div className="space-y-4">
                                    {recentActivities.map((activity, index) => {
                                        const Icon = getActivityIcon(activity.type)
                                        return (
                                            <div key={activity.id} className="flex items-start space-x-3">
                                                <div
                                                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                    style={{ backgroundColor: colors.accent + '20' }}
                                                >
                                                    <Icon size={14} style={{ color: colors.accent }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div
                                                        className="text-sm font-medium truncate"
                                                        style={{ color: colors.cardText }}
                                                    >
                                                        {activity.title}
                                                    </div>
                                                    <div className="flex items-center space-x-2 mt-1">
                                                        <span
                                                            className="text-xs"
                                                            style={{ color: colors.detail }}
                                                        >
                                                            {activity.timestamp}
                                                        </span>
                                                        <span
                                                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                                                            style={{
                                                                backgroundColor: getStatusColor(activity.status) + '20',
                                                                color: getStatusColor(activity.status)
                                                            }}
                                                        >
                                                            {getStatusText(activity.status)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}
