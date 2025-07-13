'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    FaArrowLeft, FaCog, FaSave, FaEye, FaEyeSlash, FaUpload,
    FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock,
    FaPalette, FaLock, FaDatabase, FaBell, FaKey
} from 'react-icons/fa'
import { useTheme } from '@/context/themeContext'

interface SiteSettings {
    siteName: string
    siteDescription: string
    siteUrl: string
    email: string
    phone: string
    address: string
    logo?: string
    favicon?: string
}

interface SecuritySettings {
    sessionTimeout: number
    passwordMinLength: number
    requireStrongPassword: boolean
    twoFactorAuth: boolean
    loginAttempts: number
}

interface NotificationSettings {
    emailNotifications: boolean
    newArticleNotification: boolean
    newDonationNotification: boolean
    newUserNotification: boolean
    maintenanceMode: boolean
}

interface AdminSettingsPageProps {
    onBack: () => void
}

export default function AdminSettingsPage({ onBack }: AdminSettingsPageProps) {
    const { colors } = useTheme()
    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'blue'>('light')
    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'appearance'>('general')
    const [isLoading, setIsLoading] = useState(false)


    useEffect(() => {
        const savedTheme = localStorage.getItem('admin_theme') as 'light' | 'dark' | 'blue'
        if (savedTheme) {
            setCurrentTheme(savedTheme)
        }
    }, [])


    const handleThemeChange = (theme: 'light' | 'dark' | 'blue') => {
        setCurrentTheme(theme)
        localStorage.setItem('admin_theme', theme)

    }

    const [siteSettings, setSiteSettings] = useState<SiteSettings>({
        siteName: 'Masjid Al-Furqon',
        siteDescription: 'Website resmi Masjid Al-Furqon - Menyajikan informasi kegiatan, artikel islami, dan program donasi',
        siteUrl: 'https://alfurqon.id',
        email: 'info@alfurqon.id',
        phone: '+62 21 1234 5678',
        address: 'Jl. Raya Masjid No. 123, Jakarta Selatan'
    })

    const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
        sessionTimeout: 60,
        passwordMinLength: 8,
        requireStrongPassword: true,
        twoFactorAuth: false,
        loginAttempts: 3
    })

    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        newArticleNotification: true,
        newDonationNotification: true,
        newUserNotification: false,
        maintenanceMode: false
    })

    const tabs = [
        { id: 'general', label: 'Umum', icon: FaGlobe },
        { id: 'security', label: 'Keamanan', icon: FaLock },
        { id: 'notifications', label: 'Notifikasi', icon: FaBell },
        { id: 'appearance', label: 'Tampilan', icon: FaPalette }
    ]

    const handleSaveSettings = async () => {
        setIsLoading(true)


        await new Promise(resolve => setTimeout(resolve, 1000))


        console.log('Settings saved:', {
            siteSettings,
            securitySettings,
            notificationSettings,
            theme: currentTheme
        })

        setIsLoading(false)
        alert('Pengaturan berhasil disimpan!')
    }

    const handleImageUpload = (type: 'logo' | 'favicon') => {

        alert(`Upload ${type} akan diimplementasikan dengan file picker`)
    }

    const renderGeneralTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Informasi Situs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            Nama Situs
                        </label>
                        <input
                            type="text"
                            value={siteSettings.siteName}
                            onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                '--tw-ring-color': colors.accent
                            } as React.CSSProperties}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            URL Situs
                        </label>
                        <input
                            type="url"
                            value={siteSettings.siteUrl}
                            onChange={(e) => setSiteSettings({ ...siteSettings, siteUrl: e.target.value })}
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

                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                        Deskripsi Situs
                    </label>
                    <textarea
                        value={siteSettings.siteDescription}
                        onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
                        rows={3}
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

            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Kontak Informasi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={siteSettings.email}
                            onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                '--tw-ring-color': colors.accent
                            } as React.CSSProperties}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            Telepon
                        </label>
                        <input
                            type="tel"
                            value={siteSettings.phone}
                            onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
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

                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                        Alamat
                    </label>
                    <textarea
                        value={siteSettings.address}
                        onChange={(e) => setSiteSettings({ ...siteSettings, address: e.target.value })}
                        rows={2}
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

            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Media & Branding
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            Logo Situs
                        </label>
                        <button
                            onClick={() => handleImageUpload('logo')}
                            className="w-full p-4 border-2 border-dashed rounded-lg transition-colors duration-200 hover:border-solid"
                            style={{
                                borderColor: colors.accent + '40',
                                color: colors.accent
                            }}
                        >
                            <FaUpload className="mx-auto mb-2" size={24} />
                            <div className="text-sm">Upload Logo</div>
                        </button>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            Favicon
                        </label>
                        <button
                            onClick={() => handleImageUpload('favicon')}
                            className="w-full p-4 border-2 border-dashed rounded-lg transition-colors duration-200 hover:border-solid"
                            style={{
                                borderColor: colors.accent + '40',
                                color: colors.accent
                            }}
                        >
                            <FaUpload className="mx-auto mb-2" size={24} />
                            <div className="text-sm">Upload Favicon</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderSecurityTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Keamanan Sesi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            Timeout Sesi (menit)
                        </label>
                        <input
                            type="number"
                            value={securitySettings.sessionTimeout}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                            min="5"
                            max="480"
                            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                '--tw-ring-color': colors.accent
                            } as React.CSSProperties}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            Max Percobaan Login
                        </label>
                        <input
                            type="number"
                            value={securitySettings.loginAttempts}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, loginAttempts: parseInt(e.target.value) })}
                            min="1"
                            max="10"
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

            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Kebijakan Password
                </h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2" style={{ color: colors.cardText }}>
                            Panjang Minimum Password
                        </label>
                        <input
                            type="number"
                            value={securitySettings.passwordMinLength}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, passwordMinLength: parseInt(e.target.value) })}
                            min="6"
                            max="20"
                            className="w-full max-w-xs px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-opacity-50"
                            style={{
                                backgroundColor: colors.background,
                                color: colors.cardText,
                                border: `1px solid ${colors.border}`,
                                '--tw-ring-color': colors.accent
                            } as React.CSSProperties}
                        />
                    </div>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={securitySettings.requireStrongPassword}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, requireStrongPassword: e.target.checked })}
                            className="w-5 h-5 rounded border focus:ring-2 focus:ring-opacity-50"
                            style={{
                                accentColor: colors.accent
                            }}
                        />
                        <span style={{ color: colors.cardText }}>
                            Wajib gunakan password kuat (huruf besar, kecil, angka, simbol)
                        </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={securitySettings.twoFactorAuth}
                            onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorAuth: e.target.checked })}
                            className="w-5 h-5 rounded border focus:ring-2 focus:ring-opacity-50"
                            style={{
                                accentColor: colors.accent
                            }}
                        />
                        <span style={{ color: colors.cardText }}>
                            Aktifkan Two-Factor Authentication (2FA)
                        </span>
                    </label>
                </div>
            </div>
        </div>
    )

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Notifikasi Email
                </h3>
                <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                            className="w-5 h-5 rounded border focus:ring-2 focus:ring-opacity-50"
                            style={{
                                accentColor: colors.accent
                            }}
                        />
                        <span style={{ color: colors.cardText }}>
                            Aktifkan notifikasi email
                        </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer ml-8">
                        <input
                            type="checkbox"
                            checked={notificationSettings.newArticleNotification}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, newArticleNotification: e.target.checked })}
                            disabled={!notificationSettings.emailNotifications}
                            className="w-5 h-5 rounded border focus:ring-2 focus:ring-opacity-50 disabled:opacity-50"
                            style={{
                                accentColor: colors.accent
                            }}
                        />
                        <span style={{ color: colors.cardText }}>
                            Notifikasi artikel baru
                        </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer ml-8">
                        <input
                            type="checkbox"
                            checked={notificationSettings.newDonationNotification}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, newDonationNotification: e.target.checked })}
                            disabled={!notificationSettings.emailNotifications}
                            className="w-5 h-5 rounded border focus:ring-2 focus:ring-opacity-50 disabled:opacity-50"
                            style={{
                                accentColor: colors.accent
                            }}
                        />
                        <span style={{ color: colors.cardText }}>
                            Notifikasi donasi baru
                        </span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer ml-8">
                        <input
                            type="checkbox"
                            checked={notificationSettings.newUserNotification}
                            onChange={(e) => setNotificationSettings({ ...notificationSettings, newUserNotification: e.target.checked })}
                            disabled={!notificationSettings.emailNotifications}
                            className="w-5 h-5 rounded border focus:ring-2 focus:ring-opacity-50 disabled:opacity-50"
                            style={{
                                accentColor: colors.accent
                            }}
                        />
                        <span style={{ color: colors.cardText }}>
                            Notifikasi pengguna baru
                        </span>
                    </label>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Mode Situs
                </h3>
                <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={notificationSettings.maintenanceMode}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, maintenanceMode: e.target.checked })}
                        className="w-5 h-5 rounded border focus:ring-2 focus:ring-opacity-50"
                        style={{
                            accentColor: colors.accent
                        }}
                    />
                    <div>
                        <span style={{ color: colors.cardText }}>
                            Mode Maintenance
                        </span>
                        <p className="text-sm" style={{ color: colors.detail }}>
                            Aktifkan untuk menampilkan halaman maintenance kepada pengunjung
                        </p>
                    </div>
                </label>
            </div>
        </div>
    )

    const renderAppearanceTab = () => (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Tema Tampilan
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['light', 'dark', 'blue'].map((theme) => (
                        <button
                            key={theme}
                            onClick={() => handleThemeChange(theme as any)}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${currentTheme === theme ? 'ring-2 ring-opacity-50' : ''
                                }`}
                            style={{
                                borderColor: currentTheme === theme ? colors.accent : colors.border + '40',
                                backgroundColor: colors.background,
                                '--tw-ring-color': colors.accent
                            } as React.CSSProperties}
                        >
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-6 h-6 rounded-full"
                                    style={{
                                        backgroundColor: theme === 'light' ? '#f8fafc' :
                                            theme === 'dark' ? '#1e293b' : '#1e40af'
                                    }}
                                />
                                <span style={{ color: colors.cardText }}>
                                    {theme === 'light' ? 'Light' :
                                        theme === 'dark' ? 'Dark' : 'Blue'}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-4" style={{ color: colors.cardText }}>
                    Informasi Tema
                </h3>
                <div
                    className="p-4 rounded-lg border"
                    style={{
                        backgroundColor: colors.background,
                        borderColor: colors.border + '30'
                    }}
                >
                    <p style={{ color: colors.detail }}>
                        Tema saat ini: <strong style={{ color: colors.cardText }}>{currentTheme}</strong>
                    </p>
                    <p className="text-sm mt-2" style={{ color: colors.detail }}>
                        Tema akan diterapkan secara otomatis ke seluruh admin panel dan dapat disinkronkan dengan preferensi sistem user.
                    </p>
                </div>
            </div>
        </div>
    )

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
                                    Pengaturan Sistem
                                </h1>
                                <p
                                    className="text-sm"
                                    style={{ color: colors.detail }}
                                >
                                    Konfigurasi dan pengaturan admin panel
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveSettings}
                            disabled={isLoading}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                            style={{
                                backgroundColor: colors.accent,
                                color: 'white'
                            }}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <FaSave size={16} />
                            )}
                            <span>{isLoading ? 'Menyimpan...' : 'Simpan Pengaturan'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Tabs */}
                    <div className="lg:col-span-1">
                        <div
                            className="p-4 rounded-xl border"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border + '30'
                            }}
                        >
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id as any)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${activeTab === tab.id ? 'shadow-md' : ''
                                                }`}
                                            style={{
                                                backgroundColor: activeTab === tab.id ? colors.accent + '15' : 'transparent',
                                                color: activeTab === tab.id ? colors.accent : colors.cardText
                                            }}
                                        >
                                            <Icon size={18} />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    )
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 rounded-xl border"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border + '30'
                            }}
                        >
                            {activeTab === 'general' && renderGeneralTab()}
                            {activeTab === 'security' && renderSecurityTab()}
                            {activeTab === 'notifications' && renderNotificationsTab()}
                            {activeTab === 'appearance' && renderAppearanceTab()}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
