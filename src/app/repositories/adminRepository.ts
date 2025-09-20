import {
  AdminLoginRequest,
  AdminRefreshTokenRequest,
  AdminLogoutRequest,
  AdminChangePasswordRequest,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
  DeleteAdminUserRequest,
  UpdateAdminProfileRequest,
  GetAdminActivityLogsRequest,
  GetAdminStatsRequest,
  UpdateAdminSettingsRequest,
  UpdateSecuritySettingsRequest,
  BulkDeleteRequest,
  BulkUpdateStatusRequest
} from '../types/adminRequestTypes'
import {
  ApiResponse,
  AdminLoginResponse,
  AdminRefreshTokenResponse,
  AdminUser,
  AdminDashboardStats,
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminSettingsResponse,
  AdminPermissionsResponse,
  AdminAuditLogsResponse,
  AdminFileUploadResponse,
  AdminBackupsResponse,
  AdminSystemInfo
} from '../types/adminResponseTypes'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const API_VERSION = '/api/v1'

class AdminRepository {
  private readonly baseUrl: string
  private readonly defaultHeaders: HeadersInit

  constructor() {
    this.baseUrl = `${API_BASE_URL}${API_VERSION}`
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }


  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('admin_auth')
    if (token) {
      const authData = JSON.parse(token)
      return {
        ...this.defaultHeaders,
        'Authorization': `Bearer ${authData.token}`
      }
    }
    return this.defaultHeaders
  }


  private async apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const data = await response.json()
      
      if (!response.ok) {


        if (response.status === 401 && endpoint.includes('/auth/')) {
          return data
        }
        

        if (response.status === 404) {
          throw new Error('Endpoint not found')
        } else if (response.status >= 500) {
          throw new Error('Server error - Please try again later')
        } else {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      }

      return data
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - Please check your connection')
        }
        console.error('API request failed:', error.message)
        throw error
      }
      
      throw new Error('Network error occurred')
    }
  }


  async login(request: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> {
    return this.apiRequest<AdminLoginResponse>('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async refreshToken(request: AdminRefreshTokenRequest): Promise<ApiResponse<AdminRefreshTokenResponse>> {
    return this.apiRequest<AdminRefreshTokenResponse>('/admin/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async logout(request: AdminLogoutRequest): Promise<ApiResponse<void>> {
    return this.apiRequest<void>('/admin/auth/logout', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async changePassword(request: AdminChangePasswordRequest): Promise<ApiResponse<void>> {
    return this.apiRequest<void>('/admin/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(request)
    })
  }

  async getCurrentUser(): Promise<ApiResponse<AdminUser>> {
    return this.apiRequest<AdminUser>('/admin/auth/me')
  }


  async getDashboardStats(request?: GetAdminStatsRequest): Promise<ApiResponse<AdminDashboardStats>> {
    const params = new URLSearchParams()
    if (request?.period) params.append('period', request.period)
    if (request?.startDate) params.append('startDate', request.startDate)
    if (request?.endDate) params.append('endDate', request.endDate)

    const query = params.toString() ? `?${params.toString()}` : ''
    return this.apiRequest<AdminDashboardStats>(`/admin/dashboard${query}`)
  }


  async getAdminUsers(page = 1, limit = 10): Promise<ApiResponse<AdminUserListResponse>> {
    return this.apiRequest<AdminUserListResponse>(`/admin/users?page=${page}&limit=${limit}`)
  }

  async getAdminUser(id: string): Promise<ApiResponse<AdminUserDetailResponse>> {
    return this.apiRequest<AdminUserDetailResponse>(`/admin/users/${id}`)
  }

  async createAdminUser(request: CreateAdminUserRequest): Promise<ApiResponse<AdminUser>> {
    return this.apiRequest<AdminUser>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }

  async updateAdminUser(request: UpdateAdminUserRequest): Promise<ApiResponse<AdminUser>> {
    return this.apiRequest<AdminUser>(`/admin/users/${request.id}`, {
      method: 'PUT',
      body: JSON.stringify(request)
    })
  }

  async deleteAdminUser(request: DeleteAdminUserRequest): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/admin/users/${request.id}`, {
      method: 'DELETE'
    })
  }

  async bulkDeleteUsers(request: BulkDeleteRequest): Promise<ApiResponse<void>> {
    return this.apiRequest<void>('/admin/users/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify(request)
    })
  }

  async bulkUpdateUserStatus(request: BulkUpdateStatusRequest): Promise<ApiResponse<void>> {
    return this.apiRequest<void>('/admin/users/bulk-status', {
      method: 'PUT',
      body: JSON.stringify(request)
    })
  }


  async updateProfile(request: UpdateAdminProfileRequest): Promise<ApiResponse<AdminUser>> {
    const formData = new FormData()
    formData.append('name', request.name)
    formData.append('email', request.email)
    if (request.phone) formData.append('phone', request.phone)
    if (request.avatar) formData.append('avatar', request.avatar)

    return this.apiRequest<AdminUser>('/admin/profile', {
      method: 'PUT',
      body: formData,
      headers: {}
    })
  }


  async getSettings(): Promise<ApiResponse<AdminSettingsResponse>> {
    return this.apiRequest<AdminSettingsResponse>('/admin/settings')
  }

  async updateSettings(request: UpdateAdminSettingsRequest): Promise<ApiResponse<AdminSettingsResponse>> {
    const formData = new FormData()
    
    Object.entries(request).forEach(([key, value]) => {
      if (value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })

    return this.apiRequest<AdminSettingsResponse>('/admin/settings', {
      method: 'PUT',
      body: formData,
      headers: {}
    })
  }

  async updateSecuritySettings(request: UpdateSecuritySettingsRequest): Promise<ApiResponse<void>> {
    return this.apiRequest<void>('/admin/settings/security', {
      method: 'PUT',
      body: JSON.stringify(request)
    })
  }


  async getPermissions(): Promise<ApiResponse<AdminPermissionsResponse>> {
    return this.apiRequest<AdminPermissionsResponse>('/admin/permissions')
  }


  async getActivityLogs(request?: GetAdminActivityLogsRequest): Promise<ApiResponse<AdminAuditLogsResponse>> {
    const params = new URLSearchParams()
    if (request?.page) params.append('page', String(request.page))
    if (request?.limit) params.append('limit', String(request.limit))
    if (request?.startDate) params.append('startDate', request.startDate)
    if (request?.endDate) params.append('endDate', request.endDate)
    if (request?.userId) params.append('userId', request.userId)
    if (request?.action) params.append('action', request.action)

    const query = params.toString() ? `?${params.toString()}` : ''
    return this.apiRequest<AdminAuditLogsResponse>(`/admin/activity-logs${query}`)
  }


  async uploadFile(file: File, folder?: string): Promise<ApiResponse<AdminFileUploadResponse>> {
    const formData = new FormData()
    formData.append('file', file)
    if (folder) formData.append('folder', folder)

    return this.apiRequest<AdminFileUploadResponse>('/admin/upload', {
      method: 'POST',
      body: formData,
      headers: {}
    })
  }


  async getBackups(page = 1, limit = 10): Promise<ApiResponse<AdminBackupsResponse>> {
    return this.apiRequest<AdminBackupsResponse>(`/admin/backups?page=${page}&limit=${limit}`)
  }

  async createBackup(): Promise<ApiResponse<void>> {
    return this.apiRequest<void>('/admin/backups', {
      method: 'POST'
    })
  }

  async downloadBackup(backupId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/admin/backups/${backupId}/download`, {
      headers: this.getAuthHeaders()
    })
    return response.blob()
  }


  async getSystemInfo(): Promise<ApiResponse<AdminSystemInfo>> {
    return this.apiRequest<AdminSystemInfo>('/admin/system/info')
  }

  async clearCache(): Promise<ApiResponse<void>> {
    return this.apiRequest<void>('/admin/system/clear-cache', {
      method: 'POST'
    })
  }

  async restartSystem(): Promise<ApiResponse<void>> {
    return this.apiRequest<void>('/admin/system/restart', {
      method: 'POST'
    })
  }
}


export const adminRepository = new AdminRepository()
export default adminRepository
