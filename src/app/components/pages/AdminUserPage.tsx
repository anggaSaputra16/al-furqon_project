'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaArrowLeft, FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaEyeSlash,
    FaUser, FaUserShield, FaUserCog, FaCrown, FaKey, FaEnvelope,
    FaCalendarAlt, FaCheck, FaTimes, FaSave, FaUserPlus
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface AdminUser {
    id: string
    username: string
    email: string
    name: string
    role: 'super_admin' | 'admin' | 'editor' | 'viewer'
    status: 'active' | 'inactive' | 'suspended'
    createdAt: string
    lastLogin: string
    avatar?: string
}

interface NewUserForm {
    username: string
    email: string
    name: string
    password: string
    confirmPassword: string
    role: 'admin' | 'editor' | 'viewer'
}

interface AdminUserPageProps {
    onBack: () => void
}

export default function AdminUserPage({ onBack }: AdminUserPageProps) {
    const { colors } = useTheme()
    const [users, setUsers] = useState<AdminUser[]>([
        {
            id: '1',
            username: 'admin',
            email: 'admin@alfurqon.id',
            name: 'Administrator Al-Furqon',
            role: 'super_admin',
            status: 'active',
            createdAt: '2024-01-15',
            lastLogin: '2024-07-12T10:30:00Z'
        },
        {
            id: '2',
            username: 'editor1',
            email: 'editor@alfurqon.id',
            name: 'Muhammad Editor',
            role: 'editor',
            status: 'active',
            createdAt: '2024-02-20',
            lastLogin: '2024-07-10T14:20:00Z'
        },
        {
            id: '3',
            username: 'viewer1',
            email: 'viewer@alfurqon.id',
            name: 'Ahmad Viewer',
            role: 'viewer',
            status: 'inactive',
            createdAt: '2024-03-10',
            lastLogin: '2024-06-15T09:15:00Z'
        }
    ])

    const [searchQuery, setSearchQuery] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
    const [newUser, setNewUser] = useState<NewUserForm>({
        username: '',
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'viewer'
    })

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'super_admin': return FaCrown
            case 'admin': return FaUserShield
            case 'editor': return FaUserCog
            case 'viewer': return FaUser
            default: return FaUser
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin': return '#dc2626'
            case 'admin': return '#ea580c'
            case 'editor': return '#0ea5e9'
            case 'viewer': return '#10b981'
            default: return colors.detail
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'super_admin': return 'Super Admin'
            case 'admin': return 'Administrator'
            case 'editor': return 'Editor'
            case 'viewer': return 'Viewer'
            default: return role
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10b981'
            case 'inactive': return '#f59e0b'
            case 'suspended': return '#ef4444'
            default: return colors.detail
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'active': return 'Aktif'
            case 'inactive': return 'Tidak Aktif'
            case 'suspended': return 'Diblokir'
            default: return status
        }
    }

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddUser = () => {
        if (newUser.password !== newUser.confirmPassword) {
            alert('Password tidak cocok!')
            return
        }

        if (!newUser.username || !newUser.email || !newUser.name || !newUser.password) {
            alert('Semua field harus diisi!')
            return
        }

        const user: AdminUser = {
            id: Date.now().toString(),
            username: newUser.username,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role,
            status: 'active',
            createdAt: new Date().toISOString().split('T')[0],
            lastLogin: '-'
        }

        setUsers([...users, user])
        setNewUser({
            username: '',
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
            role: 'viewer'
        })
        setShowAddModal(false)
    }

    const handleDeleteUser = (userId: string) => {
        if (userId === '1') {
            alert('Super admin tidak dapat dihapus!')
            return
        }

        if (confirm('Yakin ingin menghapus user ini?')) {
            setUsers(users.filter(user => user.id !== userId))
        }
    }

    const handleStatusChange = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
        if (userId === '1' && newStatus !== 'active') {
            alert('Status super admin tidak dapat diubah!')
            return
        }

        setUsers(users.map(user =>
            user.id === userId ? { ...user, status: newStatus } : user
        ))
    }

    const formatLastLogin = (lastLogin: string) => {
        if (lastLogin === '-') return '-'

        try {
            const date = new Date(lastLogin)
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
        } catch {
            return lastLogin
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
                                    Kelola Pengguna
                                </h1>
                                <p
                                    className="text-sm"
                                    style={{ color: colors.detail }}
                                >
                                    Kelola akses admin untuk Content Management System
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white'
                            }}
                        >
                            <FaUserPlus size={16} />
                            <span>Tambah User</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Search and Filter */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <FaSearch
                            className="absolute left-3 top-1/2 transform -translate-y-1/2"
                            size={16}
                            style={{ color: colors.detail }}
                        />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari pengguna..."
                            className="w-full pl-10 pr-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                backgroundColor: colors.card,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                '--tw-ring-color': colors.accent
                            } as React.CSSProperties}
                        />
                    </div>
                </div>

                {/* Users Table */}
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
                            <div className="col-span-3">Pengguna</div>
                            <div className="col-span-2">Role</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-3">Login Terakhir</div>
                            <div className="col-span-2 text-center">Aksi</div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="divide-y" style={{ borderColor: colors.border + '20' }}>
                        {filteredUsers.map((user, index) => {
                            const RoleIcon = getRoleIcon(user.role)

                            return (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="px-6 py-4 transition-colors duration-200 hover:bg-opacity-50"
                                    style={{
                                        backgroundColor: 'transparent'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = colors.background + '50'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent'
                                    }}
                                >
                                    <div className="grid grid-cols-12 gap-4 items-center">
                                        {/* User Info */}
                                        <div className="col-span-3">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                                    style={{ backgroundColor: colors.accent + '20' }}
                                                >
                                                    <FaUser size={16} style={{ color: colors.accent }} />
                                                </div>
                                                <div>
                                                    <div
                                                        className="font-semibold"
                                                        style={{ color: colors.cardText }}
                                                    >
                                                        {user.name}
                                                    </div>
                                                    <div
                                                        className="text-sm"
                                                        style={{ color: colors.detail }}
                                                    >
                                                        @{user.username}
                                                    </div>
                                                    <div
                                                        className="text-xs"
                                                        style={{ color: colors.detail }}
                                                    >
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Role */}
                                        <div className="col-span-2">
                                            <div className="flex items-center space-x-2">
                                                <RoleIcon
                                                    size={16}
                                                    style={{ color: getRoleColor(user.role) }}
                                                />
                                                <span
                                                    className="text-sm font-medium"
                                                    style={{ color: getRoleColor(user.role) }}
                                                >
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="col-span-2">
                                            <select
                                                value={user.status}
                                                onChange={(e) => handleStatusChange(user.id, e.target.value as any)}
                                                disabled={user.id === '1'}
                                                className="px-3 py-1 rounded-full text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                style={{
                                                    backgroundColor: getStatusColor(user.status) + '20',
                                                    color: getStatusColor(user.status),
                                                    border: `1px solid ${getStatusColor(user.status)}40`,
                                                    '--tw-ring-color': getStatusColor(user.status)
                                                } as React.CSSProperties}
                                            >
                                                <option value="active">Aktif</option>
                                                <option value="inactive">Tidak Aktif</option>
                                                <option value="suspended">Diblokir</option>
                                            </select>
                                        </div>

                                        {/* Last Login */}
                                        <div className="col-span-3">
                                            <div className="flex items-center space-x-2">
                                                <FaCalendarAlt
                                                    size={12}
                                                    style={{ color: colors.detail }}
                                                />
                                                <span
                                                    className="text-sm"
                                                    style={{ color: colors.detail }}
                                                >
                                                    {formatLastLogin(user.lastLogin)}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-2">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => setEditingUser(user)}
                                                    className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                                                    style={{
                                                        backgroundColor: colors.accent + '20',
                                                        color: colors.accent
                                                    }}
                                                    title="Edit User"
                                                >
                                                    <FaEdit size={14} />
                                                </button>
                                                {user.id !== '1' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        className="p-2 rounded-lg transition-all duration-200 hover:scale-110"
                                                        style={{
                                                            backgroundColor: '#ef444420',
                                                            color: '#ef4444'
                                                        }}
                                                        title="Hapus User"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                        <FaUser
                            size={48}
                            className="mx-auto mb-4 opacity-30"
                            style={{ color: colors.detail }}
                        />
                        <h3
                            className="text-lg font-semibold mb-2"
                            style={{ color: colors.cardText }}
                        >
                            Tidak ada pengguna ditemukan
                        </h3>
                        <p
                            className="text-sm"
                            style={{ color: colors.detail }}
                        >
                            Coba ubah kata kunci pencarian atau tambah pengguna baru
                        </p>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
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
                                        Tambah Pengguna Baru
                                    </h2>
                                    <button
                                        onClick={() => setShowAddModal(false)}
                                        className="p-2 rounded-lg transition-colors duration-200"
                                        style={{
                                            backgroundColor: colors.background,
                                            color: colors.detail
                                        }}
                                    >
                                        <FaTimes size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="px-6 py-6">
                                <div className="space-y-4">
                                    {/* Name */}
                                    <div>
                                        <label
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: colors.cardText }}
                                        >
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={newUser.name}
                                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                            placeholder="Masukkan nama lengkap"
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        />
                                    </div>

                                    {/* Username */}
                                    <div>
                                        <label
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: colors.cardText }}
                                        >
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={newUser.username}
                                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                            placeholder="Masukkan username"
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: colors.cardText }}
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                            placeholder="Masukkan email"
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        />
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: colors.cardText }}
                                        >
                                            Role
                                        </label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        >
                                            <option value="viewer">Viewer - Hanya melihat</option>
                                            <option value="editor">Editor - Edit konten</option>
                                            <option value="admin">Admin - Kelola semua</option>
                                        </select>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: colors.cardText }}
                                        >
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newUser.password}
                                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                            placeholder="Masukkan password"
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        />
                                    </div>

                                    {/* Confirm Password */}
                                    <div>
                                        <label
                                            className="block text-sm font-semibold mb-2"
                                            style={{ color: colors.cardText }}
                                        >
                                            Konfirmasi Password
                                        </label>
                                        <input
                                            type="password"
                                            value={newUser.confirmPassword}
                                            onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                                            placeholder="Konfirmasi password"
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
                                    onClick={handleAddUser}
                                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                                    style={{
                                        backgroundColor: colors.accent,
                                        color: 'white'
                                    }}
                                >
                                    Tambah User
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
