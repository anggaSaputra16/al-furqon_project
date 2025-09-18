export type UserRole = 'super_admin' | 'admin' | 'editor' | 'reviewer' | 'viewer'

export interface RolePermissions {
  canAccessDashboard: boolean
  canAccessUsers: boolean
  canCreateUsers: boolean
  canEditUsers: boolean
  canDeleteUsers: boolean
  canAccessArticles: boolean
  canCreateArticles: boolean
  canEditArticles: boolean
  canDeleteArticles: boolean
  canPublishArticles: boolean
  canAccessFinance: boolean
  canEditFinance: boolean
  canAccessDonations: boolean
  canEditDonations: boolean
  canAccessReports: boolean
  canAccessGraha: boolean
  canEditGraha: boolean
  canCreateGraha: boolean
  canDeleteGraha: boolean
}


export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  super_admin: {
    canAccessDashboard: true,
    canAccessUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canAccessArticles: true,
    canCreateArticles: true,
    canEditArticles: true,
    canDeleteArticles: true,
    canPublishArticles: true,
    canAccessFinance: true,
    canEditFinance: true,
    canAccessDonations: true,
    canEditDonations: true,
    canAccessReports: true,
    canAccessGraha: true,
    canEditGraha: true,
    canCreateGraha: true,
    canDeleteGraha: true,
  },
  admin: {
    canAccessDashboard: true,
    canAccessUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canAccessArticles: true,
    canCreateArticles: true,
    canEditArticles: true,
    canDeleteArticles: true,
    canPublishArticles: true,
    canAccessFinance: false,
    canEditFinance: false,
    canAccessDonations: false,
    canEditDonations: false,
    canAccessReports: false,
    canAccessGraha: true,
    canEditGraha: true,
    canCreateGraha: true,
    canDeleteGraha: true,
  },
  editor: {
    canAccessDashboard: true,
    canAccessUsers: true,
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canAccessArticles: true,
    canCreateArticles: true,
    canEditArticles: true,
    canDeleteArticles: true,
    canPublishArticles: true,
    canAccessFinance: false,
    canEditFinance: false,
    canAccessDonations: false,
    canEditDonations: false,
    canAccessReports: false,
    canAccessGraha: true,
    canEditGraha: true,
    canCreateGraha: true,
    canDeleteGraha: true,
  },
  reviewer: {
    canAccessDashboard: true,
    canAccessUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canAccessArticles: true,
    canCreateArticles: false,
    canEditArticles: false,
    canDeleteArticles: false,
    canPublishArticles: false,
    canAccessFinance: false,
    canEditFinance: false,
    canAccessDonations: false,
    canEditDonations: false,
    canAccessReports: false,
    canAccessGraha: false,
    canEditGraha: false,
    canCreateGraha: false,
    canDeleteGraha: false,
  },
  viewer: {
    canAccessDashboard: true,
    canAccessUsers: false,
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canAccessArticles: true,
    canCreateArticles: false,
    canEditArticles: false,
    canDeleteArticles: false,
    canPublishArticles: false,
    canAccessFinance: false,
    canEditFinance: false,
    canAccessDonations: false,
    canEditDonations: false,
    canAccessReports: false,
    canAccessGraha: false,
    canEditGraha: false,
    canCreateGraha: false,
    canDeleteGraha: false,
  },
}


export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrator',
  editor: 'Editor',
  reviewer: 'Reviewer',
  viewer: 'Viewer',
}

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: '#dc2626',
  admin: '#ea580c',
  editor: '#0ea5e9',
  reviewer: '#8b5cf6',
  viewer: '#10b981',
}

export const getRolePermissions = (role: UserRole): RolePermissions => {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.viewer
}

export const hasPermission = (role: UserRole, permission: keyof RolePermissions): boolean => {
  const permissions = getRolePermissions(role)
  return permissions[permission]
}

export const canAccessRoute = (role: UserRole, route: string): boolean => {
  const permissions = getRolePermissions(role)
  
  switch (route) {
    case '/admin':
    case '/admin/dashboard':
      return permissions.canAccessDashboard
    case '/admin/users':
      return permissions.canAccessUsers
    case '/admin/articles':
      return permissions.canAccessArticles
    case '/admin/finance':
      return permissions.canAccessFinance
    case '/admin/donations':
      return permissions.canAccessDonations
    case '/admin/reports':
      return permissions.canAccessReports
    case '/admin/graha-subagdja':
      return permissions.canAccessGraha
    default:
      return false
  }
}
