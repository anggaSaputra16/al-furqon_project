import { adminRepository } from '../repositories/adminRepository'
import {
  AdminLoginRequest,
  AdminChangePasswordRequest,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  UpdateAdminProfileRequest,
  GetAdminStatsRequest,
  UpdateAdminSettingsRequest,
  UpdateSecuritySettingsRequest
} from '../types/adminRequestTypes'
import {
  AdminLoginResponse,
  AdminUser,
  AdminDashboardStats,
  AdminUserListResponse,
  AdminSettingsResponse
} from '../types/adminResponseTypes'

class AdminUseCases {
  // Safe localStorage utilities
  private safeLocalStorage = {
    getItem: (key: string): string | null => {
      try {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(key)
      } catch {
        return null
      }
    },
    setItem: (key: string, value: string): void => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(key, value)
        }
      } catch {
        // Silently fail
      }
    },
    removeItem: (key: string): void => {
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(key)
        }
      } catch {
        // Silently fail
      }
    }
  }

  // Authentication Use Cases
  async login(credentials: AdminLoginRequest): Promise<{
    success: boolean
    user?: AdminUser
    token?: string
    message?: string
  }> {
    try {
      const response = await adminRepository.login(credentials)
      
      if (response.success && response.data) {
        // Store authentication data
        const authData = {
          token: response.data.token,
          refreshToken: response.data.refreshToken,
          expires: new Date().getTime() + (response.data.expiresIn * 1000)
        }
        
        this.safeLocalStorage.setItem('admin_auth', JSON.stringify(authData))
        this.safeLocalStorage.setItem('admin_user', JSON.stringify(response.data.user))
        
        return {
          success: true,
          user: response.data.user,
          token: response.data.token
        }
      }
      
      return {
        success: false,
        message: response.message || 'Login failed'
      }
    } catch (error) {
      console.error('Login use case error:', error)
      return {
        success: false,
        message: 'Network error. Please try again.'
      }
    }
  }

  async logout(): Promise<boolean> {
    try {
      const authData = this.safeLocalStorage.getItem('admin_auth')
      if (authData) {
        const { token } = JSON.parse(authData)
        await adminRepository.logout({ token })
      }
      
      // Clear local storage
      this.safeLocalStorage.removeItem('admin_auth')
      this.safeLocalStorage.removeItem('admin_user')
      
      return true
    } catch (error) {
      console.error('Logout use case error:', error)
      // Clear local storage even if API call fails
      this.safeLocalStorage.removeItem('admin_auth')
      this.safeLocalStorage.removeItem('admin_user')
      return false
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const authData = this.safeLocalStorage.getItem('admin_auth')
      if (!authData) return false
      
      const { refreshToken } = JSON.parse(authData)
      const response = await adminRepository.refreshToken({ refreshToken })
      
      if (response.success && response.data) {
        const newAuthData = {
          token: response.data.token,
          refreshToken,
          expires: new Date().getTime() + (response.data.expiresIn * 1000)
        }
        
        this.safeLocalStorage.setItem('admin_auth', JSON.stringify(newAuthData))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Refresh token use case error:', error)
      return false
    }
  }

  async getCurrentUser(): Promise<AdminUser | null> {
    try {
      // Don't make API call if no token available
      const authData = this.safeLocalStorage.getItem('admin_auth')
      if (!authData) {
        console.log('No auth data available for getCurrentUser')
        return null
      }

      const response = await adminRepository.getCurrentUser()
      
      if (response.success && response.data) {
        // Update stored user data
        this.safeLocalStorage.setItem('admin_user', JSON.stringify(response.data))
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Get current user use case error:', error)
      // Clear invalid auth data on error
      if (error instanceof Error && error.message.includes('Unauthorized')) {
        this.safeLocalStorage.removeItem('admin_auth')
        this.safeLocalStorage.removeItem('admin_user')
      }
      return null
    }
  }

  async changePassword(request: AdminChangePasswordRequest): Promise<{
    success: boolean
    message: string
  }> {
    try {
      if (request.newPassword !== request.confirmPassword) {
        return {
          success: false,
          message: 'Password baru dan konfirmasi password tidak cocok'
        }
      }

      const response = await adminRepository.changePassword(request)
      
      return {
        success: response.success,
        message: response.message || (response.success ? 'Password berhasil diubah' : 'Gagal mengubah password')
      }
    } catch (error) {
      console.error('Change password use case error:', error)
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
  }

  // Dashboard Use Cases
  async getDashboardStats(request?: GetAdminStatsRequest): Promise<AdminDashboardStats | null> {
    try {
      const response = await adminRepository.getDashboardStats(request)
      
      if (response.success && response.data) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Get dashboard stats use case error:', error)
      return null
    }
  }

  // User Management Use Cases
  async getAdminUsers(page = 1, limit = 10): Promise<AdminUserListResponse | null> {
    try {
      const response = await adminRepository.getAdminUsers(page, limit)
      
      if (response.success && response.data) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Get admin users use case error:', error)
      return null
    }
  }

  async createAdminUser(request: CreateAdminUserRequest): Promise<{
    success: boolean
    user?: AdminUser
    message: string
  }> {
    try {
      // Validate request
      if (!request.username || !request.email || !request.password) {
        return {
          success: false,
          message: 'Username, email, dan password wajib diisi'
        }
      }

      const response = await adminRepository.createAdminUser(request)
      
      return {
        success: response.success,
        user: response.data,
        message: response.message || (response.success ? 'User berhasil dibuat' : 'Gagal membuat user')
      }
    } catch (error) {
      console.error('Create admin user use case error:', error)
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
  }

  async updateAdminUser(request: UpdateAdminUserRequest): Promise<{
    success: boolean
    user?: AdminUser
    message: string
  }> {
    try {
      const response = await adminRepository.updateAdminUser(request)
      
      return {
        success: response.success,
        user: response.data,
        message: response.message || (response.success ? 'User berhasil diupdate' : 'Gagal mengupdate user')
      }
    } catch (error) {
      console.error('Update admin user use case error:', error)
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
  }

  async deleteAdminUser(userId: string): Promise<{
    success: boolean
    message: string
  }> {
    try {
      const response = await adminRepository.deleteAdminUser({ id: userId })
      
      return {
        success: response.success,
        message: response.message || (response.success ? 'User berhasil dihapus' : 'Gagal menghapus user')
      }
    } catch (error) {
      console.error('Delete admin user use case error:', error)
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
  }

  // Profile Management Use Cases
  async updateProfile(request: UpdateAdminProfileRequest): Promise<{
    success: boolean
    user?: AdminUser
    message: string
  }> {
    try {
      const response = await adminRepository.updateProfile(request)
      
      if (response.success && response.data) {
        // Update stored user data
        this.safeLocalStorage.setItem('admin_user', JSON.stringify(response.data))
      }
      
      return {
        success: response.success,
        user: response.data,
        message: response.message || (response.success ? 'Profile berhasil diupdate' : 'Gagal mengupdate profile')
      }
    } catch (error) {
      console.error('Update profile use case error:', error)
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
  }

  // Settings Use Cases
  async getSettings(): Promise<AdminSettingsResponse | null> {
    try {
      const response = await adminRepository.getSettings()
      
      if (response.success && response.data) {
        return response.data
      }
      
      return null
    } catch (error) {
      console.error('Get settings use case error:', error)
      return null
    }
  }

  async updateSettings(request: UpdateAdminSettingsRequest): Promise<{
    success: boolean
    settings?: AdminSettingsResponse
    message: string
  }> {
    try {
      const response = await adminRepository.updateSettings(request)
      
      return {
        success: response.success,
        settings: response.data,
        message: response.message || (response.success ? 'Pengaturan berhasil disimpan' : 'Gagal menyimpan pengaturan')
      }
    } catch (error) {
      console.error('Update settings use case error:', error)
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
  }

  async updateSecuritySettings(request: UpdateSecuritySettingsRequest): Promise<{
    success: boolean
    message: string
  }> {
    try {
      const response = await adminRepository.updateSecuritySettings(request)
      
      return {
        success: response.success,
        message: response.message || (response.success ? 'Pengaturan keamanan berhasil disimpan' : 'Gagal menyimpan pengaturan keamanan')
      }
    } catch (error) {
      console.error('Update security settings use case error:', error)
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
  }

  // File Upload Use Cases
  async uploadFile(file: File, folder?: string): Promise<{
    success: boolean
    url?: string
    message: string
  }> {
    try {
      // Validate file
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        return {
          success: false,
          message: 'File terlalu besar. Maksimal 5MB.'
        }
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          message: 'Format file tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.'
        }
      }

      const response = await adminRepository.uploadFile(file, folder)
      
      return {
        success: response.success,
        url: response.data?.file.url,
        message: response.message || (response.success ? 'File berhasil diupload' : 'Gagal mengupload file')
      }
    } catch (error) {
      console.error('Upload file use case error:', error)
      return {
        success: false,
        message: 'Terjadi kesalahan. Silakan coba lagi.'
      }
    }
  }

  // Utility Methods
  isAuthenticated(): boolean {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') return false
      
      const authData = this.safeLocalStorage.getItem('admin_auth')
      if (!authData) return false
      
      const { expires } = JSON.parse(authData)
      return new Date().getTime() < expires
    } catch (error) {
      return false
    }
  }

  getStoredUser(): AdminUser | null {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') return null
      
      const userData = this.safeLocalStorage.getItem('admin_user')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      return null
    }
  }

  hasPermission(permission: string): boolean {
    const user = this.getStoredUser()
    if (!user) return false
    
    return user.permissions.includes(permission) || user.role === 'super_admin'
  }

  async checkTokenExpiry(): Promise<boolean> {
    try {
      // Check if we're in browser environment
      if (typeof window === 'undefined') return false
      
      const authData = this.safeLocalStorage.getItem('admin_auth')
      if (!authData) return false
      
      const { expires } = JSON.parse(authData)
      const now = new Date().getTime()
      const timeUntilExpiry = expires - now
      
      // If token expires in less than 5 minutes, try to refresh
      if (timeUntilExpiry < 5 * 60 * 1000) {
        return await this.refreshToken()
      }
      
      return timeUntilExpiry > 0
    } catch (error) {
      return false
    }
  }
}

// Export singleton instance
export const adminUseCases = new AdminUseCases()
export default adminUseCases
