'use client'

import { Bell, Menu, Search } from 'lucide-react'

interface Props {
  title: string
  onMenuToggle: () => void
}

export default function AdminDashboardHeader({ title, onMenuToggle }: Props) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 px-4 lg:px-6 h-14 bg-white border-b border-slate-100">
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-bold text-slate-900 text-sm flex-1">{title}</h1>

      <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-400 cursor-pointer hover:bg-slate-100 transition-colors">
        <Search className="w-3.5 h-3.5" />
        <span>Search...</span>
        <kbd className="ml-2 px-1.5 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono">⌘K</kbd>
      </div>

      <button className="relative p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
        <Bell className="w-4 h-4" />
        <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
      </button>

      <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
        A
      </div>
    </header>
  )
}
