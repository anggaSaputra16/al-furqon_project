'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FaArrowLeft, FaCalendarAlt, FaChartPie, FaChartLine, FaChartBar,
    FaDownload, FaPrint, FaEye, FaFilter, FaMoneyBillWave,
    FaArrowUp, FaArrowDown, FaArrowCircleUp, FaArrowCircleDown,
    FaFileInvoiceDollar, FaPercentage
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface FinancialReportData {
    period: string
    totalIncome: number
    totalExpense: number
    netBalance: number
    incomeGrowth: number
    expenseGrowth: number
    balanceGrowth: number
    categoryBreakdown: {
        category: string
        type: 'income' | 'expense'
        amount: number
        percentage: number
        transactions: number
    }[]
    monthlyData: {
        month: string
        income: number
        expense: number
        balance: number
    }[]
    topTransactions: {
        description: string
        category: string
        amount: number
        date: string
        type: 'income' | 'expense'
    }[]
}

interface AdminFinancialReportPageProps {
    onBack: () => void
}

export default function AdminFinancialReportPage({ onBack }: AdminFinancialReportPageProps) {
    const { colors } = useTheme()
    const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month')
    const [selectedYear, setSelectedYear] = useState<number>(2024)
    const [selectedMonth, setSelectedMonth] = useState<number>(7)

    // Sample data - in real app, this would come from API
    const [reportData, setReportData] = useState<FinancialReportData>({
        period: 'Juli 2024',
        totalIncome: 18250000,
        totalExpense: 8750000,
        netBalance: 9500000,
        incomeGrowth: 15.3,
        expenseGrowth: -8.2,
        balanceGrowth: 28.7,
        categoryBreakdown: [
            { category: 'Zakat', type: 'income', amount: 12500000, percentage: 68.5, transactions: 1 },
            { category: 'Donasi', type: 'income', amount: 5000000, percentage: 27.4, transactions: 1 },
            { category: 'Infaq Jumat', type: 'income', amount: 750000, percentage: 4.1, transactions: 4 },
            { category: 'Operasional', type: 'expense', amount: 4500000, percentage: 51.4, transactions: 8 },
            { category: 'Pemeliharaan', type: 'expense', amount: 3000000, percentage: 34.3, transactions: 5 },
            { category: 'Konsumsi', type: 'expense', amount: 1250000, percentage: 14.3, transactions: 12 }
        ],
        monthlyData: [
            { month: 'Jan', income: 15000000, expense: 7500000, balance: 7500000 },
            { month: 'Feb', income: 12000000, expense: 8000000, balance: 4000000 },
            { month: 'Mar', income: 18000000, expense: 9500000, balance: 8500000 },
            { month: 'Apr', income: 14500000, expense: 7800000, balance: 6700000 },
            { month: 'May', income: 16800000, expense: 8200000, balance: 8600000 },
            { month: 'Jun', income: 15900000, expense: 9500000, balance: 6400000 },
            { month: 'Jul', income: 18250000, expense: 8750000, balance: 9500000 }
        ],
        topTransactions: [
            { description: 'Zakat Fitrah 1445H', category: 'Zakat', amount: 12500000, date: '2024-07-08', type: 'income' },
            { description: 'Donasi Renovasi Mihrab', category: 'Donasi', amount: 5000000, date: '2024-07-12', type: 'income' },
            { description: 'Renovasi AC Ruang Utama', category: 'Pemeliharaan', amount: 2500000, date: '2024-07-15', type: 'expense' },
            { description: 'Listrik dan Air', category: 'Operasional', amount: 1500000, date: '2024-07-01', type: 'expense' },
            { description: 'Konsumsi Kajian Rutin', category: 'Konsumsi', amount: 800000, date: '2024-07-20', type: 'expense' }
        ]
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatPercentage = (value: number) => {
        return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const getGrowthColor = (growth: number) => {
        return growth >= 0 ? '#10b981' : '#ef4444'
    }

    const getGrowthIcon = (growth: number) => {
        return growth >= 0 ? FaArrowCircleUp : FaArrowCircleDown
    }

    const handleExportReport = () => {
        alert('Laporan keuangan akan diexport ke PDF/Excel')
    }

    const handlePrintReport = () => {
        window.print()
    }

    const getPeriodLabel = () => {
        switch (selectedPeriod) {
            case 'month':
                const monthNames = [
                    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ]
                return `${monthNames[selectedMonth - 1]} ${selectedYear}`
            case 'quarter':
                const quarter = Math.ceil(selectedMonth / 3)
                return `Kuartal ${quarter} ${selectedYear}`
            case 'year':
                return `Tahun ${selectedYear}`
            default:
                return reportData.period
        }
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
                                    Laporan Keuangan
                                </h1>
                                <p
                                    className="text-sm"
                                    style={{ color: colors.detail }}
                                >
                                    Laporan keuangan {getPeriodLabel()}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* Period Filter */}
                            <div className="flex items-center space-x-2">
                                <select
                                    value={selectedPeriod}
                                    onChange={(e) => setSelectedPeriod(e.target.value as any)}
                                    className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText,
                                        border: `1px solid ${colors.border}`,
                                        '--tw-ring-color': colors.accent
                                    } as React.CSSProperties}
                                >
                                    <option value="month">Bulanan</option>
                                    <option value="quarter">Kuartalan</option>
                                    <option value="year">Tahunan</option>
                                </select>

                                {selectedPeriod === 'month' && (
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                        className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.cardText,
                                            border: `1px solid ${colors.border}`,
                                            '--tw-ring-color': colors.accent
                                        } as React.CSSProperties}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(2024, i).toLocaleDateString('id-ID', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                )}

                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText,
                                        border: `1px solid ${colors.border}`,
                                        '--tw-ring-color': colors.accent
                                    } as React.CSSProperties}
                                >
                                    <option value={2023}>2023</option>
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                </select>
                            </div>

                            <button
                                onClick={handleExportReport}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: colors.background,
                                    color: colors.cardText,
                                    border: `1px solid ${colors.border}`
                                }}
                            >
                                <FaDownload size={16} />
                                <span>Export</span>
                            </button>

                            <button
                                onClick={handlePrintReport}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: colors.accent,
                                    color: 'white'
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
                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    {/* Total Income */}
                    <div
                        className="p-6 rounded-xl border"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '30'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: '#10b98120' }}
                            >
                                <FaArrowUp size={24} style={{ color: '#10b981' }} />
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-2">
                                    {(() => {
                                        const GrowthIcon = getGrowthIcon(reportData.incomeGrowth)
                                        return <GrowthIcon size={16} style={{ color: getGrowthColor(reportData.incomeGrowth) }} />
                                    })()}
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: getGrowthColor(reportData.incomeGrowth) }}
                                    >
                                        {formatPercentage(reportData.incomeGrowth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="text-2xl font-bold mb-2"
                            style={{ color: colors.cardText }}
                        >
                            {formatCurrency(reportData.totalIncome)}
                        </div>
                        <div
                            className="text-sm font-medium"
                            style={{ color: colors.detail }}
                        >
                            Total Pemasukan
                        </div>
                    </div>

                    {/* Total Expense */}
                    <div
                        className="p-6 rounded-xl border"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '30'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: '#ef444420' }}
                            >
                                <FaArrowDown size={24} style={{ color: '#ef4444' }} />
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-2">
                                    {(() => {
                                        const GrowthIcon = getGrowthIcon(reportData.expenseGrowth)
                                        return <GrowthIcon size={16} style={{ color: getGrowthColor(reportData.expenseGrowth) }} />
                                    })()}
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: getGrowthColor(reportData.expenseGrowth) }}
                                    >
                                        {formatPercentage(reportData.expenseGrowth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="text-2xl font-bold mb-2"
                            style={{ color: colors.cardText }}
                        >
                            {formatCurrency(reportData.totalExpense)}
                        </div>
                        <div
                            className="text-sm font-medium"
                            style={{ color: colors.detail }}
                        >
                            Total Pengeluaran
                        </div>
                    </div>

                    {/* Net Balance */}
                    <div
                        className="p-6 rounded-xl border"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '30'
                        }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: colors.accent + '20' }}
                            >
                                <FaMoneyBillWave size={24} style={{ color: colors.accent }} />
                            </div>
                            <div className="text-right">
                                <div className="flex items-center space-x-2">
                                    {(() => {
                                        const GrowthIcon = getGrowthIcon(reportData.balanceGrowth)
                                        return <GrowthIcon size={16} style={{ color: getGrowthColor(reportData.balanceGrowth) }} />
                                    })()}
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: getGrowthColor(reportData.balanceGrowth) }}
                                    >
                                        {formatPercentage(reportData.balanceGrowth)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            className="text-2xl font-bold mb-2"
                            style={{
                                color: reportData.netBalance >= 0 ? '#10b981' : '#ef4444'
                            }}
                        >
                            {formatCurrency(reportData.netBalance)}
                        </div>
                        <div
                            className="text-sm font-medium"
                            style={{ color: colors.detail }}
                        >
                            Saldo Bersih
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* Category Breakdown */}
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
                            <div className="flex items-center justify-between mb-6">
                                <h3
                                    className="text-xl font-bold"
                                    style={{
                                        color: colors.cardText,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Breakdown per Kategori
                                </h3>
                                <FaChartPie size={20} style={{ color: colors.accent }} />
                            </div>

                            <div className="space-y-4">
                                {reportData.categoryBreakdown.map((category, index) => (
                                    <div key={category.category} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{
                                                        backgroundColor: category.type === 'income' ? '#10b981' : '#ef4444'
                                                    }}
                                                />
                                                <span
                                                    className="font-medium"
                                                    style={{ color: colors.cardText }}
                                                >
                                                    {category.category}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className="font-bold"
                                                    style={{
                                                        color: category.type === 'income' ? '#10b981' : '#ef4444'
                                                    }}
                                                >
                                                    {formatCurrency(category.amount)}
                                                </div>
                                                <div
                                                    className="text-xs"
                                                    style={{ color: colors.detail }}
                                                >
                                                    {category.percentage}% • {category.transactions} transaksi
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className="w-full bg-gray-200 rounded-full h-2"
                                            style={{ backgroundColor: colors.background }}
                                        >
                                            <div
                                                className="h-2 rounded-full"
                                                style={{
                                                    width: `${category.percentage}%`,
                                                    backgroundColor: category.type === 'income' ? '#10b981' : '#ef4444'
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Monthly Trend Chart */}
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
                            <div className="flex items-center justify-between mb-6">
                                <h3
                                    className="text-xl font-bold"
                                    style={{
                                        color: colors.cardText,
                                        fontFamily: 'var(--font-header-modern)'
                                    }}
                                >
                                    Trend Bulanan
                                </h3>
                                <FaChartLine size={20} style={{ color: colors.accent }} />
                            </div>

                            {/* Chart Placeholder */}
                            <div
                                className="h-64 rounded-lg border-2 border-dashed flex flex-col items-center justify-center"
                                style={{
                                    borderColor: colors.border + '40',
                                    backgroundColor: colors.background
                                }}
                            >
                                <FaChartBar
                                    size={48}
                                    className="mb-4 opacity-30"
                                    style={{ color: colors.detail }}
                                />
                                <h4
                                    className="text-lg font-semibold mb-2"
                                    style={{ color: colors.cardText }}
                                >
                                    Grafik Trend Keuangan
                                </h4>
                                <p
                                    className="text-sm text-center"
                                    style={{ color: colors.detail }}
                                >
                                    Visualisasi perbandingan pemasukan dan pengeluaran<br />
                                    per bulan dalam bentuk chart interaktif
                                </p>
                            </div>

                            {/* Simple Data Points */}
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div
                                        className="text-lg font-bold"
                                        style={{ color: '#10b981' }}
                                    >
                                        +{formatPercentage(15.3)}
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: colors.detail }}
                                    >
                                        Pemasukan vs bulan lalu
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className="text-lg font-bold"
                                        style={{ color: '#ef4444' }}
                                    >
                                        {formatPercentage(-8.2)}
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: colors.detail }}
                                    >
                                        Pengeluaran vs bulan lalu
                                    </div>
                                </div>
                                <div>
                                    <div
                                        className="text-lg font-bold"
                                        style={{ color: colors.accent }}
                                    >
                                        +{formatPercentage(28.7)}
                                    </div>
                                    <div
                                        className="text-xs"
                                        style={{ color: colors.detail }}
                                    >
                                        Saldo bersih vs bulan lalu
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Top Transactions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mb-8"
                >
                    <div
                        className="p-6 rounded-xl border"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border + '30'
                        }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h3
                                className="text-xl font-bold"
                                style={{
                                    color: colors.cardText,
                                    fontFamily: 'var(--font-header-modern)'
                                }}
                            >
                                Transaksi Terbesar
                            </h3>
                            <FaFileInvoiceDollar size={20} style={{ color: colors.accent }} />
                        </div>

                        <div className="space-y-4">
                            {reportData.topTransactions.map((transaction, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-4 rounded-lg border"
                                    style={{
                                        backgroundColor: colors.background,
                                        borderColor: colors.border + '20'
                                    }}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold"
                                            style={{
                                                backgroundColor: transaction.type === 'income' ? '#10b98120' : '#ef444420',
                                                color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                                            }}>
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div
                                                className="font-semibold"
                                                style={{ color: colors.cardText }}
                                            >
                                                {transaction.description}
                                            </div>
                                            <div className="flex items-center space-x-2 text-sm">
                                                <span
                                                    className="px-2 py-1 rounded-full text-xs"
                                                    style={{
                                                        backgroundColor: transaction.type === 'income' ? '#10b98120' : '#ef444420',
                                                        color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                                                    }}
                                                >
                                                    {transaction.category}
                                                </span>
                                                <span style={{ color: colors.detail }}>
                                                    • {formatDate(transaction.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="text-lg font-bold"
                                        style={{
                                            color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                                        }}
                                    >
                                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Financial Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
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
                            Ringkasan Keuangan {getPeriodLabel()}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                                <div
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: colors.accent }}
                                >
                                    {Math.round((reportData.totalIncome / reportData.categoryBreakdown.filter(c => c.type === 'income').reduce((sum, c) => sum + c.transactions, 0)))}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.detail }}
                                >
                                    Rata-rata pemasukan per transaksi
                                </div>
                            </div>

                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                                <div
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: '#ef4444' }}
                                >
                                    {Math.round((reportData.totalExpense / reportData.categoryBreakdown.filter(c => c.type === 'expense').reduce((sum, c) => sum + c.transactions, 0)))}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.detail }}
                                >
                                    Rata-rata pengeluaran per transaksi
                                </div>
                            </div>

                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                                <div
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: '#10b981' }}
                                >
                                    {Math.round((reportData.totalIncome / reportData.totalExpense) * 100)}%
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.detail }}
                                >
                                    Rasio pemasukan vs pengeluaran
                                </div>
                            </div>

                            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: colors.background }}>
                                <div
                                    className="text-2xl font-bold mb-2"
                                    style={{ color: colors.accent }}
                                >
                                    {reportData.categoryBreakdown.reduce((sum, c) => sum + c.transactions, 0)}
                                </div>
                                <div
                                    className="text-sm font-medium"
                                    style={{ color: colors.detail }}
                                >
                                    Total transaksi periode ini
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
