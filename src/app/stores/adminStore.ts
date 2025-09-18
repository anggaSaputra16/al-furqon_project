import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  AdminUser,
  AdminDashboardStats,
  AdminSettingsResponse,
  AdminActivity,
  DashboardStatsResponse,
  DashboardChartsData
} from '../types/adminResponseTypes'

interface AdminAuthState {
  
  isAuthenticated: boolean
  user: AdminUser | null
  token: string | null
  isLoading: boolean
  

  setAuth: (user: AdminUser, token: string) => void
  clearAuth: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: AdminUser) => void
}

interface AdminDashboardState {

  stats: AdminDashboardStats | null
  recentActivities: AdminActivity[]
  isStatsLoading: boolean
  lastStatsUpdate: string | null
  

  setStats: (stats: AdminDashboardStats) => void
  setStatsLoading: (loading: boolean) => void
  addActivity: (activity: AdminActivity) => void
  clearDashboard: () => void
}

interface AdminSettingsState {

  settings: AdminSettingsResponse | null
  isSettingsLoading: boolean
  hasUnsavedChanges: boolean
  

  setSettings: (settings: AdminSettingsResponse) => void
  setSettingsLoading: (loading: boolean) => void
  setUnsavedChanges: (hasChanges: boolean) => void
  updateSetting: (path: string, value: any) => void
  clearSettings: () => void
}

interface AdminUIState {

  sidebarCollapsed: boolean
  activeTheme: 'light' | 'dark' | 'blue'
  notifications: AdminNotification[]
  modals: {
    [key: string]: boolean
  }
  

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

interface DashboardStatsState {

  stats: DashboardStatsResponse | null
  charts: DashboardChartsData | null
  realtimeActivity: {
    onlineUsers: number
    todayViews: number
    todayDonations: number
    recentActions: any[]
  } | null
  

  isStatsLoading: boolean
  isChartsLoading: boolean
  isActivityLoading: boolean
  

  lastStatsUpdate: string | null
  lastChartsUpdate: string | null
  statsDateRange: {
    startDate: string
    endDate: string
  } | null
  

  setStats: (stats: DashboardStatsResponse) => void
  setCharts: (charts: DashboardChartsData) => void
  setRealtimeActivity: (activity: any) => void
  setStatsLoading: (loading: boolean) => void
  setChartsLoading: (loading: boolean) => void
  setActivityLoading: (loading: boolean) => void
  setStatsDateRange: (dateRange: { startDate: string; endDate: string } | null) => void
  updateSingleStat: (key: keyof DashboardStatsResponse, value: any) => void
  refreshStats: () => void
  clearDashboardStats: () => void
}


export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({

      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,


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
      skipHydration: true,
    }
  )
)


export const useAdminDashboardStore = create<AdminDashboardState>((set, get) => ({

  stats: null,
  recentActivities: [],
  isStatsLoading: false,
  lastStatsUpdate: null,


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
      recentActivities: [activity, ...state.recentActivities.slice(0, 9)],
    })),

  clearDashboard: () =>
    set({
      stats: null,
      recentActivities: [],
      isStatsLoading: false,
      lastStatsUpdate: null,
    }),
}))


export const useAdminSettingsStore = create<AdminSettingsState>()(
  persist(
    (set, get) => ({

      settings: null,
      isSettingsLoading: false,
      hasUnsavedChanges: false,


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


          for (let i = 0; i < pathArray.length - 1; i++) {
            current[pathArray[i]] = { ...current[pathArray[i]] }
            current = current[pathArray[i]]
          }


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


export const useAdminUIStore = create<AdminUIState>()(
  persist(
    (set, get) => ({

      sidebarCollapsed: false,
      activeTheme: 'light',
      notifications: [],
      modals: {},


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


export const useDashboardStatsStore = create<DashboardStatsState>((set, get) => ({

  stats: null,
  charts: null,
  realtimeActivity: null,
  isStatsLoading: false,
  isChartsLoading: false,
  isActivityLoading: false,
  lastStatsUpdate: null,
  lastChartsUpdate: null,
  statsDateRange: null,


  setStats: (stats) => set({
    stats,
    lastStatsUpdate: new Date().toISOString()
  }),

  setCharts: (charts) => set({
    charts,
    lastChartsUpdate: new Date().toISOString()
  }),

  setRealtimeActivity: (realtimeActivity) => set({
    realtimeActivity
  }),

  setStatsLoading: (isStatsLoading) => set({ isStatsLoading }),
  setChartsLoading: (isChartsLoading) => set({ isChartsLoading }),
  setActivityLoading: (isActivityLoading) => set({ isActivityLoading }),

  setStatsDateRange: (statsDateRange) => set({ statsDateRange }),

  updateSingleStat: (key, value) => {
    const currentStats = get().stats
    if (currentStats) {
      set({
        stats: { ...currentStats, [key]: value },
        lastStatsUpdate: new Date().toISOString()
      })
    }
  },

  refreshStats: () => {
    const { stats } = get()
    if (stats) {
      set({
        lastStatsUpdate: new Date().toISOString()
      })
    }
  },

  clearDashboardStats: () => set({
    stats: null,
    charts: null,
    realtimeActivity: null,
    lastStatsUpdate: null,
    lastChartsUpdate: null,
    statsDateRange: null,
    isStatsLoading: false,
    isChartsLoading: false,
    isActivityLoading: false
  })
}))


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

export const useDashboardStatsData = () => useDashboardStatsStore((state) => state.stats)
export const useDashboardCharts = () => useDashboardStatsStore((state) => state.charts)
export const useRealtimeActivity = () => useDashboardStatsStore((state) => state.realtimeActivity)
export const useIsStatsLoading = () => useDashboardStatsStore((state) => state.isStatsLoading)
export const useIsChartsLoading = () => useDashboardStatsStore((state) => state.isChartsLoading)
export const useIsActivityLoading = () => useDashboardStatsStore((state) => state.isActivityLoading)
export const useLastStatsUpdate = () => useDashboardStatsStore((state) => state.lastStatsUpdate)
export const useLastChartsUpdate = () => useDashboardStatsStore((state) => state.lastChartsUpdate)
export const useStatsDateRange = () => useDashboardStatsStore((state) => state.statsDateRange)


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

export const useDashboardStatsComplete = () => {
  const store = useDashboardStatsStore()
  return {

    stats: store.stats,
    charts: store.charts,
    realtimeActivity: store.realtimeActivity,
    isStatsLoading: store.isStatsLoading,
    isChartsLoading: store.isChartsLoading,
    isActivityLoading: store.isActivityLoading,
    lastStatsUpdate: store.lastStatsUpdate,
    lastChartsUpdate: store.lastChartsUpdate,
    statsDateRange: store.statsDateRange,


    setStats: store.setStats,
    setCharts: store.setCharts,
    setRealtimeActivity: store.setRealtimeActivity,
    setStatsLoading: store.setStatsLoading,
    setChartsLoading: store.setChartsLoading,
    setActivityLoading: store.setActivityLoading,
    setStatsDateRange: store.setStatsDateRange,
    updateSingleStat: store.updateSingleStat,
    refreshStats: store.refreshStats,
    clearDashboardStats: store.clearDashboardStats
  }
}
