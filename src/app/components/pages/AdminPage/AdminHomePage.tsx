'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FaHome,
    FaDonate,
    FaImages,
    FaUsers,
    FaChartBar,
    FaFileAlt,
    FaSignOutAlt,
    FaBell,
    FaMoneyBillWave,
    FaFileInvoiceDollar,
    FaChevronDown,
    FaChevronRight,
    FaSync,
    FaBars,
    FaTimes,
    FaBuilding,
    FaVideo
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import { useAdminAuthentication } from '../../../hooks/useAdmin'
import { useDashboardStats } from '../../../hooks/useDashboardStats'
import { useArticleStore } from '../../../stores/adminArticleStore'
import { useFeaturedArticles } from '../../../hooks/useHomePageApi'
import { useAdminUsers } from '../../../hooks/useAdminUsers'
import { usePermissions } from '../../RouteGuard'
import { getRolePermissions, ROLE_LABELS, ROLE_COLORS, UserRole } from '../../../types/roleTypes'
import { AdminActivity } from '../../../types/adminResponseTypes'
import AdminArticlePage from './AdminArticlePage'
import AdminDonationPage from './AdminDonationPage'
import AdminUserPage from './AdminUserPage'
import AdminReportPage from './AdminReportPage'
import ForbiddenPage from '../ForbiddenPage'
import AdminSettingsPage from './AdminSettingsPage'
import AdminFinancePage from './AdminFinancePage'
import AdminFinancialReportPage from './AdminFinancialReportPage'
import AdminGrahaSubagdjaPage from './AdminGrahaSubagdjaPage'
import AdminVideoPage from './AdminVideoPage'
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
    page: 'dashboard' | 'articles' | 'donations' | 'users' | 'reports' | 'settings' | 'finance' | 'financial-reports' | 'notifications' | 'graha-subagdja' | 'videos'
    active: boolean
}

interface MenuItem {
    title: string
    icon: any
    page?: 'dashboard' | 'articles' | 'donations' | 'users' | 'reports' | 'settings' | 'finance' | 'financial-reports' | 'notifications' | 'graha-subagdja' | 'videos'
    count?: number
    active: boolean
    hasDropdown?: boolean
    subItems?: MenuSubItem[]
}

export default function AdminHomePage({ adminName = 'Administrator' }: AdminHomePageProps) {

    const { colors } = useTheme()
    const { logout, user } = useAdminAuthentication()
    const { checkPermission, getUserRole } = usePermissions()
    const { stats: dashboardStats, isLoading: isStatsLoading, refreshStats } = useDashboardStats()
    const articleStore = useArticleStore()
    const { articles: featuredArticles, refetch: refetchFeaturedArticles } = useFeaturedArticles()
    const { users, loading: usersLoading, pagination: userPagination } = useAdminUsers()
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'articles' | 'donations' | 'users' | 'reports' | 'settings' | 'finance' | 'financial-reports' | 'notifications' | 'graha-subagdja' | 'videos'>('dashboard')
    const [mounted, setMounted] = useState(false)
    const [isReportsDropdownOpen, setIsReportsDropdownOpen] = useState(false)
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const userRole = getUserRole()
    const userRoleLabel = userRole ? ROLE_LABELS[userRole] : 'Unknown'

    let userPermissions = null
    if (userRole) {
        userPermissions = getRolePermissions(userRole)
    } else if (user?.role) {
        const fallbackRole = user.role as UserRole
        userPermissions = getRolePermissions(fallbackRole)
        console.warn('Using fallback role from user object:', fallbackRole)
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat data pengguna...</p>
                </div>
            </div>
        )
    }

    const realArticleCount = Math.max(
        articleStore.articles?.length || 0,
        featuredArticles?.length || 0
    )

    const realUserCount = Math.max(
        users?.length || 0,
        userPagination?.total || 0
    )

    const stats = {
        totalArticles: realArticleCount > 0 ? realArticleCount : (dashboardStats?.totalArticles ?? 0),
        totalDonations: dashboardStats?.totalDonations ?? 0,
        totalGallery: dashboardStats?.totalGallery ?? 0,
        totalUsers: realUserCount > 0 ? realUserCount : (dashboardStats?.totalUsers ?? 0),
        monthlyViews: dashboardStats?.monthlyViews ?? 0,
        activeDonations: dashboardStats?.activeDonations ?? 0,
        monthlyIncome: dashboardStats?.monthlyIncome ?? 0,
        monthlyExpense: dashboardStats?.monthlyExpense ?? 0,
        totalBalance: dashboardStats?.totalBalance ?? 0
    }

    const recentActivities = dashboardStats?.recentActivities || []

    useEffect(() => {
        setMounted(true)

        if (articleStore.articles.length === 0) {
            const loadArticles = async () => {
                try {
                } catch (error) {
                    console.warn('Could not load articles for dashboard:', error)
                }
            }
            loadArticles()
        }

        // Handle responsive behavior
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMobileMenuOpen(false)
            }
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
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

    const getFilteredMenuItems = (): MenuItem[] => {
        const baseItems: MenuItem[] = []

        if (userPermissions?.canAccessDashboard) {
            baseItems.push({
                title: 'Dashboard',
                icon: FaHome,
                page: 'dashboard' as const,
                active: currentPage === 'dashboard'
            })
        }

        if (userPermissions?.canAccessArticles) {
            baseItems.push({
                title: 'Artikel',
                icon: FaFileAlt,
                page: 'articles' as const,
                count: realArticleCount,
                active: currentPage === 'articles'
            })
        }

        if (userPermissions?.canAccessUsers || (user?.role === 'admin' || user?.role === 'super_admin')) {
            baseItems.push({
                title: 'Pengguna',
                icon: FaUsers,
                page: 'users' as const,
                active: currentPage === 'users'
            })
        }

        if (userPermissions?.canAccessDonations) {
            baseItems.push({
                title: 'Donasi',
                icon: FaDonate,
                page: 'donations' as const,
                count: stats.activeDonations,
                active: currentPage === 'donations'
            })
        }

        if (userPermissions?.canAccessFinance) {
            baseItems.push({
                title: 'Keuangan',
                icon: FaMoneyBillWave,
                page: 'finance' as const,
                active: currentPage === 'finance'
            })
        }

        if (userPermissions?.canAccessReports) {
            baseItems.push({
                title: 'Laporan',
                icon: FaChartBar,
                hasDropdown: true,
                active: currentPage === 'reports' || currentPage === 'financial-reports',
                subItems: [
                    { title: 'Laporan Keuangan', icon: FaFileInvoiceDollar, page: 'financial-reports' as const, active: currentPage === 'financial-reports' },
                    { title: 'Laporan Artikel', icon: FaFileAlt, page: 'reports' as const, active: currentPage === 'reports' }
                ]
            })
        }

        if (userPermissions?.canAccessGraha || (user?.role === 'admin' || user?.role === 'super_admin')) {
            baseItems.push({
                title: 'Graha Subagdja',
                icon: FaBuilding,
                page: 'graha-subagdja' as const,
                active: currentPage === 'graha-subagdja'
            })
        }

        if (userPermissions?.canAccessArticles || (user?.role === 'admin' || user?.role === 'super_admin')) {
            baseItems.push({
                title: 'Video',
                icon: FaVideo,
                page: 'videos' as const,
                active: currentPage === 'videos'
            })
        }

        return baseItems
    }

    const menuItems = getFilteredMenuItems()


    const getFilteredQuickActions = () => {
        const actions = []

        if (userPermissions?.canAccessArticles && userPermissions?.canCreateArticles) {
            actions.push({ title: 'Buat Artikel Baru', icon: FaFileAlt, action: () => setCurrentPage('articles'), color: colors.accent })
        }

        if (userPermissions?.canAccessDonations) {
            actions.push({ title: 'Tambah Donasi', icon: FaDonate, action: () => setCurrentPage('donations'), color: '#10b981' })
        }

        if (userPermissions?.canAccessFinance) {
            actions.push({ title: 'Kelola Keuangan', icon: FaMoneyBillWave, action: () => setCurrentPage('finance'), color: '#f59e0b' })
        }

        if ((userPermissions?.canAccessUsers && userPermissions?.canCreateUsers) || (user?.role === 'admin' || user?.role === 'super_admin')) {
            actions.push({ title: 'Kelola Pengguna', icon: FaUsers, action: () => setCurrentPage('users'), color: '#6366f1' })
        }

        if (userPermissions?.canAccessGraha || (user?.role === 'admin' || user?.role === 'super_admin')) {
            actions.push({ title: 'Kelola Graha Subagdja', icon: FaBuilding, action: () => setCurrentPage('graha-subagdja'), color: '#8b5cf6' })
        }

        if (userPermissions?.canAccessArticles || (user?.role === 'admin' || user?.role === 'super_admin')) {
            actions.push({ title: 'Kelola Video', icon: FaVideo, action: () => setCurrentPage('videos'), color: '#ef4444' })
        }

        return actions
    }

    const quickActions = getFilteredQuickActions()
    const getRoleBasedStats = () => {
        const baseStats = []

        if (userPermissions?.canAccessArticles) {
            baseStats.push({
                label: 'Total Artikel',
                value: stats.totalArticles,
                icon: FaFileAlt,
                color: colors.accent,
                description: realArticleCount > 0 ?
                    `${realArticleCount} artikel dari database` :
                    'Artikel yang telah dipublikasi',
                formatter: (value: number) => (value ?? 0).toString()
            })
        }

        if (userPermissions?.canAccessUsers) {
            baseStats.push({
                label: 'Total Pengguna',
                value: stats.totalUsers,
                icon: FaUsers,
                color: '#6366f1',
                description: realUserCount > 0 ?
                    `${realUserCount} pengguna dari database` :
                    'Pengguna terdaftar',
                formatter: (value: number) => (value ?? 0).toString()
            })
        }

        if (userPermissions?.canAccessDonations) {
            baseStats.push({
                label: 'Program Donasi',
                value: stats.activeDonations,
                icon: FaDonate,
                color: '#10b981',
                description: 'Program donasi aktif',
                formatter: (value: number) => (value ?? 0).toString()
            })
        }


        if (userPermissions?.canAccessFinance) {
            baseStats.push({
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
            })

            baseStats.push({
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
            })
        }

        return baseStats
    }

    const roleBasedStats = getRoleBasedStats()


    const getRoleBasedWelcomeMessage = () => {
        switch (userRole) {
            case 'super_admin':
                return 'Kelola semua aspek Masjid Al-Furqon dengan akses penuh.'
            case 'admin':
                return 'Kelola artikel, pengguna, dan Graha Subagdja Masjid Al-Furqon.'
            case 'editor':
                return 'Kelola artikel, pengguna, dan Graha Subagdja Masjid Al-Furqon.'
            case 'reviewer':
                return 'Pantau dan review artikel yang telah dipublikasikan.'
            case 'viewer':
                return 'Lihat informasi artikel dan konten Masjid Al-Furqon.'
            default:
                return 'Kelola konten Masjid Al-Furqon dengan mudah dari dashboard ini.'
        }
    }

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

    const handlePageNavigation = (page: string) => {
        switch (page) {
            case 'articles':
                if (!userPermissions?.canAccessArticles) {
                    return <ForbiddenPage
                        requiredRole="Editor, Reviewer, Viewer atau lebih tinggi"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminArticlePage onBack={() => setCurrentPage('dashboard')} />
            case 'users':
                if (!userPermissions?.canAccessUsers) {
                    return <ForbiddenPage
                        requiredRole="Admin atau Super Admin"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminUserPage onBack={() => setCurrentPage('dashboard')} />
            case 'donations':
                if (!userPermissions?.canAccessDonations) {
                    return <ForbiddenPage
                        requiredRole="Super Admin"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminDonationPage onBack={() => setCurrentPage('dashboard')} />
            case 'finance':
                if (!userPermissions?.canAccessFinance) {
                    return <ForbiddenPage
                        requiredRole="Super Admin"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminFinancePage onBack={() => setCurrentPage('dashboard')} />
            case 'reports':
                if (!userPermissions?.canAccessReports) {
                    return <ForbiddenPage
                        requiredRole="Super Admin"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminReportPage onBack={() => setCurrentPage('dashboard')} />
            case 'financial-reports':
                if (!userPermissions?.canAccessReports) {
                    return <ForbiddenPage
                        requiredRole="Super Admin"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminFinancialReportPage onBack={() => setCurrentPage('dashboard')} />

            case 'settings':
                if (!userRole || !['super_admin', 'admin'].includes(userRole)) {
                    return <ForbiddenPage
                        requiredRole="Admin atau Super Admin"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminSettingsPage onBack={() => setCurrentPage('dashboard')} />
            case 'graha-subagdja':
                if (!userPermissions?.canAccessGraha) {
                    return <ForbiddenPage
                        requiredRole="Admin atau Super Admin"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminGrahaSubagdjaPage onBack={() => setCurrentPage('dashboard')} />
            case 'videos':
                if (!userPermissions?.canAccessArticles) {
                    return <ForbiddenPage
                        requiredRole="Editor, Reviewer, Viewer atau lebih tinggi"
                        userRole={userRoleLabel}
                        onBack={() => setCurrentPage('dashboard')}
                    />
                }
                return <AdminVideoPage onBack={() => setCurrentPage('dashboard')} />
            default:
                return null
        }
    }


    if (currentPage !== 'dashboard') {
        return handlePageNavigation(currentPage)
    }

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: colors.background }}
        >
            <header
                className="sticky top-0 z-[60] px-4 md:px-6 py-4 border-b backdrop-blur-md backdrop-saturate-150"
                style={{
                    backgroundColor: colors.card + 'E6',
                    borderColor: colors.border + '40',
                    backdropFilter: 'blur(12px) saturate(180%)'
                }}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 md:space-x-4">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText
                            }}
                            title="Toggle Menu"
                        >
                            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                        </button>

                        <h1
                            className="text-xl md:text-2xl font-bold"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)'
                            }}
                        >
                            Admin Panel
                        </h1>
                        <div
                            className="hidden sm:block px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                                backgroundColor: colors.accent + '20',
                                color: colors.accent
                            }}
                        >
                            Al-Furqon CMS
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 md:space-x-4">
                        <button
                            onClick={async () => {
                                await refreshStats()
                                try {
                                    await refetchFeaturedArticles()
                                } catch (error) {
                                    console.warn('Could not refresh featured articles:', error)
                                }
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

                            {isNotificationDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-80 max-w-[90vw] rounded-xl border shadow-xl z-[100]"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border + '30',
                                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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

            <div className="flex min-h-screen">
                {isMobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[50] lg:hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                )}

                <aside
                    className={`w-64 min-h-screen border-r fixed lg:relative z-[60] transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                        } lg:block`}
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
                                                                onClick={() => {
                                                                    if (subItem.page) {
                                                                        setCurrentPage(subItem.page)
                                                                        setIsMobileMenuOpen(false)
                                                                    }
                                                                }}
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
                                        onClick={() => {
                                            if (item.page) {
                                                setCurrentPage(item.page)
                                                setIsMobileMenuOpen(false)
                                            }
                                        }}
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

                <main className="flex-1 lg:ml-0 p-4 md:p-6 w-full min-w-0">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-6 md:mb-8"
                    >
                        <h2
                            className="text-2xl md:text-3xl font-bold mb-2"
                            style={{
                                color: colors.cardText,
                                fontFamily: 'var(--font-header-modern)'
                            }}
                        >
                            Selamat datang, {adminName}! 👋
                            {userRole && (
                                <span
                                    className="block sm:inline ml-0 sm:ml-3 mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-medium"
                                    style={{
                                        backgroundColor: ROLE_COLORS[userRole] + '20',
                                        color: ROLE_COLORS[userRole]
                                    }}
                                >
                                    {ROLE_LABELS[userRole]}
                                </span>
                            )}
                        </h2>
                        <p
                            className="text-base md:text-lg mb-2"
                            style={{ color: colors.detail }}
                        >
                            {getRoleBasedWelcomeMessage()}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
                                        `${realArticleCount} artikel dari database` :
                                        'Data artikel simulasi'
                                    }
                                </span>
                            </div>

                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-2 h-2 rounded-full"
                                    style={{
                                        backgroundColor: realUserCount > 0 ? '#10b981' : '#f59e0b'
                                    }}
                                />
                                <span
                                    className="text-sm"
                                    style={{ color: colors.detail }}
                                >
                                    {realUserCount > 0 ?
                                        `${realUserCount} pengguna dari database` :
                                        'Data pengguna simulasi'
                                    }
                                </span>
                            </div>

                            {(isStatsLoading || usersLoading) && (
                                <span
                                    className="text-sm"
                                    style={{ color: colors.accent }}
                                >
                                    • Memperbarui...
                                </span>
                            )}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className={`grid gap-4 md:gap-6 mb-6 md:mb-8 ${roleBasedStats.length === 1 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
                            roleBasedStats.length === 2 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
                                roleBasedStats.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' :
                                    roleBasedStats.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                                        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'
                            }`}
                    >
                        {roleBasedStats.map((stat, index) => {
                            const Icon = stat.icon
                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    className="p-4 md:p-6 rounded-xl border hover:shadow-lg transition-all duration-300 group relative"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border + '30'
                                    }}
                                >
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
                                </motion.div>
                            )
                        })}
                    </motion.div>

                    <div className={`grid gap-4 md:gap-6 ${quickActions.length > 0 ? 'grid-cols-1 xl:grid-cols-3' : 'grid-cols-1'}`}>
                        {quickActions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="xl:col-span-2"
                            >
                                <div
                                    className="p-4 md:p-6 rounded-xl border"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border + '30'
                                    }}
                                >
                                    <h3
                                        className="text-lg md:text-xl font-bold mb-4 md:mb-6"
                                        style={{
                                            color: colors.cardText,
                                            fontFamily: 'var(--font-header-modern)'
                                        }}
                                    >
                                        Aksi Cepat
                                    </h3>
                                    <div className={`grid gap-3 md:gap-4 ${quickActions.length === 1 ? 'grid-cols-1 max-w-sm' :
                                        quickActions.length === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                                            quickActions.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                                                'grid-cols-1 sm:grid-cols-2'
                                        }`}>
                                        {quickActions.map((action, index) => {
                                            const Icon = action.icon
                                            return (
                                                <button
                                                    key={action.title}
                                                    onClick={action.action}
                                                    className="p-3 md:p-4 rounded-lg border-2 border-dashed transition-all duration-200 hover:border-solid hover:shadow-md hover:scale-105 text-left"
                                                    style={{
                                                        borderColor: action.color + '40',
                                                        color: action.color
                                                    }}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <Icon size={18} className="flex-shrink-0" />
                                                        <span className="font-medium text-sm md:text-base">{action.title}</span>
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className={`${quickActions.length > 0 ? '' : 'max-w-2xl mx-auto'}`}
                        >
                            <div
                                className="p-4 md:p-6 rounded-xl border"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border + '30'
                                }}
                            >
                                <h3
                                    className="text-lg md:text-xl font-bold mb-4 md:mb-6"
                                    style={{
                                        color: colors.cardText,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Aktivitas Terbaru
                                </h3>
                                <div className="space-y-3 md:space-y-4">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.slice(0, 5).map((activity: AdminActivity) => {
                                            const Icon = getActivityIcon(activity.resource)
                                            return (
                                                <div key={activity.id} className="flex items-start space-x-3">
                                                    <div
                                                        className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                                                        style={{
                                                            backgroundColor: getActivityStatusColor(activity.status) + '20'
                                                        }}
                                                    >
                                                        <Icon size={12} className="md:w-3.5 md:h-3.5" style={{
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
                                                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mt-1">
                                                            <span
                                                                className="text-xs"
                                                                style={{ color: colors.detail }}
                                                            >
                                                                {formatActivityTimestamp(activity.timestamp)}
                                                            </span>
                                                            <span
                                                                className="px-2 py-0.5 rounded-full text-xs font-medium inline-block mt-1 sm:mt-0"
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
                                        <div className="text-center py-6 md:py-8">
                                            <div
                                                className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4"
                                                style={{ backgroundColor: colors.detail + '20' }}
                                            >
                                                <FaFileAlt size={20} className="md:w-6 md:h-6" style={{ color: colors.detail }} />
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
