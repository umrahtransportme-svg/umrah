'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/layout/Sidebar'
import AdminDashboardHeader from '@/components/admin/layout/DashboardHeader'

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':      'Dashboard',
  '/admin/bookings':       'Bookings',
  '/admin/payments':       'Payments',
  '/admin/vehicles':       'Vehicles',
  '/admin/drivers':        'Drivers',
  '/admin/vendors':        'Vendors',
  '/admin/services':       'Services',
  '/admin/cms':            'CMS',
  '/admin/media':          'Media Library',
  '/admin/integrations':   'Integrations',
  '/admin/automation':     'Automation',
  '/admin/communications': 'Communications',
  '/admin/reports':        'Reports',
  '/admin/reviews':        'Reviews',
  '/admin/settings':       'Settings',
  '/admin/users':          'User Management',
}

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const title = Object.entries(PAGE_TITLES).find(([path]) => pathname.startsWith(path))?.[1] ?? 'Admin'

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <AdminDashboardHeader onMenuToggle={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
