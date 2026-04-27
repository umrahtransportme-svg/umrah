'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, Mail, Phone, CheckCircle, XCircle, Save } from 'lucide-react'
import AdminModal from '@/components/admin/ui/Modal'
import { cn } from '@/lib/utils'
import { formatDateTime, ROLE_COLORS, ROLE_LABELS } from '@/lib/admin/utils'
import type { AdminUser, UserRole } from '@/lib/admin/types'
import { useAdminStore } from '@/lib/admin/store'

const BLANK: Omit<AdminUser, 'id' | 'createdAt'> = {
  name: '', email: '', role: 'staff', phone: '', isActive: true,
}

export default function AdminUsersPage() {
  const { users, addUser, updateUser, deleteUser } = useAdminStore()
  const [modal, setModal] = useState<'invite' | 'edit' | 'delete' | null>(null)
  const [selected, setSelected] = useState<AdminUser | null>(null)
  const [form, setForm] = useState<Omit<AdminUser, 'id' | 'createdAt'>>(BLANK)

  function openInvite() { setForm(BLANK); setModal('invite') }
  function openEdit(u: AdminUser) { setForm(u); setSelected(u); setModal('edit') }
  function openDelete(u: AdminUser) { setSelected(u); setModal('delete') }
  function close() { setModal(null); setSelected(null) }

  function save() {
    if (modal === 'invite') addUser(form)
    else if (modal === 'edit' && selected) updateUser(selected.id, form)
    close()
  }

  function F({ label, children }: { label: string; children: React.ReactNode }) {
    return <div><label className="label">{label}</label>{children}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{users.length} admin users</p>
        <button onClick={openInvite} className="inline-flex items-center gap-1 px-3 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
          <Plus className="w-3.5 h-3.5" /> Invite User
        </button>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr>
              <th className="table-th">User</th>
              <th className="table-th hidden md:table-cell">Contact</th>
              <th className="table-th">Role</th>
              <th className="table-th hidden lg:table-cell">Last Login</th>
              <th className="table-th">Status</th>
              <th className="table-th text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => {
              const rc = ROLE_COLORS[user.role]
              return (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="table-td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">{user.name[0]}</div>
                      <div>
                        <div className="font-medium text-slate-900 text-xs">{user.name}</div>
                        <div className="text-xs text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-td hidden md:table-cell">
                    {user.phone && <div className="flex items-center gap-1 text-xs text-slate-500"><Phone className="w-3 h-3" />{user.phone}</div>}
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5"><Mail className="w-3 h-3" />{user.email}</div>
                  </td>
                  <td className="table-td"><span className={cn('badge text-xs', rc.bg, rc.text)}>{ROLE_LABELS[user.role]}</span></td>
                  <td className="table-td hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}</span>
                  </td>
                  <td className="table-td">
                    <button onClick={() => updateUser(user.id, { isActive: !user.isActive })}
                      className={cn('flex items-center gap-1 text-xs font-medium transition-colors', user.isActive ? 'text-green-600 hover:text-green-700' : 'text-slate-400 hover:text-slate-600')}>
                      {user.isActive
                        ? <><CheckCircle className="w-3.5 h-3.5" /> Active</>
                        : <><XCircle className="w-3.5 h-3.5" /> Inactive</>}
                    </button>
                  </td>
                  <td className="table-td">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(user)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => openDelete(user)} className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Invite / Edit modal */}
      {(modal === 'invite' || modal === 'edit') && (
        <AdminModal open onClose={close}
          title={modal === 'invite' ? 'Invite New User' : `Edit — ${selected?.name}`}
          size="md"
          footer={<>
            <button onClick={close} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium rounded-lg transition-colors">
              <Save className="w-3.5 h-3.5" />{modal === 'invite' ? 'Send Invite' : 'Save Changes'}
            </button>
          </>}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <F label="Full Name"><input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input text-sm" placeholder="Jane Smith" /></F>
              <F label="Email Address"><input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="input text-sm" placeholder="jane@umratransport.me" /></F>
              <F label="Phone (optional)"><input type="text" value={form.phone || ''} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input text-sm" /></F>
              <F label="Role">
                <select value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserRole }))} className="input text-sm">
                  {(['super_admin', 'admin', 'vendor', 'staff'] as UserRole[]).map((r) => (
                    <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </F>
            </div>
            <F label="Active">
              <button onClick={() => setForm((f) => ({ ...f, isActive: !f.isActive }))}
                className={cn('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors mt-1', form.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500')}>
                {form.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {form.isActive ? 'Active' : 'Inactive'}
              </button>
            </F>
          </div>
        </AdminModal>
      )}

      {/* Delete confirm */}
      {modal === 'delete' && selected && (
        <AdminModal open onClose={close} title="Remove User" size="sm"
          footer={<>
            <button onClick={close} className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-medium rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={() => { deleteUser(selected.id); close() }} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors">Remove</button>
          </>}>
          <p className="text-sm text-slate-600">Remove <strong>{selected.name}</strong> from admin access? They will no longer be able to log in.</p>
        </AdminModal>
      )}
    </div>
  )
}
