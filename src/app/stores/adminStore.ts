import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  AdminUser,
  AdminDashboardStats,
  AdminSettingsResponse,
  AdminActivity
} from '../types/adminResponseTypes'

interface AdminAuthState {
  // Auth State
  isAuthenticated: boolean
  user: AdminUser | null
  token: string | null
  isLoading: boolean
  
  // Auth Actions
  setAuth: (user: AdminUser, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: AdminUser) => void
}

interface AdminDashboardState {
  // Dashboard State
  stats: AdminDashboardStats | null
  recentActivities: AdminActivity[]
  isStatsLoading: boolean
  lastStatsUpdate: string | null
  
  // Dashboard Actions
  setStats: (stats: AdminDashboardStats) => void
  setStatsLoading: (loading: boolean) => void
  addActivity: (activity: AdminActivity) => void
  clearDashboard: () => void
}

interface AdminSettingsState {
  // Settings State
  settings: AdminSettingsResponse | null
  isSettingsLoading: boolean
  hasUnsavedChanges: boolean
  
  // Settings Actions
  setSettings: (settings: AdminSettingsResponse) => void
  setSettingsLoading: (loading: boolean) => void
  setUnsavedChanges: (hasChanges: boolean) => void
  updateSetting: (path: string, value: any) => void
  clearSettings: () => void
}

interface AdminUIState {
  // UI State
  sidebarCollapsed: boolean
  activeTheme: 'light' | 'dark' | 'blue'
  notifications: AdminNotification[]
  modals: {
    [key: string]: boolean
  }
  
  // UI Actions
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'blue') => void
  addNotification: (notification: AdminNotification) => void
  removeNotification: (id: string) => void
  openModal: (modalId: string) => void
  closeModal: (modalId: string) => void
  clearNotifications: () => void
}

interface AdminNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  timestamp: string
  autoClose?: boolean
  duration?: number
}

// Auth Store
export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,

      // Actions
      setAuth: (user, token) =>
        set({
          isAuthenticated: true,
          user,
          token,
          isLoading: false,
        }),

      clearAuth: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      updateUser: (user) =>
        set({ user }),
    }),
    {
      name: 'admin-auth-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token,
      }),
      skipHydration: true, // Skip hydration to avoid SSR issues
    }
  )
)

// Dashboard Store
export const useAdminDashboardStore = create<AdminDashboardState>((set, get) => ({
  // Initial State
  stats: null,
  recentActivities: [],
  isStatsLoading: false,
  lastStatsUpdate: null,

  // Actions
  setStats: (stats) =>
    set({
      stats,
      recentActivities: stats.recentActivities || [],
      lastStatsUpdate: new Date().toISOString(),
    }),

  setStatsLoading: (loading) =>
    set({ isStatsLoading: loading }),

  addActivity: (activity) =>
    set((state) => ({
      recentActivities: [activity, ...state.recentActivities.slice(0, 9)], // Keep last 10
    })),

  clearDashboard: () =>
    set({
      stats: null,
      recentActivities: [],
      isStatsLoading: false,
      lastStatsUpdate: null,
    }),
}))

// Settings Store
export const useAdminSettingsStore = create<AdminSettingsState>()(
  persist(
    (set, get) => ({
      // Initial State
      settings: null,
      isSettingsLoading: false,
      hasUnsavedChanges: false,

      // Actions
      setSettings: (settings) =>
        set({
          settings,
          hasUnsavedChanges: false,
        }),

      setSettingsLoading: (loading) =>
        set({ isSettingsLoading: loading }),

      setUnsavedChanges: (hasChanges) =>
        set({ hasUnsavedChanges: hasChanges }),

      updateSetting: (path, value) =>
        set((state) => {
          if (!state.settings) return state

          const pathArray = path.split('.')
          const newSettings = { ...state.settings }
          let current: any = newSettings

          // Navigate to the parent of the target property
          for (let i = 0; i < pathArray.length - 1; i++) {
            current[pathArray[i]] = { ...current[pathArray[i]] }
            current = current[pathArray[i]]
          }

          // Set the value
          current[pathArray[pathArray.length - 1]] = value

          return {
            settings: newSettings,
            hasUnsavedChanges: true,
          }
        }),

      clearSettings: () =>
        set({
          settings: null,
          isSettingsLoading: false,
          hasUnsavedChanges: false,
        }),
    }),
    {
      name: 'admin-settings-store',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
)

// UI Store
export const useAdminUIStore = create<AdminUIState>()(
  persist(
    (set, get) => ({
      // Initial State
      sidebarCollapsed: false,
      activeTheme: 'light',
      notifications: [],
      modals: {},

      // Actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      setTheme: (theme) =>
        set({ activeTheme: theme }),

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
        })),

      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      openModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: true },
        })),

      closeModal: (modalId) =>
        set((state) => ({
          modals: { ...state.modals, [modalId]: false },
        })),

      clearNotifications: () =>
        set({ notifications: [] }),
    }),
    {
      name: 'admin-ui-store',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        activeTheme: state.activeTheme,
      }),
    }
  )
)

// Selector Hooks for better performance
export const useAdminUser = () => useAdminAuthStore((state) => state.user)
export const useAdminToken = () => useAdminAuthStore((state) => state.token)
export const useIsAdminAuthenticated = () => useAdminAuthStore((state) => state.isAuthenticated)
export const useAdminAuthLoading = () => useAdminAuthStore((state) => state.isLoading)

export const useAdminStats = () => useAdminDashboardStore((state) => state.stats)
export const useAdminActivities = () => useAdminDashboardStore((state) => state.recentActivities)
export const useAdminStatsLoading = () => useAdminDashboardStore((state) => state.isStatsLoading)

export const useAdminSettings = () => useAdminSettingsStore((state) => state.settings)
export const useAdminSettingsLoading = () => useAdminSettingsStore((state) => state.isSettingsLoading)
export const useAdminHasUnsavedChanges = () => useAdminSettingsStore((state) => state.hasUnsavedChanges)

export const useAdminTheme = () => useAdminUIStore((state) => state.activeTheme)
export const useAdminSidebarCollapsed = () => useAdminUIStore((state) => state.sidebarCollapsed)
export const useAdminNotifications = () => useAdminUIStore((state) => state.notifications)
export const useAdminModals = () => useAdminUIStore((state) => state.modals)

// Combined hooks for common use cases
export const useAdminAuth = () => {
  const auth = useAdminAuthStore()
  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    token: auth.token,
    isLoading: auth.isLoading,
    setAuth: auth.setAuth,
    clearAuth: auth.clearAuth,
    setLoading: auth.setLoading,
    updateUser: auth.updateUser,
  }
}

export const useAdminDashboard = () => {
  const dashboard = useAdminDashboardStore()
  return {
    stats: dashboard.stats,
    recentActivities: dashboard.recentActivities,
    isLoading: dashboard.isStatsLoading,
    lastUpdate: dashboard.lastStatsUpdate,
    setStats: dashboard.setStats,
    setLoading: dashboard.setStatsLoading,
    addActivity: dashboard.addActivity,
    clear: dashboard.clearDashboard,
  }
}

export const useAdminUI = () => {
  const ui = useAdminUIStore()
  return {
    theme: ui.activeTheme,
    sidebarCollapsed: ui.sidebarCollapsed,
    notifications: ui.notifications,
    modals: ui.modals,
    setTheme: ui.setTheme,
    toggleSidebar: ui.toggleSidebar,
    setSidebarCollapsed: ui.setSidebarCollapsed,
    addNotification: ui.addNotification,
    removeNotification: ui.removeNotification,
    openModal: ui.openModal,
    closeModal: ui.closeModal,
    clearNotifications: ui.clearNotifications,
  }
}
