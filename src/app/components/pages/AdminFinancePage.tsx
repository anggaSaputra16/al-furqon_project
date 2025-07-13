'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaArrowLeft, FaPlus, FaSearch, FaEdit, FaTrash,
    FaMoneyBillWave, FaArrowUp, FaArrowDown, FaCalendarAlt,
    FaDownload, FaFileInvoiceDollar
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface FinancialTransaction {
    id: string
    date: string
    type: 'income' | 'expense'
    category: string
    description: string
    amount: number
    reference?: string
    createdBy: string
    createdAt: string
}

interface FinancialCategory {
    id: string
    name: string
    type: 'income' | 'expense'
    color: string
}

interface AdminFinancePage {
    onBack: () => void
}

export default function AdminFinancePage({ onBack }: AdminFinancePage) {
    const { colors } = useTheme()
    const [transactions, setTransactions] = useState<FinancialTransaction[]>([
        {
            id: '1',
            date: '2024-07-12',
            type: 'income',
            category: 'Donasi',
            description: 'Donasi Renovasi Mihrab',
            amount: 5000000,
            reference: 'REF001',
            createdBy: 'Admin',
            createdAt: '2024-07-12T10:00:00Z'
        },
        {
            id: '2',
            date: '2024-07-11',
            type: 'income',
            category: 'Infaq Jumat',
            description: 'Infaq Sholat Jumat',
            amount: 750000,
            createdBy: 'Admin',
            createdAt: '2024-07-11T13:00:00Z'
        },
        {
            id: '3',
            date: '2024-07-10',
            type: 'expense',
            category: 'Operasional',
            description: 'Listrik dan Air Bulan Juli',
            amount: 450000,
            reference: 'INV-072024',
            createdBy: 'Admin',
            createdAt: '2024-07-10T09:00:00Z'
        },
        {
            id: '4',
            date: '2024-07-09',
            type: 'expense',
            category: 'Pemeliharaan',
            description: 'Service AC Ruang Utama',
            amount: 300000,
            createdBy: 'Admin',
            createdAt: '2024-07-09T14:00:00Z'
        },
        {
            id: '5',
            date: '2024-07-08',
            type: 'income',
            category: 'Zakat',
            description: 'Zakat Fitrah 1445H',
            amount: 12500000,
            createdBy: 'Admin',
            createdAt: '2024-07-08T16:00:00Z'
        }
    ])

    const [categories] = useState<FinancialCategory[]>([
        { id: '1', name: 'Donasi', type: 'income', color: '#10b981' },
        { id: '2', name: 'Infaq Jumat', type: 'income', color: '#059669' },
        { id: '3', name: 'Zakat', type: 'income', color: '#047857' },
        { id: '4', name: 'Sedekah', type: 'income', color: '#065f46' },
        { id: '5', name: 'Operasional', type: 'expense', color: '#ef4444' },
        { id: '6', name: 'Pemeliharaan', type: 'expense', color: '#dc2626' },
        { id: '7', name: 'Konsumsi', type: 'expense', color: '#b91c1c' },
        { id: '8', name: 'Transport', type: 'expense', color: '#991b1b' }
    ])

    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
    const [filterCategory, setFilterCategory] = useState<string>('all')
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState<FinancialTransaction | null>(null)
    const [newTransaction, setNewTransaction] = useState<Partial<FinancialTransaction>>({
        type: 'income',
        category: '',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        reference: ''
    })


    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const netBalance = totalIncome - totalExpense


    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch =
            transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesType = filterType === 'all' || transaction.type === filterType
        const matchesCategory = filterCategory === 'all' || transaction.category === filterCategory

        return matchesSearch && matchesType && matchesCategory
    })

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const getCategoryColor = (categoryName: string) => {
        const category = categories.find(c => c.name === categoryName)
        return category?.color || colors.detail
    }

    const handleAddTransaction = () => {
        if (!newTransaction.category || !newTransaction.description || !newTransaction.amount) {
            alert('Mohon lengkapi semua field yang diperlukan!')
            return
        }

        const transaction: FinancialTransaction = {
            id: Date.now().toString(),
            date: newTransaction.date!,
            type: newTransaction.type!,
            category: newTransaction.category!,
            description: newTransaction.description!,
            amount: Number(newTransaction.amount!),
            reference: newTransaction.reference || undefined,
            createdBy: 'Admin',
            createdAt: new Date().toISOString()
        }

        setTransactions([transaction, ...transactions])
        setNewTransaction({
            type: 'income',
            category: '',
            description: '',
            amount: 0,
            date: new Date().toISOString().split('T')[0],
            reference: ''
        })
        setShowAddModal(false)
    }

    const handleDeleteTransaction = (id: string) => {
        if (confirm('Yakin ingin menghapus transaksi ini?')) {
            setTransactions(transactions.filter(t => t.id !== id))
        }
    }

    const handleExportData = () => {
        alert('Export data keuangan akan diimplementasikan')
    }

    const getAvailableCategories = () => {
        return categories.filter(c => c.type === newTransaction.type)
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
                                    Pembukuan Keuangan
                                </h1>
                                <p
                                    className="text-sm"
                                    style={{ color: colors.detail }}
                                >
                                    Kelola pemasukan dan pengeluaran masjid
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleExportData}
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
                                onClick={() => setShowAddModal(true)}
                                className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                                style={{
                                    backgroundColor: colors.accent,
                                    color: 'white'
                                }}
                            >
                                <FaPlus size={16} />
                                <span>Tambah Transaksi</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Financial Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
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
                                <div
                                    className="text-2xl font-bold"
                                    style={{ color: '#10b981' }}
                                >
                                    {formatCurrency(totalIncome)}
                                </div>
                            </div>
                        </div>
                        <div
                            className="text-sm font-medium"
                            style={{ color: colors.detail }}
                        >
                            Total Pemasukan
                        </div>
                    </div>

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
                                <div
                                    className="text-2xl font-bold"
                                    style={{ color: '#ef4444' }}
                                >
                                    {formatCurrency(totalExpense)}
                                </div>
                            </div>
                        </div>
                        <div
                            className="text-sm font-medium"
                            style={{ color: colors.detail }}
                        >
                            Total Pengeluaran
                        </div>
                    </div>

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
                                <div
                                    className="text-2xl font-bold"
                                    style={{ color: netBalance >= 0 ? '#10b981' : '#ef4444' }}
                                >
                                    {formatCurrency(netBalance)}
                                </div>
                            </div>
                        </div>
                        <div
                            className="text-sm font-medium"
                            style={{ color: colors.detail }}
                        >
                            Saldo Bersih
                        </div>
                    </div>
                </motion.div>

                {/* Filters */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <FaSearch
                            className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            size={16}
                            style={{ color: colors.detail }}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari transaksi..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                backgroundColor: colors.card,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                '--tw-ring-color': colors.accent
                            } as React.CSSProperties}
                        />
                    </div>

                    {/* Type Filter */}
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{
                            backgroundColor: colors.card,
                            color: colors.cardText,
                            border: `1px solid ${colors.border}`,
                            '--tw-ring-color': colors.accent
                        } as React.CSSProperties}
                    >
                        <option value="all">Semua Jenis</option>
                        <option value="income">Pemasukan</option>
                        <option value="expense">Pengeluaran</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                        style={{
                            backgroundColor: colors.card,
                            color: colors.cardText,
                            border: `1px solid ${colors.border}`,
                            '--tw-ring-color': colors.accent
                        } as React.CSSProperties}
                    >
                        <option value="all">Semua Kategori</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.name}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {/* Clear Filters */}
                    <button
                        onClick={() => {
                            setSearchQuery('')
                            setFilterType('all')
                            setFilterCategory('all')
                        }}
                        className="px-4 py-3 rounded-lg border font-medium transition-all duration-200 hover:scale-105"
                        style={{
                            backgroundColor: colors.background,
                            color: colors.cardText,
                            border: `1px solid ${colors.border}`
                        }}
                    >
                        Reset Filter
                    </button>
                </div>

                {/* Transactions Table */}
                <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border + '30'
                    }}
                >
                    {/* Table Header */}
                    <div
                        className="px-6 py-4 border-b"
                        style={{
                            backgroundColor: colors.background,
                            borderColor: colors.border + '30'
                        }}
                    >
                        <div className="grid grid-cols-12 gap-4 font-semibold text-sm" style={{ color: colors.detail }}>
                            <div className="col-span-2">Tanggal</div>
                            <div className="col-span-2">Kategori</div>
                            <div className="col-span-4">Deskripsi</div>
                            <div className="col-span-2">Jumlah</div>
                            <div className="col-span-2 text-center">Aksi</div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y" style={{ borderColor: colors.border + '20' }}>
                        {filteredTransactions.map((transaction, index) => (
                            <motion.div
                                key={transaction.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="px-6 py-4 hover:bg-opacity-50 transition-colors duration-200"
                            >
                                <div className="grid grid-cols-12 gap-4 items-center">
                                    {/* Date */}
                                    <div className="col-span-2">
                                        <div className="flex items-center space-x-2">
                                            <FaCalendarAlt
                                                size={12}
                                                style={{ color: colors.detail }}
                                            />
                                            <span
                                                className="text-sm"
                                                style={{ color: colors.cardText }}
                                            >
                                                {formatDate(transaction.date)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Category */}
                                    <div className="col-span-2">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: getCategoryColor(transaction.category) + '20',
                                                color: getCategoryColor(transaction.category)
                                            }}
                                        >
                                            {transaction.category}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <div className="col-span-4">
                                        <div>
                                            <div
                                                className="font-medium"
                                                style={{ color: colors.cardText }}
                                            >
                                                {transaction.description}
                                            </div>
                                            {transaction.reference && (
                                                <div
                                                    className="text-xs"
                                                    style={{ color: colors.detail }}
                                                >
                                                    Ref: {transaction.reference}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="col-span-2">
                                        <div className="flex items-center space-x-2">
                                            {transaction.type === 'income' ? (
                                                <FaArrowUp size={12} style={{ color: '#10b981' }} />
                                            ) : (
                                                <FaArrowDown size={12} style={{ color: '#ef4444' }} />
                                            )}
                                            <span
                                                className="font-bold"
                                                style={{
                                                    color: transaction.type === 'income' ? '#10b981' : '#ef4444'
                                                }}
                                            >
                                                {formatCurrency(transaction.amount)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => setEditingTransaction(transaction)}
                                                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                                                style={{
                                                    backgroundColor: colors.accent + '20',
                                                    color: colors.accent
                                                }}
                                                title="Edit Transaksi"
                                            >
                                                <FaEdit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTransaction(transaction.id)}
                                                className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                                                style={{
                                                    backgroundColor: '#ef444420',
                                                    color: '#ef4444'
                                                }}
                                                title="Hapus Transaksi"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {filteredTransactions.length === 0 && (
                    <div className="text-center py-12">
                        <FaFileInvoiceDollar
                            size={48}
                            className="mx-auto mb-4 opacity-30"
                            style={{ color: colors.detail }}
                        />
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: colors.cardText }}
                        >
                            Tidak ada transaksi ditemukan
                        </h3>
                        <p
                            className="text-sm"
                            style={{ color: colors.detail }}
                        >
                            Coba ubah filter atau tambah transaksi baru
                        </p>
                    </div>
                )}
            </div>

            {/* Add Transaction Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md rounded-2xl shadow-2xl"
                            style={{ backgroundColor: colors.card }}
                        >
                            {/* Modal Header */}
                            <div
                                className="px-6 py-4 border-b"
                                style={{ borderColor: colors.border + '30' }}
                            >
                                <div className="flex items-center justify-between">
                                    <h2
                                        className="text-xl font-bold"
                                        style={{
                                            color: colors.cardText,
                                            fontFamily: 'var(--font-header-modern)'
                                        }}
                                    >
                                        Tambah Transaksi
                                    </h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="p-2 rounded-lg transition-colors duration-200"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.detail
                                        }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-6">
                                <div className="space-y-4">
                                    {/* Type */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                                            Jenis Transaksi
                                        </label>
                                        <select
                                            value={newTransaction.type}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as any, category: '' })}
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        >
                                            <option value="income">Pemasukan</option>
                                            <option value="expense">Pengeluaran</option>
                                        </select>
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                                            Kategori
                                        </label>
                                        <select
                                            value={newTransaction.category}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {getAvailableCategories().map(category => (
                                                <option key={category.id} value={category.name}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Date */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            value={newTransaction.date}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                                            Deskripsi
                                        </label>
                                        <input
                                            type="text"
                                            value={newTransaction.description}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                            placeholder="Deskripsi transaksi"
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        />
                                    </div>

                                    {/* Amount */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                                            Jumlah (Rp)
                                        </label>
                                        <input
                                            type="number"
                                            value={newTransaction.amount}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                                            placeholder="0"
                                            min="0"
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        />
                                    </div>

                                    {/* Reference */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2" style={{ color: colors.cardText }}>
                                            Referensi (Opsional)
                                        </label>
                                        <input
                                            type="text"
                                            value={newTransaction.reference}
                                            onChange={(e) => setNewTransaction({ ...newTransaction, reference: e.target.value })}
                                            placeholder="No. Ref, Invoice, dll"
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div
                                className="px-6 py-4 border-t flex justify-end space-x-3"
                                style={{ borderColor: colors.border + '30' }}
                            >
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleAddTransaction}
                                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                                    style={{
                                        backgroundColor: colors.accent,
                                        color: 'white'
                                    }}
                                >
                                    Simpan Transaksi
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
