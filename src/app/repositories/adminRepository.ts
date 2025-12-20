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
  BulkUpdateStatusRequest,
  CreateVideoRequest,
  UpdateVideoRequest,
  DeleteVideoRequest,
  GetVideosRequest
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
  AdminSystemInfo,
  PaginatedResponse
} from '../types/adminResponseTypes'
import { VideoResponse } from '../types/responseTypes'


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
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
        // Check for invalid token errors and trigger auto logout (exclude login endpoint)
        if (!endpoint.includes('/auth/login') && this.isInvalidTokenError(response.status, data)) {
          this.handleInvalidToken(endpoint)
        }

        // Special handling for login endpoint
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

  private isInvalidTokenError(statusCode: number, errorData: any): boolean {
    // Check for invalid token based on status code and error message
    const isUnauthorized = statusCode === 401 || errorData?.error === 401
    const hasInvalidTokenMessage = errorData?.message?.toLowerCase().includes('invalid token') ||
                                   errorData?.message?.toLowerCase().includes('token expired') ||
                                   errorData?.message?.toLowerCase().includes('unauthorized') ||
                                   errorData?.message?.toLowerCase().includes('access token required')
    
    return (isUnauthorized || statusCode === 500) && hasInvalidTokenMessage
  }

  private handleInvalidToken(endpoint: string): void {
    console.warn('🔒 Invalid token detected in admin repository, logging out user...')
    
    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      // Clear admin token since this is admin repository
      localStorage.removeItem('admin_auth')
      localStorage.removeItem('alfurqon_token')
      
      // Dispatch auto logout event for AuthHandler to pick up
      const event = new CustomEvent('autoLogout', {
        detail: {
          message: 'Sesi Anda telah berakhir. Silakan login kembali.',
          type: 'warning',
          endpoint: endpoint,
          source: 'admin'
        }
      })
      window.dispatchEvent(event)
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

  // Video Management Methods
  async getVideos(params?: GetVideosRequest): Promise<ApiResponse<PaginatedResponse<VideoResponse>>> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.search) queryParams.append('search', params.search)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString())
    if (params?.isFeatured !== undefined) queryParams.append('isFeatured', params.isFeatured.toString())
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder)

    const url = queryParams.toString() ? `/admin/videos?${queryParams.toString()}` : '/admin/videos'
    return this.apiRequest<PaginatedResponse<VideoResponse>>(url)
  }

  async createVideo(data: CreateVideoRequest): Promise<ApiResponse<VideoResponse>> {
    return this.apiRequest<VideoResponse>('/admin/videos', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateVideo(data: UpdateVideoRequest): Promise<ApiResponse<VideoResponse>> {
    return this.apiRequest<VideoResponse>(`/admin/videos/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteVideo(id: string): Promise<ApiResponse<void>> {
    return this.apiRequest<void>(`/admin/videos/${id}`, {
      method: 'DELETE'
    })
  }

  async getVideoById(id: string): Promise<ApiResponse<VideoResponse>> {
    return this.apiRequest<VideoResponse>(`/admin/videos/${id}`)
  }
}


export const adminRepository = new AdminRepository()
export default adminRepository
