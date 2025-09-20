'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaArrowLeft,
    FaSearch,
    FaEdit,
    FaTrash,
    FaUser,
    FaUserShield,
    FaUserCog,
    FaCrown,
    FaCalendarAlt,
    FaTimes,
    FaUserPlus,
    FaSpinner,
    FaEye
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'
import { useAdminUsers } from '../../../hooks/useAdminUsers'
import { useAdminAuthentication } from '../../../hooks/useAdmin'
import { AdminUser } from '../../../types/adminResponseTypes'
import { UserRole, getRolePermissions, ROLE_LABELS } from '../../../types/roleTypes'

interface NewUserForm {
    username: string
    email: string
    name: string
    password: string
    confirmPassword: string
    role: 'super_admin' | 'admin' | 'editor' | 'reviewer' | 'viewer'
}

interface EditUserForm {
    username: string
    email: string
    name: string
    role: 'super_admin' | 'admin' | 'editor' | 'reviewer' | 'viewer'
}

interface AdminUserPageProps {
    onBack: () => void
}

export default function AdminUserPage({ onBack }: AdminUserPageProps) {
    const { colors } = useTheme()
    const { user: currentUser } = useAdminAuthentication()
    const {
        users,
        loading,
        error,
        pagination,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        updateUserStatus
    } = useAdminUsers()

    const currentUserRole = currentUser?.role as UserRole
    const userPermissions = currentUserRole ? getRolePermissions(currentUserRole) : null

    const [searchQuery, setSearchQuery] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)
    const [newUser, setNewUser] = useState<NewUserForm>({
        username: '',
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        role: 'viewer'
    })
    const [editUser, setEditUser] = useState<EditUserForm>({
        username: '',
        email: '',
        name: '',
        role: 'viewer'
    })

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchUsers({
                page: 1,
                limit: 10,
                search: searchQuery || undefined
            })
        }, 500)

        return () => clearTimeout(timeoutId)
    }, [searchQuery])

    useEffect(() => {
        fetchUsers({ page: 1, limit: 10 })
    }, [])

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'super_admin': return FaCrown
            case 'admin': return FaUserShield
            case 'editor': return FaUserCog
            case 'reviewer': return FaEye
            case 'viewer': return FaUser
            default: return FaUser
        }
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin': return '#dc2626'
            case 'admin': return '#ea580c'
            case 'editor': return '#0ea5e9'
            case 'reviewer': return '#8b5cf6'
            case 'viewer': return '#10b981'
            default: return colors.detail
        }
    }

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'super_admin': return 'Super Admin'
            case 'admin': return 'Administrator'
            case 'editor': return 'Editor'
            case 'reviewer': return 'Reviewer'
            case 'viewer': return 'Viewer'
            default: return role
        }
    }

    const getStatusColor = (status: boolean) => {
        return status ? '#10b981' : '#f59e0b'
    }

    const getStatusLabel = (status: boolean) => {
        return status ? 'Aktif' : 'Tidak Aktif'
    }


    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddUser = async () => {
        if (newUser.password !== newUser.confirmPassword) {
            alert('Password tidak cocok!')
            return
        }

        if (!newUser.username || !newUser.email || !newUser.name || !newUser.password) {
            alert('Semua field harus diisi!')
            return
        }

        setActionLoading('create')

        const result = await createUser({
            username: newUser.username,
            email: newUser.email,
            name: newUser.name,
            password: newUser.password,
            role: newUser.role as any
        })

        setActionLoading(null)

        if (result.success) {
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
    }

    const handleEditUser = async () => {
        if (!editingUser || !editUser.username || !editUser.email || !editUser.name) {
            alert('Semua field harus diisi!')
            return
        }

        setActionLoading('edit')

        // Map frontend roles to backend roles if needed
        const result = await updateUser(editingUser.id, {
            username: editUser.username,
            email: editUser.email,
            name: editUser.name,
            role: editUser.role as any
        })

        setActionLoading(null)

        if (result.success) {
            setEditingUser(null)
            setShowEditModal(false)
            setEditUser({
                username: '',
                email: '',
                name: '',
                role: 'viewer'
            })
        }
    }

    const openEditModal = (user: AdminUser) => {
        setEditingUser(user)
        setEditUser({
            username: user.username,
            email: user.email,
            name: user.name,
            role: user.role as 'admin' | 'editor' | 'viewer'
        })
        setShowEditModal(true)
    }

    const handleDeleteUser = async (userId: string, username: string) => {

        const currentUser = JSON.parse(localStorage.getItem('admin-auth-store') || '{}')?.state?.user

        if (currentUser && userId === currentUser.id) {
            alert('Tidak dapat menghapus akun sendiri!')
            return
        }

        if (confirm(`Yakin ingin menghapus user ${username}?`)) {
            setActionLoading(userId)
            await deleteUser(userId)
            setActionLoading(null)
        }
    }

    const handleStatusChange = async (userId: string, newStatus: boolean) => {
        const currentUser = JSON.parse(localStorage.getItem('admin-auth-store') || '{}')?.state?.user

        if (currentUser && userId === currentUser.id && !newStatus) {
            alert('Tidak dapat menonaktifkan akun sendiri!')
            return
        }

        setActionLoading(userId)
        const status = newStatus ? 'active' : 'inactive'
        await updateUserStatus(userId, status)
        setActionLoading(null)
    }

    const formatLastLogin = (lastLogin: string) => {
        if (!lastLogin || lastLogin === '-') return '-'

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

                        {userPermissions?.canCreateUsers && (
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
                        )}
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
                        {loading ? (
                            <div className="px-6 py-12 text-center">
                                <FaSpinner
                                    className="animate-spin mx-auto mb-4"
                                    size={32}
                                    style={{ color: colors.accent }}
                                />
                                <p style={{ color: colors.detail }}>Memuat data pengguna...</p>
                            </div>
                        ) : filteredUsers.length === 0 ? (
                            <div className="px-6 py-12 text-center">
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
                                    {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Tambah pengguna baru untuk memulai'}
                                </p>
                            </div>
                        ) : (
                            filteredUsers.map((user, index) => {
                                const RoleIcon = getRoleIcon(user.role)
                                const isCurrentUser = JSON.parse(localStorage.getItem('admin-auth-store') || '{}')?.state?.user?.id === user.id

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
                                                            className="font-semibold flex items-center gap-2"
                                                            style={{ color: colors.cardText }}
                                                        >
                                                            {user.name}
                                                            {isCurrentUser && (
                                                                <span
                                                                    className="text-xs px-2 py-0.5 rounded-full"
                                                                    style={{
                                                                        backgroundColor: colors.accent + '20',
                                                                        color: colors.accent
                                                                    }}
                                                                >
                                                                    You
                                                                </span>
                                                            )}
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
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={user.isActive}
                                                        onChange={(e) => handleStatusChange(user.id, e.target.checked)}
                                                        disabled={actionLoading === user.id || isCurrentUser}
                                                        className="rounded focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        style={{
                                                            accentColor: colors.accent
                                                        }}
                                                    />
                                                    <span
                                                        className="text-sm font-medium"
                                                        style={{ color: getStatusColor(user.isActive) }}
                                                    >
                                                        {getStatusLabel(user.isActive)}
                                                    </span>
                                                    {actionLoading === user.id && (
                                                        <FaSpinner
                                                            className="animate-spin"
                                                            size={12}
                                                            style={{ color: colors.detail }}
                                                        />
                                                    )}
                                                </div>
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
                                                    {userPermissions?.canEditUsers && (
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            disabled={actionLoading === user.id}
                                                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            style={{
                                                                backgroundColor: colors.accent + '20',
                                                                color: colors.accent
                                                            }}
                                                            title="Edit User"
                                                        >
                                                            <FaEdit size={14} />
                                                        </button>
                                                    )}
                                                    {!isCurrentUser && userPermissions?.canDeleteUsers && (
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                                            disabled={actionLoading === user.id}
                                                            className="p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            style={{
                                                                backgroundColor: '#ef444420',
                                                                color: '#ef4444'
                                                            }}
                                                            title="Hapus User"
                                                        >
                                                            {actionLoading === user.id ? (
                                                                <FaSpinner className="animate-spin" size={14} />
                                                            ) : (
                                                                <FaTrash size={14} />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <div className="text-red-500 text-lg font-semibold mb-2">
                            Terjadi kesalahan
                        </div>
                        <p className="text-sm mb-4" style={{ color: colors.detail }}>
                            {error}
                        </p>
                        <button
                            onClick={() => fetchUsers({ page: 1, limit: 10 })}
                            className="px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white'
                            }}
                        >
                            Coba Lagi
                        </button>
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
                                            <option value="viewer">Viewer - Hanya melihat konten</option>
                                            <option value="reviewer">Reviewer - Review & pantau konten</option>
                                            <option value="editor">Editor - Edit & publikasi konten</option>
                                            <option value="admin">Admin - Kelola pengguna & konten</option>
                                            <option value="super_admin">Super Admin - Akses penuh sistem</option>
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
                                    disabled={actionLoading === 'create'}
                                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    style={{
                                        backgroundColor: colors.accent,
                                        color: 'white'
                                    }}
                                >
                                    {actionLoading === 'create' ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={14} />
                                            <span>Membuat...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaUserPlus size={14} />
                                            <span>Tambah User</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Edit User Modal */}
            <AnimatePresence>
                {showEditModal && editingUser && (
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
                                        Edit Pengguna
                                    </h2>
                                    <button
                                        onClick={() => {
                                            setShowEditModal(false)
                                            setEditingUser(null)
                                        }}
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
                                            value={editUser.name}
                                            onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
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
                                            value={editUser.username}
                                            onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
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
                                            value={editUser.email}
                                            onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
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
                                            value={editUser.role}
                                            onChange={(e) => setEditUser({ ...editUser, role: e.target.value as any })}
                                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                                            style={{
                                                backgroundColor: colors.background,
                                                color: colors.cardText,
                                                border: `1px solid ${colors.border}`,
                                                '--tw-ring-color': colors.accent
                                            } as React.CSSProperties}
                                        >
                                            <option value="viewer">Viewer - Hanya melihat konten</option>
                                            <option value="reviewer">Reviewer - Review & pantau konten</option>
                                            <option value="editor">Editor - Edit & publikasi konten</option>
                                            <option value="admin">Admin - Kelola pengguna & konten</option>
                                            <option value="super_admin">Super Admin - Akses penuh sistem</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div
                                className="px-6 py-4 border-t flex justify-end space-x-3"
                                style={{ borderColor: colors.border + '30' }}
                            >
                                <button
                                    onClick={() => {
                                        setShowEditModal(false)
                                        setEditingUser(null)
                                    }}
                                    className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
                                    style={{
                                        backgroundColor: colors.background,
                                        color: colors.cardText
                                    }}
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleEditUser}
                                    disabled={actionLoading === 'edit'}
                                    className="px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                    style={{
                                        backgroundColor: colors.accent,
                                        color: 'white'
                                    }}
                                >
                                    {actionLoading === 'edit' ? (
                                        <>
                                            <FaSpinner className="animate-spin" size={14} />
                                            <span>Menyimpan...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit size={14} />
                                            <span>Simpan Perubahan</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
