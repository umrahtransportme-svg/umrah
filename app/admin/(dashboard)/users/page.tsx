'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Mail, Phone, CheckCircle, XCircle } from 'lucide-react'
import AdminModal from '@/components/admin/ui/Modal'
import { MOCK_USERS } from '@/lib/admin/mock-data'
import { cn } from '@/lib/utils'
import { formatDateTime, ROLE_COLORS, ROLE_LABELS } from '@/lib/admin/utils'
import type { AdminUser, UserRole } from '@/lib/admin/types'

export default function AdminUsersPage() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null)

  function toggleActive(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{users.length} users across all roles</p>
        <button className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors" onClick={() => setInviteOpen(true)}>
          <Plus className="w-3.5 h-3.5" /> Invite User
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead><tr><th className="table-th">User</th><th className="table-th hidden md:table-cell">Contact</th><th className="table-th">Role</th><th className="table-th hidden lg:table-cell">Last Login</th><th className="table-th">Status</th><th className="table-th text-right">Actions</th></tr></thead>
          <tbody>
            {users.map((user) => {
              const rc = ROLE_COLORS[user.role]
              return (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">{user.name[0]}</div>
                      <div><div className="text-sm font-medium text-slate-900">{user.name}</div><div className="text-xs text-slate-400">{user.email}</div></div>
                    </div>
                  </td>
                  <td className="table-td hidden md:table-cell">
                    {user.phone && <div className="flex items-center gap-1 text-xs text-slate-600"><Phone className="w-3 h-3 text-slate-400" />{user.phone}</div>}
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5"><Mail className="w-3 h-3 text-slate-400" />{user.email}</div>
                  </td>
                  <td className="table-td"><span className={cn('badge', rc.bg, rc.text)}>{ROLE_LABELS[user.role]}</span></td>
                  <td className="table-td hidden lg:table-cell"><span className="text-xs text-slate-500">{user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}</span></td>
                  <td className="table-td">{user.isActive ? <span className="flex items-center gap-1 text-xs text-green-700"><CheckCircle className="w-3.5 h-3.5" /> Active</span> : <span className="flex items-center gap-1 text-xs text-slate-500"><XCircle className="w-3.5 h-3.5" /> Inactive</span>}</td>
                  <td className="table-td">
                    <div className="flex items-center justify-end gap-1">
                      <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => toggleActive(user.id)} className={cn('w-7 h-7 flex items-center justify-center rounded-lg transition-colors text-xs', user.isActive ? 'text-slate-400 hover:bg-red-50 hover:text-red-600' : 'text-slate-400 hover:bg-green-50 hover:text-green-600')}>{user.isActive ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}</button>
                      <button onClick={() => setDeleteUser(user)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <AdminModal open={inviteOpen} onClose={() => setInviteOpen(false)} title="Invite New User" footer={<><button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setInviteOpen(false)}>Cancel</button><button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors" onClick={() => setInviteOpen(false)}>Send Invite</button></>}>
        <div className="space-y-4">
          <div><label className="label">Full Name</label><input type="text" placeholder="John Smith" className="input" /></div>
          <div><label className="label">Email Address</label><input type="email" placeholder="john@umratransport.me" className="input" /></div>
          <div><label className="label">Role</label><select className="input">{(Object.keys(ROLE_LABELS) as UserRole[]).map((r) => (<option key={r} value={r}>{ROLE_LABELS[r]}</option>))}</select></div>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700">An invite email will be sent. The user will set their own password on first login.</div>
        </div>
      </AdminModal>

      {deleteUser && (
        <AdminModal open={!!deleteUser} onClose={() => setDeleteUser(null)} title="Remove User" footer={<><button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors" onClick={() => setDeleteUser(null)}>Cancel</button><button className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors" onClick={() => { setUsers((prev) => prev.filter((u) => u.id !== deleteUser.id)); setDeleteUser(null) }}>Remove</button></>}>
          <p className="text-sm text-slate-600">Are you sure you want to remove <strong>{deleteUser.name}</strong> ({deleteUser.email})? This action cannot be undone.</p>
        </AdminModal>
      )}
    </div>
  )
}
