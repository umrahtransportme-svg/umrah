'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard, CalendarCheck, PoundSterling, Car, Users, Building2,
  Star, BarChart3, Settings, FileText, Image, Plug, Bot, MessageSquare,
  Wrench, LogOut, X, ChevronRight, Globe, AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  {
    group: 'Main',
    items: [
      { label: 'Dashboard',       href: '/admin/dashboard',       icon: LayoutDashboard },
      { label: 'Bookings',        href: '/admin/bookings',        icon: CalendarCheck },
      { label: 'Payments',        href: '/admin/payments',        icon: PoundSterling },
    ],
  },
  {
    group: 'Fleet',
    items: [
      { label: 'Drivers',         href: '/admin/drivers',         icon: Users },
      { label: 'Vehicles',        href: '/admin/vehicles',        icon: Car },
      { label: 'Vendors',         href: '/admin/vendors',         icon: Building2 },
    ],
  },
  {
    group: 'Content',
    items: [
      { label: 'Services',        href: '/admin/services',        icon: Wrench },
      { label: 'CMS',             href: '/admin/cms',             icon: FileText },
      { label: 'Media Library',   href: '/admin/media',           icon: Image },
      { label: 'Reviews',         href: '/admin/reviews',         icon: Star },
    ],
  },
  {
    group: 'Operations',
    items: [
      { label: 'Communications',  href: '/admin/communications',  icon: MessageSquare },
      { label: 'Complaints',      href: '/admin/complaints',      icon: AlertCircle },
      { label: 'Automation',      href: '/admin/automation',      icon: Bot },
      { label: 'Integrations',    href: '/admin/integrations',    icon: Plug },
      { label: 'Reports',         href: '/admin/reports',         icon: BarChart3 },
    ],
  },
  {
    group: 'Admin',
    items: [
      { label: 'Users',           href: '/admin/users',           icon: Users },
      { label: 'Settings',        href: '/admin/settings',        icon: Settings },
    ],
  },
]

interface Props {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const sidebar = (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-slate-100">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
          <Globe className="w-4 h-4 text-white" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">UmraTransport</div>
          <div className="text-xs text-slate-400">Admin Panel</div>
        </div>
        <button onClick={onClose} className="ml-auto lg:hidden p-1 rounded text-slate-400 hover:text-slate-600">
          <X className="w-4 h-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
        {NAV.map((group) => (
          <div key={group.group}>
            <p className="px-2 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">{group.group}</p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'sidebar-link',
                      active && 'active',
                    )}
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="flex-1">{item.label}</span>
                    {active && <ChevronRight className="w-3 h-3 opacity-50" />}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  )

  return (
    <>
      {/* Desktop */}
      <div className="hidden lg:flex fixed inset-y-0 left-0 z-40">
        {sidebar}
      </div>

      {/* Mobile overlay */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <div className="relative flex">
            {sidebar}
          </div>
        </div>
      )}
    </>
  )
}
