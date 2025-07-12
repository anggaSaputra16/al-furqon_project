// Admin Authentication Request Types
export interface AdminLoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface AdminRefreshTokenRequest {
  refreshToken: string
}

export interface AdminLogoutRequest {
  token: string
}

export interface AdminChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// Admin User Management Request Types
export interface CreateAdminUserRequest {
  username: string
  email: string
  name: string
  password: string
  role: 'super_admin' | 'admin' | 'editor'
  permissions: string[]
}

export interface UpdateAdminUserRequest {
  id: string
  username?: string
  email?: string
  name?: string
  role?: 'super_admin' | 'admin' | 'editor'
  permissions?: string[]
  isActive?: boolean
}

export interface DeleteAdminUserRequest {
  id: string
}

// Admin Profile Request Types
export interface UpdateAdminProfileRequest {
  name: string
  email: string
  phone?: string
  avatar?: File
}

// Admin Activity Log Request Types
export interface GetAdminActivityLogsRequest {
  page?: number
  limit?: number
  startDate?: string
  endDate?: string
  userId?: string
  action?: string
}

// Admin Dashboard Stats Request Types
export interface GetAdminStatsRequest {
  period?: 'day' | 'week' | 'month' | 'year'
  startDate?: string
  endDate?: string
}

// Admin Bulk Operations Request Types
export interface BulkDeleteRequest {
  ids: string[]
}

export interface BulkUpdateStatusRequest {
  ids: string[]
  status: 'active' | 'inactive' | 'pending'
}

// Admin Settings Request Types
export interface UpdateAdminSettingsRequest {
  siteName?: string
  siteDescription?: string
  siteUrl?: string
  email?: string
  phone?: string
  address?: string
  logo?: File
  favicon?: File
  maintenanceMode?: boolean
  allowRegistration?: boolean
  emailNotifications?: boolean
  smsNotifications?: boolean
}

// Admin Security Settings Request Types
export interface UpdateSecuritySettingsRequest {
  sessionTimeout?: number
  passwordMinLength?: number
  requireStrongPassword?: boolean
  twoFactorAuth?: boolean
  loginAttempts?: number
  lockoutDuration?: number
  ipWhitelist?: string[]
}
