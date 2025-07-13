import { useEffect, useCallback, useState } from 'react'
import { useAdminAuth, useAdminDashboardStore, useAdminUI } from '../stores/adminStore'
import { adminUseCases } from '../useCases/adminUseCases'
import {
  AdminLoginRequest,
  AdminChangePasswordRequest,
  UpdateAdminProfileRequest,
  GetAdminStatsRequest
} from '../types/adminRequestTypes'
import { AdminUser, AdminDashboardStats } from '../types/adminResponseTypes'

// Authentication Hook
export const useAdminAuthentication = () => {
  const auth = useAdminAuth()
  const ui = useAdminUI()

  // Hydrate auth store on client side only if there's stored data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persistedAuth = localStorage.getItem('admin-auth-store')
      if (persistedAuth) {
        try {
          const parsed = JSON.parse(persistedAuth)
          if (parsed.state && parsed.state.isAuthenticated && parsed.state.user && parsed.state.token) {
            auth.setAuth(parsed.state.user, parsed.state.token)
            // No automatic checkAuth - let user manually check if needed
          }
        } catch (error) {
          console.error('Error hydrating auth store:', error)
        }
      }
    }
  }, []) // Remove auth dependency to prevent issues

  const login = useCallback(async (credentials: AdminLoginRequest) => {
    auth.setLoading(true)
    
    try {
      const result = await adminUseCases.login(credentials)
      
      if (result.success && result.user && result.token) {
        auth.setAuth(result.user, result.token)
        ui.addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Login Berhasil',
          message: `Selamat datang, ${result.user.name}!`,
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 3000
        })
        return { success: true }
      } else {
        // Determine error type and message based on response
        const errorMessage = result.message || 'Username atau password salah'
        let errorTitle = 'Login Gagal'
        let errorDetail = errorMessage
        let errorType: 'error' | 'warning' = 'error'

        // Check for authentication errors (401, invalid credentials)
        if ((result as any).error === 401 || 
            errorMessage.toLowerCase().includes('invalid') ||
            errorMessage.toLowerCase().includes('unauthorized') ||
            errorMessage.toLowerCase().includes('password') ||
            errorMessage.toLowerCase().includes('username') ||
            errorMessage.toLowerCase().includes('credentials')) {
          errorType = 'error'
          errorTitle = 'Kredensial Tidak Valid'
          errorDetail = 'Username atau password yang Anda masukkan salah. Silakan periksa kembali.'
        } else if (errorMessage.toLowerCase().includes('network') ||
                  errorMessage.toLowerCase().includes('connection') ||
                  errorMessage.toLowerCase().includes('fetch failed')) {
          errorType = 'warning'
          errorTitle = 'Masalah Koneksi'
          errorDetail = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
        }

        ui.addNotification({
          id: Date.now().toString(),
          type: errorType,
          title: errorTitle,
          message: errorDetail,
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
        return { success: false, message: result.message }
      }
    } catch (error) {
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Terjadi kesalahan sistem',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
      return { success: false, message: 'Terjadi kesalahan sistem' }
    } finally {
      auth.setLoading(false)
    }
  }, [auth, ui])

  const logout = useCallback(async () => {
    auth.setLoading(true)
    
    try {
      await adminUseCases.logout()
      auth.clearAuth()
      ui.addNotification({
        id: Date.now().toString(),
        type: 'info',
        title: 'Logout Berhasil',
        message: 'Anda telah berhasil logout',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 3000
      })
    } catch (error) {
      // Still clear auth even if API call fails
      auth.clearAuth()
    } finally {
      auth.setLoading(false)
    }
  }, [auth, ui])

  const changePassword = useCallback(async (request: AdminChangePasswordRequest) => {
    const result = await adminUseCases.changePassword(request)
    
    ui.addNotification({
      id: Date.now().toString(),
      type: result.success ? 'success' : 'error',
      title: result.success ? 'Berhasil' : 'Gagal',
      message: result.message,
      timestamp: new Date().toISOString(),
      autoClose: true,
      duration: 5000
    })
    
    return result
  }, [ui])

  const updateProfile = useCallback(async (request: UpdateAdminProfileRequest) => {
    const result = await adminUseCases.updateProfile(request)
    
    if (result.success && result.user) {
      auth.updateUser(result.user)
    }
    
    ui.addNotification({
      id: Date.now().toString(),
      type: result.success ? 'success' : 'error',
      title: result.success ? 'Profile Diupdate' : 'Gagal Update Profile',
      message: result.message,
      timestamp: new Date().toISOString(),
      autoClose: true,
      duration: 5000
    })
    
    return result
  }, [auth, ui])

  const checkAuth = useCallback(async () => {
    // Avoid running on server side
    if (typeof window === 'undefined') return false
    
    // Don't check if we're already loading
    if (auth.isLoading) return auth.isAuthenticated
    
    // Quick check - if no stored auth data, don't make API calls
    const hasStoredAuth = adminUseCases.isAuthenticated()
    if (!hasStoredAuth) {
      auth.clearAuth()
      return false
    }

    auth.setLoading(true)
    
    try {
      const isValidToken = await adminUseCases.checkTokenExpiry()
      if (!isValidToken) {
        auth.clearAuth()
        ui.addNotification({
          id: Date.now().toString(),
          type: 'warning',
          title: 'Sesi Berakhir',
          message: 'Silakan login kembali',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
        return false
      }

      // If user is not in store but token is valid, get current user
      if (!auth.user) {
        const user = await adminUseCases.getCurrentUser()
        if (user) {
          auth.updateUser(user)
        }
      }

      return true
    } catch (error) {
      console.error('Check auth error:', error)
      auth.clearAuth()
      return false
    } finally {
      auth.setLoading(false)
    }
  }, [auth, ui])

  // Remove the automatic useEffect that calls checkAuth
  // Let components decide when to call checkAuth

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    isLoading: auth.isLoading,
    login,
    logout,
    changePassword,
    updateProfile,
    checkAuth
  }
}

// Dashboard Hook
export const useAdminDashboard = () => {
  const dashboard = useAdminDashboardStore()
  const ui = useAdminUI()
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  const loadStats = useCallback(async (request?: GetAdminStatsRequest) => {
    dashboard.setStatsLoading(true)
    
    try {
      const stats = await adminUseCases.getDashboardStats(request)
      
      if (stats) {
        dashboard.setStats(stats)
      } else {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Error',
          message: 'Gagal memuat statistik dashboard',
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
      }
    } catch (error) {
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Terjadi kesalahan saat memuat data',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
    } finally {
      dashboard.setStatsLoading(false)
    }
  }, [dashboard, ui])

  const startAutoRefresh = useCallback((intervalMs: number = 30000) => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
    }
    
    const interval = setInterval(() => {
      loadStats()
    }, intervalMs)
    
    setRefreshInterval(interval)
  }, [loadStats, refreshInterval])

  const stopAutoRefresh = useCallback(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval)
      setRefreshInterval(null)
    }
  }, [refreshInterval])

  useEffect(() => {
    // Only load stats on mount, no automatic refresh
    // Let components decide when to load stats
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [refreshInterval]) // Only depend on refreshInterval

  useEffect(() => {
    return () => {
      stopAutoRefresh()
    }
  }, []) // No dependency to prevent loop

  return {
    stats: dashboard.stats,
    recentActivities: dashboard.recentActivities,
    isLoading: dashboard.isStatsLoading,
    lastUpdate: dashboard.lastStatsUpdate,
    loadStats,
    addActivity: dashboard.addActivity,
    clear: dashboard.clearDashboard,
    startAutoRefresh,
    stopAutoRefresh
  }
}

// Permission Hook
export const useAdminPermissions = () => {
  const { user } = useAdminAuth()

  const hasPermission = useCallback((permission: string): boolean => {
    if (!user) return false
    return adminUseCases.hasPermission(permission)
  }, [user])

  const hasRole = useCallback((role: string): boolean => {
    if (!user) return false
    return user.role === role
  }, [user])

  const hasAnyRole = useCallback((roles: string[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }, [user])

  const hasAnyPermission = useCallback((permissions: string[]): boolean => {
    if (!user) return false
    return permissions.some(permission => adminUseCases.hasPermission(permission))
  }, [user])

  const isSuperAdmin = useCallback((): boolean => {
    return hasRole('super_admin')
  }, [hasRole])

  const canManageUsers = useCallback((): boolean => {
    return hasPermission('manage_users') || isSuperAdmin()
  }, [hasPermission, isSuperAdmin])

  const canManageContent = useCallback((): boolean => {
    return hasAnyPermission(['manage_articles', 'manage_donations', 'manage_gallery']) || isSuperAdmin()
  }, [hasAnyPermission, isSuperAdmin])

  const canViewReports = useCallback((): boolean => {
    return hasPermission('view_reports') || isSuperAdmin()
  }, [hasPermission, isSuperAdmin])

  const canManageSettings = useCallback((): boolean => {
    return hasPermission('manage_settings') || isSuperAdmin()
  }, [hasPermission, isSuperAdmin])

  return {
    user,
    hasPermission,
    hasRole,
    hasAnyRole,
    hasAnyPermission,
    isSuperAdmin,
    canManageUsers,
    canManageContent,
    canViewReports,
    canManageSettings
  }
}

// File Upload Hook
export const useAdminFileUpload = () => {
  const ui = useAdminUI()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadFile = useCallback(async (file: File, folder?: string) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate upload progress (replace with actual progress tracking)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 100)

      const result = await adminUseCases.uploadFile(file, folder)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'success',
          title: 'Upload Berhasil',
          message: result.message,
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 3000
        })
      } else {
        ui.addNotification({
          id: Date.now().toString(),
          type: 'error',
          title: 'Upload Gagal',
          message: result.message,
          timestamp: new Date().toISOString(),
          autoClose: true,
          duration: 5000
        })
      }

      return result
    } catch (error) {
      ui.addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Error',
        message: 'Terjadi kesalahan saat upload file',
        timestamp: new Date().toISOString(),
        autoClose: true,
        duration: 5000
      })
      return { success: false, message: 'Terjadi kesalahan saat upload file' }
    } finally {
      setIsUploading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }, [ui])

  return {
    isUploading,
    uploadProgress,
    uploadFile
  }
}

// Form Hook for Admin
export const useAdminForm = <T extends Record<string, any>>(
  initialValues: T,
  validationRules?: Partial<Record<keyof T, (value: any) => string | null>>
) => {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const setValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }, [])

  const validateField = useCallback((field: keyof T, value: any): string | null => {
    if (validationRules && validationRules[field]) {
      return validationRules[field]!(value)
    }
    return null
  }, [validationRules])

  const validateForm = useCallback((): boolean => {
    if (!validationRules) return true

    const newErrors: Partial<Record<keyof T, string>> = {}
    let isValid = true

    Object.keys(validationRules).forEach(field => {
      const error = validateField(field as keyof T, values[field as keyof T])
      if (error) {
        newErrors[field as keyof T] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }, [validationRules, validateField, values])

  const handleSubmit = useCallback(async (
    submitFn: (values: T) => Promise<any>
  ): Promise<any> => {
    setIsSubmitting(true)
    
    try {
      const isValid = validateForm()
      if (!isValid) {
        return { success: false, message: 'Form tidak valid' }
      }

      return await submitFn(values)
    } finally {
      setIsSubmitting(false)
    }
  }, [validateForm, values])

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  const hasErrors = Object.keys(errors).length > 0
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues)

  return {
    values,
    errors,
    touched,
    isSubmitting,
    hasErrors,
    isDirty,
    setValue,
    setFieldTouched,
    validateField,
    validateForm,
    handleSubmit,
    reset
  }
}
