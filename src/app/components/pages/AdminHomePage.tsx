'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FaHome,
    FaDonate,
    FaImages,
    FaUsers,
    FaCog,
    FaChartBar,
    FaFileAlt,
    FaSignOutAlt,
    FaBell,
    FaMoneyBillWave,
    FaFileInvoiceDollar,
    FaChevronDown,
    FaChevronRight,
    FaSync
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import { useAdminAuthentication } from '../../hooks/useAdmin'
import { useDashboardStats } from '../../hooks/useDashboardStats'
import { useArticleStore } from '../../stores/adminArticleStore' // Import article store
import { useFeaturedArticles } from '../../hooks/useHomePageApi' // Import featured articles
import { AdminActivity } from '../../types/adminResponseTypes'
import AdminArticlePage from './AdminArticlePage'
import AdminDonationPage from './AdminDonationPage'
import AdminUserPage from './AdminUserPage'
import AdminReportPage from './AdminReportPage'
import AdminSettingsPage from './AdminSettingsPage'
import AdminFinancePage from './AdminFinancePage'
import AdminFinancialReportPage from './AdminFinancialReportPage'
import AdminNotificationPage from './AdminNotificationPage'

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

interface AdminHomePageProps {
    adminName?: string
}

interface MenuSubItem {
    title: string
    icon: any
    page: 'dashboard' | 'articles' | 'donations' | 'users' | 'reports' | 'settings' | 'finance' | 'financial-reports' | 'notifications'
    active: boolean
}

interface MenuItem {
    title: string
    icon: any
    page?: 'dashboard' | 'articles' | 'donations' | 'users' | 'reports' | 'settings' | 'finance' | 'financial-reports' | 'notifications'
    count?: number
    active: boolean
    hasDropdown?: boolean
    subItems?: MenuSubItem[]
}

export default function AdminHomePage({ adminName = 'Administrator' }: AdminHomePageProps) {

    const { colors } = useTheme()
    const { logout } = useAdminAuthentication()
    const { stats: dashboardStats, formattedStats, isLoading: isStatsLoading, refreshStats } = useDashboardStats()

    // Get real article data
    const articleStore = useArticleStore()
    const { articles: featuredArticles, refetch: refetchFeaturedArticles } = useFeaturedArticles()

    const [currentPage, setCurrentPage] = useState<'dashboard' | 'articles' | 'donations' | 'users' | 'reports' | 'settings' | 'finance' | 'financial-reports' | 'notifications'>('dashboard')
    const [mounted, setMounted] = useState(false)
    const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false)
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)

    // Calculate real article count from multiple sources
    const realArticleCount = Math.max(
        articleStore.articles?.length || 0,
        featuredArticles?.length || 0
    )

    // Debug logging
    console.log('📊 Dashboard Articles Debug:')
    console.log('- Admin Store Articles:', articleStore.articles?.length || 0)
    console.log('- Featured Articles:', featuredArticles?.length || 0)
    console.log('- Real Article Count:', realArticleCount)
    console.log('- Dashboard Stats Articles:', dashboardStats?.totalArticles || 0)

    // Merge real data with dashboard stats
    const stats = {
        totalArticles: realArticleCount > 0 ? realArticleCount : (dashboardStats?.totalArticles ?? 0),
        totalDonations: dashboardStats?.totalDonations ?? 0,
        totalGallery: dashboardStats?.totalGallery ?? 0,
        totalUsers: dashboardStats?.totalUsers ?? 0,
        monthlyViews: dashboardStats?.monthlyViews ?? 0,
        activeDonations: dashboardStats?.activeDonations ?? 0,
        monthlyIncome: dashboardStats?.monthlyIncome ?? 0,
        monthlyExpense: dashboardStats?.monthlyExpense ?? 0,
        totalBalance: dashboardStats?.totalBalance ?? 0
    }


    const recentActivities = dashboardStats?.recentActivities || []


    useEffect(() => {
        setMounted(true)

        // Load article data if not already loaded
        if (articleStore.articles.length === 0) {
            // Try to load from admin store first
            const loadArticles = async () => {
                try {
                    // Check if there's a method to load articles in the store
                    // This might need to be adjusted based on your store implementation
                    console.log('Loading articles for dashboard stats...')
                } catch (error) {
                    console.warn('Could not load articles for dashboard:', error)
                }
            }
            loadArticles()
        }
    }, [])


    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    const menuItems: MenuItem[] = [
        { title: 'Dashboard', icon: FaHome, page: 'dashboard' as const, active: currentPage === 'dashboard' },
        { title: 'Artikel', icon: FaFileAlt, page: 'articles' as const, count: stats.totalArticles, active: currentPage === 'articles' },
        { title: 'Donasi', icon: FaDonate, page: 'donations' as const, count: stats.activeDonations, active: currentPage === 'donations' },
        { title: 'Keuangan', icon: FaMoneyBillWave, page: 'finance' as const, active: currentPage === 'finance' },
        { title: 'Pengguna', icon: FaUsers, page: 'users' as const, count: stats.totalUsers, active: currentPage === 'users' },
        {
            title: 'Laporan',
            icon: FaChartBar,
            hasDropdown: true,
            active: currentPage === 'reports' || currentPage === 'financial-reports',
            subItems: [
                { title: 'Laporan Keuangan', icon: FaFileInvoiceDollar, page: 'financial-reports' as const, active: currentPage === 'financial-reports' },
                { title: 'Laporan Artikel', icon: FaFileAlt, page: 'reports' as const, active: currentPage === 'reports' }
            ]
        },
        { title: 'Pengaturan', icon: FaCog, page: 'settings' as const, active: currentPage === 'settings' }
    ]

    const quickActions = [
        { title: 'Buat Artikel Baru', icon: FaFileAlt, action: () => setCurrentPage('articles'), color: colors.accent },
        { title: 'Tambah Donasi', icon: FaDonate, action: () => setCurrentPage('donations'), color: '#10b981' },
        { title: 'Kelola Keuangan', icon: FaMoneyBillWave, action: () => setCurrentPage('finance'), color: '#f59e0b' },
        { title: 'Kelola Pengguna', icon: FaUsers, action: () => setCurrentPage('users'), color: '#6366f1' }
    ]

    const getActivityIcon = (resource: string) => {
        switch (resource.toLowerCase()) {
            case 'article':
            case 'articles':
                return FaFileAlt
            case 'donation':
            case 'donations':
                return FaDonate
            case 'gallery':
            case 'galleries':
                return FaImages
            case 'user':
            case 'users':
                return FaUsers
            case 'finance':
            case 'financial':
                return FaMoneyBillWave
            default:
                return FaFileAlt
        }
    }

    const getActivityStatusColor = (status: string) => {
        switch (status) {
            case 'success': return '#10b981'
            case 'failed': return '#ef4444'
            default: return colors.detail
        }
    }

    const getActivityStatusText = (status: string) => {
        switch (status) {
            case 'success': return 'Berhasil'
            case 'failed': return 'Gagal'
            default: return status
        }
    }

    const formatActivityTimestamp = (timestamp: string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffInMs = now.getTime() - date.getTime()
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
        const diffInDays = Math.floor(diffInHours / 24)

        if (diffInHours < 1) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
            return `${diffInMinutes} menit yang lalu`
        } else if (diffInHours < 24) {
            return `${diffInHours} jam yang lalu`
        } else if (diffInDays === 1) {
            return '1 hari yang lalu'
        } else if (diffInDays < 7) {
            return `${diffInDays} hari yang lalu`
        } else {
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        }
    }


    if (currentPage === 'articles') {
        return <AdminArticlePage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'donations') {
        return <AdminDonationPage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'finance') {
        return <AdminFinancePage onBack={() => setCurrentPage('dashboard')} />
    }

    if (currentPage === 'notifications') {
        return <AdminNotificationPage onBack={() => setCurrentPage('dashboard')} />
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
                        {/* Refresh Dashboard */}
                        <button
                            onClick={async () => {
                                // Refresh dashboard stats and try to reload articles
                                await refreshStats()

                                // Refresh featured articles
                                try {
                                    await refetchFeaturedArticles()
                                } catch (error) {
                                    console.warn('Could not refresh featured articles:', error)
                                }

                                // Mark article store data as needing refresh
                                articleStore.markDataAsFresh()
                            }}
                            disabled={isStatsLoading}
                            className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 disabled:opacity-50"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText
                            }}
                            title="Refresh dashboard dan data artikel"
                        >
                            <motion.div
                                animate={isStatsLoading ? { rotate: 360 } : { rotate: 0 }}
                                transition={{ duration: 1, repeat: isStatsLoading ? Infinity : 0, ease: "linear" }}
                            >
                                <FaSync size={16} />
                            </motion.div>
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                className="relative p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
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
                                    {recentActivities.length > 0 ? Math.min(recentActivities.length, 9) : 0}
                                </span>
                            </button>

                            {/* Notification Dropdown */}
                            {isNotificationDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute right-0 mt-2 w-80 rounded-xl border shadow-lg z-50"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border + '30'
                                    }}
                                >
                                    <div className="p-4 border-b" style={{ borderColor: colors.border + '30' }}>
                                        <h3 className="font-semibold" style={{ color: colors.cardText }}>Notifikasi</h3>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {recentActivities.length > 0 ? (
                                            recentActivities.slice(0, 5).map((activity: AdminActivity) => (
                                                <div
                                                    key={activity.id}
                                                    className="p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                                                    style={{ borderColor: colors.border + '20' }}
                                                >
                                                    <div className="flex items-start space-x-3">
                                                        <div
                                                            className="w-2 h-2 rounded-full mt-2"
                                                            style={{
                                                                backgroundColor: getActivityStatusColor(activity.status)
                                                            }}
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm" style={{ color: colors.cardText }}>
                                                                {activity.action}
                                                            </div>
                                                            <div className="text-xs mt-1" style={{ color: colors.detail }}>
                                                                {activity.description}
                                                            </div>
                                                            <div className="text-xs mt-1" style={{ color: colors.detail }}>
                                                                {formatActivityTimestamp(activity.timestamp)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center">
                                                <div
                                                    className="text-sm"
                                                    style={{ color: colors.detail }}
                                                >
                                                    Belum ada notifikasi
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-3 text-center border-t" style={{ borderColor: colors.border + '30' }}>
                                        <button
                                            className="text-sm hover:underline"
                                            style={{ color: colors.accent }}
                                            onClick={() => {
                                                setCurrentPage('notifications')
                                                setIsNotificationDropdownOpen(false)
                                            }}
                                        >
                                            Lihat semua notifikasi
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>

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
                            onClick={logout}
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
                        <div className="space-y-2">
                            {menuItems.map((item, index) => {
                                const Icon = item.icon


                                if (item.hasDropdown && item.subItems) {
                                    return (
                                        <div key={item.title}>
                                            <motion.button
                                                onClick={() => setIsReportsDropdownOpen(!isReportsDropdownOpen)}
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
                                                {isReportsDropdownOpen ? (
                                                    <FaChevronDown size={14} />
                                                ) : (
                                                    <FaChevronRight size={14} />
                                                )}
                                            </motion.button>

                                            {/* Dropdown submenu */}
                                            {isReportsDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="ml-6 mt-2 space-y-1"
                                                >
                                                    {item.subItems.map((subItem, subIndex) => {
                                                        const SubIcon = subItem.icon
                                                        return (
                                                            <motion.button
                                                                key={subItem.title}
                                                                onClick={() => subItem.page && setCurrentPage(subItem.page)}
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                                                                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 w-full text-left ${subItem.active ? 'shadow-sm' : ''
                                                                    }`}
                                                                style={{
                                                                    backgroundColor: subItem.active ? colors.accent + '10' : 'transparent',
                                                                    color: subItem.active ? colors.accent : colors.detail
                                                                }}
                                                            >
                                                                <SubIcon size={16} />
                                                                <span className="text-sm font-medium">{subItem.title}</span>
                                                            </motion.button>
                                                        )
                                                    })}
                                                </motion.div>
                                            )}
                                        </div>
                                    )
                                }


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
                            className="text-lg mb-2"
                            style={{ color: colors.detail }}
                        >
                            Kelola konten Masjid Al-Furqon dengan mudah dari dashboard ini.
                        </p>

                        {/* Data Status Indicator */}
                        <div className="flex items-center space-x-2">
                            <div
                                className="w-2 h-2 rounded-full"
                                style={{
                                    backgroundColor: realArticleCount > 0 ? '#10b981' : '#f59e0b'
                                }}
                            />
                            <span
                                className="text-sm"
                                style={{ color: colors.detail }}
                            >
                                {realArticleCount > 0 ?
                                    `${realArticleCount} artikel ditemukan dari database` :
                                    'Menggunakan data simulasi dashboard'
                                }
                            </span>
                            {isStatsLoading && (
                                <span
                                    className="text-sm"
                                    style={{ color: colors.accent }}
                                >
                                    • Memperbarui...
                                </span>
                            )}
                        </div>
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
                                description: realArticleCount > 0 ?
                                    `${realArticleCount} artikel dari database` :
                                    'Artikel yang telah dipublikasi',
                                formatter: (value: number) => (value ?? 0).toString()
                            },
                            {
                                label: 'Program Donasi',
                                value: stats.activeDonations,
                                icon: FaDonate,
                                color: '#10b981',
                                description: 'Program donasi aktif',
                                formatter: (value: number) => (value ?? 0).toString()
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
                                }).format(value ?? 0)
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
                                }).format(value ?? 0)
                            }
                        ].map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <div
                                    key={stat.label}
                                    className="p-6 rounded-xl border hover:shadow-lg transition-all duration-300 group relative"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border + '30'
                                    }}
                                >
                                    {/* Loading Overlay */}
                                    {isStatsLoading && (
                                        <div className="absolute inset-0 bg-white bg-opacity-50 rounded-xl flex items-center justify-center z-10">
                                            <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                                        </div>
                                    )}

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
                                            {isStatsLoading ? '...' : stat.formatter(stat.value)}
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
                                    {recentActivities.length > 0 ? (
                                        recentActivities.slice(0, 5).map((activity: AdminActivity) => {
                                            const Icon = getActivityIcon(activity.resource)
                                            return (
                                                <div key={activity.id} className="flex items-start space-x-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                        style={{
                                                            backgroundColor: getActivityStatusColor(activity.status) + '20'
                                                        }}
                                                    >
                                                        <Icon size={14} style={{
                                                            color: getActivityStatusColor(activity.status)
                                                        }} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div
                                                            className="text-sm font-medium truncate"
                                                            style={{ color: colors.cardText }}
                                                        >
                                                            {activity.description}
                                                        </div>
                                                        <div
                                                            className="text-xs mt-1 truncate"
                                                            style={{ color: colors.detail }}
                                                        >
                                                            {activity.action} • {activity.userName}
                                                        </div>
                                                        <div className="flex items-center space-x-2 mt-1">
                                                            <span
                                                                className="text-xs"
                                                                style={{ color: colors.detail }}
                                                            >
                                                                {formatActivityTimestamp(activity.timestamp)}
                                                            </span>
                                                            <span
                                                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                                                style={{
                                                                    backgroundColor: getActivityStatusColor(activity.status) + '20',
                                                                    color: getActivityStatusColor(activity.status)
                                                                }}
                                                            >
                                                                {getActivityStatusText(activity.status)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    ) : (
                                        <div className="text-center py-8">
                                            <div
                                                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                                style={{ backgroundColor: colors.detail + '20' }}
                                            >
                                                <FaFileAlt size={24} style={{ color: colors.detail }} />
                                            </div>
                                            <div
                                                className="text-sm font-medium mb-1"
                                                style={{ color: colors.detail }}
                                            >
                                                Belum ada aktivitas
                                            </div>
                                            <div
                                                className="text-xs"
                                                style={{ color: colors.detail + '80' }}
                                            >
                                                Aktivitas terbaru akan muncul di sini
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    )
}
