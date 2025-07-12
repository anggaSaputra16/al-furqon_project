// Base Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  errors?: string[]
  timestamp: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Admin Authentication Response Types
export interface AdminLoginResponse {
  user: AdminUser
  token: string
  refreshToken: string
  expiresIn: number
  permissions: string[]
}

export interface AdminRefreshTokenResponse {
  token: string
  expiresIn: number
}

export interface AdminUser {
  id: string
  username: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'editor'
  permissions: string[]
  isActive: boolean
  lastLogin: string
  loginCount: number
  avatar?: string
  createdAt: string
  updatedAt: string
}

// Admin Dashboard Stats Response Types
export interface AdminDashboardStats {
  totalArticles: number
  totalDonations: number
  totalUsers: number
  totalFinancialTransactions: number
  monthlyViews: number
  activeDonations: number
  monthlyIncome: number
  monthlyExpense: number
  totalBalance: number
  recentActivities: AdminActivity[]
  popularContent: PopularContent[]
  systemHealth: SystemHealth
}

export interface AdminActivity {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  description: string
  ipAddress: string
  userAgent: string
  timestamp: string
  status: 'success' | 'failed'
}

export interface PopularContent {
  id: string
  title: string
  type: 'article' | 'donation' | 'gallery'
  views: number
  publishedAt: string
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  uptime: number
  memoryUsage: number
  diskUsage: number
  responseTime: number
  lastBackup: string
}

// Admin User Management Response Types
export interface AdminUserListResponse extends PaginatedResponse<AdminUser> {}

export interface AdminUserDetailResponse {
  user: AdminUser
  activities: AdminActivity[]
  stats: {
    totalActions: number
    lastActivity: string
    articlesCreated: number
    donationsManaged: number
  }
}

// Admin Settings Response Types
export interface AdminSettingsResponse {
  general: {
    siteName: string
    siteDescription: string
    siteUrl: string
    email: string
    phone: string
    address: string
    logo: string
    favicon: string
  }
  security: {
    sessionTimeout: number
    passwordMinLength: number
    requireStrongPassword: boolean
    twoFactorAuth: boolean
    loginAttempts: number
    lockoutDuration: number
    ipWhitelist: string[]
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    newUserNotification: boolean
    newArticleNotification: boolean
    newDonationNotification: boolean
    systemAlerts: boolean
  }
  system: {
    maintenanceMode: boolean
    allowRegistration: boolean
    debugMode: boolean
    cacheEnabled: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
  }
}

// Admin Permissions Response Types
export interface AdminPermission {
  id: string
  name: string
  resource: string
  action: string
  description: string
}

export interface AdminRole {
  id: string
  name: string
  description: string
  permissions: AdminPermission[]
  isDefault: boolean
}

export interface AdminPermissionsResponse {
  roles: AdminRole[]
  permissions: AdminPermission[]
}

// Admin Audit Log Response Types
export interface AdminAuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId: string
  oldData: any
  newData: any
  ipAddress: string
  userAgent: string
  timestamp: string
}

export interface AdminAuditLogsResponse extends PaginatedResponse<AdminAuditLog> {}

// Admin File Upload Response Types
export interface AdminFileUploadResponse {
  file: {
    id: string
    originalName: string
    fileName: string
    path: string
    url: string
    mimeType: string
    size: number
    uploadedBy: string
    uploadedAt: string
  }
}

// Admin Backup Response Types
export interface AdminBackup {
  id: string
  fileName: string
  size: number
  type: 'automatic' | 'manual'
  status: 'completed' | 'in_progress' | 'failed'
  createdAt: string
  downloadUrl: string
}

export interface AdminBackupsResponse extends PaginatedResponse<AdminBackup> {}

// Admin System Info Response Types
export interface AdminSystemInfo {
  version: string
  environment: 'development' | 'staging' | 'production'
  database: {
    type: string
    version: string
    size: string
    tables: number
  }
  server: {
    os: string
    nodeVersion: string
    uptime: number
    memory: {
      total: number
      used: number
      free: number
    }
    cpu: {
      model: string
      cores: number
      usage: number
    }
  }
  storage: {
    total: number
    used: number
    free: number
  }
}
