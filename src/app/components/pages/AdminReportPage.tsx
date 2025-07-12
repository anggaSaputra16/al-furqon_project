'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FaArrowLeft, FaChartBar, FaDownload, FaCalendarAlt, FaEye,
    FaUsers, FaFileAlt, FaDonate, FaArrowUp, FaArrowDown,
    FaFilter, FaPrint, FaShare
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface ReportData {
    period: string
    totalViews: number
    totalArticles: number
    totalDonations: number
    totalUsers: number
    growth: {
        views: number
        articles: number
        donations: number
        users: number
    }
}

interface TopContent {
    id: string
    title: string
    views: number
    type: 'article' | 'donation'
    publishedAt: string
}

interface AdminReportPageProps {
    onBack: () => void
}

export default function AdminReportPage({ onBack }: AdminReportPageProps) {
    const { colors } = useTheme()
    const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
    const [reportData, setReportData] = useState<ReportData>({
        period: 'Bulan ini',
        totalViews: 15750,
        totalArticles: 45,
        totalDonations: 12,
        totalUsers: 3,
        growth: {
            views: 12.5,
            articles: 8.3,
            donations: -2.1,
            users: 0
        }
    })

    const [topContent, setTopContent] = useState<TopContent[]>([
        {
            id: '1',
            title: 'Kajian Rutin Minggu Pagi',
            views: 1250,
            type: 'article',
            publishedAt: '2024-07-01'
        },
        {
            id: '2',
            title: 'Renovasi Mihrab Masjid',
            views: 980,
            type: 'donation',
            publishedAt: '2024-06-25'
        },
        {
            id: '3',
            title: 'Kegiatan Ramadhan 1445H',
            views: 875,
            type: 'article',
            publishedAt: '2024-06-20'
        },
        {
            id: '4',
            title: 'Bantuan Yatim Piatu',
            views: 720,
            type: 'donation',
            publishedAt: '2024-06-15'
        },
        {
            id: '5',
            title: 'Pengajian Akbar Ustadz Ahmad',
            views: 650,
            type: 'article',
            publishedAt: '2024-06-10'
        }
    ])

    const getPeriodLabel = (period: string) => {
        switch (period) {
            case 'week': return 'Minggu ini'
            case 'month': return 'Bulan ini'
            case 'year': return 'Tahun ini'
            default: return 'Bulan ini'
        }
    }

    const getGrowthIcon = (growth: number) => {
        return growth >= 0 ? FaArrowUp : FaArrowDown
    }

    const getGrowthColor = (growth: number) => {
        return growth >= 0 ? '#10b981' : '#ef4444'
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const handleExportReport = () => {
        // Simulate report export
        alert('Laporan sedang diunduh...')
    }

    const handlePrintReport = () => {
        window.print()
    }

    return (
        <div
            className="min-h-screen"
            style={{ backgroundColor: colors.background }}
        >
            {/* Header */}
            <div
                className="sticky top-0 z-10 border-b"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border + '30'
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={onBack}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText
                                }}
                            >
                                <FaArrowLeft size={16} />
                                <span>Kembali</span>
                            </button>
                            <div>
                                <h1
                                    className="text-2xl font-bold"
                                    style={{
                                        color: colors.cardText,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Laporan Aktivitas
                                </h1>
                                <p
                                    className="text-sm"
                                    style={{ color: colors.detail }}
                                >
                                    Analytics dan statistik website Masjid Al-Furqon
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Period Filter */}
                            <select
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`,
                                    '--tw-ring-color': colors.accent
                                } as React.CSSProperties}
                            >
                                <option value="week">Minggu ini</option>
                                <option value="month">Bulan ini</option>
                                <option value="year">Tahun ini</option>
                            </select>

                            {/* Export Button */}
                            <button
                                onClick={handleExportReport}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: colors.accent,
                                    color: 'white'
                                }}
                            >
                                <FaDownload size={16} />
                                <span>Export</span>
                            </button>

                            {/* Print Button */}
                            <button
                                onClick={handlePrintReport}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                <FaPrint size={16} />
                                <span>Print</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Overview Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {[
                        {
                            label: 'Total Kunjungan',
                            value: reportData.totalViews,
                            growth: reportData.growth.views,
                            icon: FaEye,
                            color: '#8b5cf6'
                        },
                        {
                            label: 'Artikel Dipublikasi',
                            value: reportData.totalArticles,
                            growth: reportData.growth.articles,
                            icon: FaFileAlt,
                            color: colors.accent
                        },
                        {
                            label: 'Program Donasi',
                            value: reportData.totalDonations,
                            growth: reportData.growth.donations,
                            icon: FaDonate,
                            color: '#10b981'
                        },
                        {
                            label: 'Admin Aktif',
                            value: reportData.totalUsers,
                            growth: reportData.growth.users,
                            icon: FaUsers,
                            color: '#6366f1'
                        }
                    ].map((stat, index) => {
                        const Icon = stat.icon
                        const GrowthIcon = getGrowthIcon(stat.growth)

                        return (
                            <div
                                key={stat.label}
                                className="p-6 rounded-xl border hover:shadow-lg transition-all duration-300"
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
                                    <div className="text-right">
                                        <div
                                            className="text-2xl font-bold"
                                            style={{ color: colors.cardText }}
                                        >
                                            {stat.value.toLocaleString()}
                                        </div>
                                        <div className="flex items-center justify-end space-x-1">
                                            <GrowthIcon
                                                size={12}
                                                style={{ color: getGrowthColor(stat.growth) }}
                                            />
                                            <span
                                                className="text-xs font-medium"
                                                style={{ color: getGrowthColor(stat.growth) }}
                                            >
                                                {Math.abs(stat.growth)}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.detail }}
                                >
                                    {stat.label}
                                </div>
                            </div>
                        )
                    })}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Top Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        <div
                            className="p-6 rounded-xl border h-full"
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
                                Konten Populer
                            </h3>
                            <div className="space-y-4">
                                {topContent.map((content, index) => (
                                    <div
                                        key={content.id}
                                        className="flex items-center justify-between p-4 rounded-lg border"
                                        style={{
                                            backgroundColor: colors.background,
                                            borderColor: colors.border + '20'
                                        }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                                                style={{
                                                    backgroundColor: colors.accent + '20',
                                                    color: colors.accent
                                                }}
                                            >
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div
                                                    className="font-medium text-sm"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    {content.title}
                                                </div>
                                                <div
                                                    className="text-xs"
                                                    style={{ color: colors.detail }}
                                                >
                                                    {content.type === 'article' ? 'Artikel' : 'Donasi'} • {formatDate(content.publishedAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div
                                                className="font-bold"
                                                style={{ color: colors.cardText }}
                                            >
                                                {content.views.toLocaleString()}
                                            </div>
                                            <div
                                                className="text-xs"
                                                style={{ color: colors.detail }}
                                            >
                                                views
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Monthly Overview Chart Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <div
                            className="p-6 rounded-xl border h-full"
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
                                Grafik Kunjungan {getPeriodLabel(selectedPeriod)}
                            </h3>

                            {/* Chart Placeholder */}
                            <div
                                className="h-64 rounded-lg border-2 border-dashed flex items-center justify-center"
                                style={{
                                    borderColor: colors.border + '40',
                                    backgroundColor: colors.background
                                }}
                            >
                                <div className="text-center">
                                    <FaChartBar
                                        size={48}
                                        className="mx-auto mb-4 opacity-30"
                                        style={{ color: colors.detail }}
                                    />
                                    <h4
                                        className="text-lg font-semibold mb-2"
                                        style={{ color: colors.cardText }}
                                    >
                                        Grafik Analytics
                                    </h4>
                                    <p
                                        className="text-sm"
                                        style={{ color: colors.detail }}
                                    >
                                        Integrasi dengan Google Analytics atau Chart.js dapat ditambahkan di sini
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Activity Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-6"
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
                            Ringkasan Aktivitas
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-4">
                                <div
                                    className="text-3xl font-bold mb-2"
                                    style={{ color: colors.accent }}
                                >
                                    {Math.round(reportData.totalViews / reportData.totalArticles)}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.detail }}
                                >
                                    Rata-rata views per artikel
                                </div>
                            </div>

                            <div className="text-center p-4">
                                <div
                                    className="text-3xl font-bold mb-2"
                                    style={{ color: '#10b981' }}
                                >
                                    {reportData.totalDonations > 0 ? Math.round(reportData.totalViews / reportData.totalDonations) : 0}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.detail }}
                                >
                                    Rata-rata views per donasi
                                </div>
                            </div>

                            <div className="text-center p-4">
                                <div
                                    className="text-3xl font-bold mb-2"
                                    style={{ color: '#8b5cf6' }}
                                >
                                    {Math.round(reportData.totalViews / 30)}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.detail }}
                                >
                                    Rata-rata views per hari
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
