import type { UserRole } from './types'

const PERMISSIONS: Record<string, UserRole[]> = {
  'dashboard:view':      ['super_admin', 'admin', 'vendor', 'staff'],
  'bookings:view':       ['super_admin', 'admin', 'vendor', 'staff'],
  'bookings:create':     ['super_admin', 'admin', 'staff'],
  'bookings:edit':       ['super_admin', 'admin', 'staff'],
  'bookings:delete':     ['super_admin', 'admin'],
  'payments:view':       ['super_admin', 'admin'],
  'payments:refund':     ['super_admin', 'admin'],
  'vehicles:view':       ['super_admin', 'admin', 'vendor'],
  'vehicles:manage':     ['super_admin', 'admin'],
  'drivers:view':        ['super_admin', 'admin', 'vendor'],
  'drivers:manage':      ['super_admin', 'admin'],
  'vendors:view':        ['super_admin', 'admin'],
  'vendors:manage':      ['super_admin'],
  'services:manage':     ['super_admin', 'admin'],
  'cms:manage':          ['super_admin', 'admin'],
  'media:manage':        ['super_admin', 'admin', 'staff'],
  'integrations:manage': ['super_admin'],
  'automation:manage':   ['super_admin', 'admin'],
  'reports:view':        ['super_admin', 'admin'],
  'reviews:manage':      ['super_admin', 'admin'],
  'settings:manage':     ['super_admin'],
  'users:manage':        ['super_admin'],
  'communications:send': ['super_admin', 'admin', 'staff'],
}

export function can(role: UserRole, permission: string): boolean {
  return PERMISSIONS[permission]?.includes(role) ?? false
}

export function hasAnyPermission(role: UserRole, permissions: string[]): boolean {
  return permissions.some((p) => can(role, p))
}
