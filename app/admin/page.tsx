'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  getUsers,
  saveUsers,
  hashPassword,
  type User,
  type UserRole,
  type CompanyAccess,
} from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

type NewUserForm = {
  username: string
  email: string
  password: string
  confirmPassword: string
  companyAccess: CompanyAccess[]
}

const BLANK_FORM: NewUserForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  companyAccess: [],
}

const ACCESS_OPTIONS: { value: CompanyAccess; label: string; color: string }[] = [
  { value: 'bt', label: 'Bhutan Telecom', color: '#00e676' },
  { value: 'drukair', label: 'Drukair Corporation', color: '#ffab00' },
  { value: 'all', label: 'All Companies', color: '#00e5ff' },
]

export default function AdminPage() {
  const { session, logout } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState<NewUserForm>(BLANK_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)

  const loadUsers = useCallback(() => setUsers(getUsers()), [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault()
    setFormError('')

    if (form.companyAccess.length === 0) {
      setFormError('Select at least one company access.')
      return
    }
    if (form.password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    const existing = getUsers()
    if (existing.some(u => u.username === form.username.trim())) {
      setFormError('Username already exists.')
      return
    }

    setSaving(true)
    try {
      const passwordHash = await hashPassword(form.password)
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: form.username.trim(),
        email: form.email.trim(),
        passwordHash,
        role: 'viewer' as UserRole,
        companyAccess: form.companyAccess,
        createdAt: new Date().toISOString(),
        createdBy: session?.username ?? 'superadmin',
        isActive: true,
      }
      saveUsers([...existing, newUser])
      loadUsers()
      setShowModal(false)
      setForm(BLANK_FORM)
      showToast(`User "${newUser.username}" created successfully.`)
    } finally {
      setSaving(false)
    }
  }

  function toggleActive(userId: string) {
    const updated = getUsers().map(u =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u,
    )
    saveUsers(updated)
    loadUsers()
    const u = updated.find(x => x.id === userId)
    showToast(`User "${u?.username}" ${u?.isActive ? 'activated' : 'deactivated'}.`)
  }

  function deleteUser(userId: string) {
    const target = getUsers().find(u => u.id === userId)
    if (!target || target.role === 'super_admin') return
    if (!window.confirm(`Delete user "${target.username}"? This cannot be undone.`)) return
    saveUsers(getUsers().filter(u => u.id !== userId))
    loadUsers()
    showToast(`User "${target.username}" deleted.`)
  }

  function toggleAccess(val: CompanyAccess) {
    setForm(f => {
      if (val === 'all') return { ...f, companyAccess: ['all'] }
      const without = f.companyAccess.filter(v => v !== 'all' && v !== val)
      const added = f.companyAccess.includes(val) ? without : [...without, val]
      return { ...f, companyAccess: added }
    })
  }

  return (
    <div className="min-h-screen" style={{ background: '#060b18' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 h-14 border-b border-[#1a2744]"
        style={{ background: 'rgba(6,11,24,0.9)', backdropFilter: 'blur(20px)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="w-px h-5 bg-[#1a2744]" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">User Management</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:block">{session?.username}</span>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Sign out"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Title row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-bold text-white">Users</h1>
            <p className="text-xs text-slate-500 mt-0.5">{users.length} account{users.length !== 1 ? 's' : ''} registered</p>
          </div>
          <button
            onClick={() => { setShowModal(true); setForm(BLANK_FORM); setFormError('') }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #00c8e0, #0062cc)',
              boxShadow: '0 0 16px rgba(0,229,255,0.2)',
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Create User
          </button>
        </div>

        {/* Users table */}
        <div className="rounded-2xl border border-[#1a2744] overflow-hidden" style={{ background: 'rgba(12,20,37,0.7)' }}>
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1.2fr_1fr_1.5fr_80px_100px] gap-4 px-5 py-3 border-b border-[#1a2744]">
            {['Username', 'Email', 'Role', 'Company Access', 'Status', 'Actions'].map(h => (
              <span key={h} className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{h}</span>
            ))}
          </div>

          {users.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-600">No users found.</div>
          )}

          {users.map((user, i) => (
            <div
              key={user.id}
              className={`grid grid-cols-[1fr_1.2fr_1fr_1.5fr_80px_100px] gap-4 px-5 py-4 items-center ${
                i !== users.length - 1 ? 'border-b border-[#1a2744]' : ''
              } ${!user.isActive ? 'opacity-50' : ''}`}
            >
              {/* Username */}
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {user.username.slice(0, 2).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-slate-200 truncate">{user.username}</span>
              </div>

              {/* Email */}
              <span className="text-xs text-slate-500 truncate">{user.email}</span>

              {/* Role */}
              <span
                className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full w-fit"
                style={
                  user.role === 'super_admin'
                    ? { background: 'rgba(213,0,249,0.12)', color: '#d500f9' }
                    : { background: 'rgba(0,229,255,0.08)', color: '#00e5ff' }
                }
              >
                {user.role === 'super_admin' ? 'Super Admin' : 'Viewer'}
              </span>

              {/* Company access */}
              <div className="flex flex-wrap gap-1">
                {(user.companyAccess.includes('all') ? ['bt', 'drukair'] : user.companyAccess).map(c => {
                  const opt = ACCESS_OPTIONS.find(o => o.value === c || (user.companyAccess.includes('all') && o.value === c))
                  const color = c === 'bt' ? '#00e676' : c === 'drukair' ? '#ffab00' : '#00e5ff'
                  const label = c === 'bt' ? 'BT' : c === 'drukair' ? 'Drukair' : 'All'
                  return (
                    <span
                      key={c}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                      style={{ background: `${color}15`, color }}
                    >
                      {label}
                    </span>
                  )
                })}
                {user.role === 'super_admin' && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(213,0,249,0.1)', color: '#d500f9' }}>
                    All
                  </span>
                )}
              </div>

              {/* Status */}
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-full w-fit ${
                  user.isActive
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-slate-500/10 text-slate-500'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-slate-600'}`} />
                {user.isActive ? 'Active' : 'Inactive'}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-1">
                {user.role !== 'super_admin' && (
                  <>
                    <button
                      onClick={() => toggleActive(user.id)}
                      title={user.isActive ? 'Deactivate' : 'Activate'}
                      className="p-1.5 rounded-md text-slate-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                    >
                      {user.isActive ? (
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <rect x="1" y="5" width="22" height="14" rx="7" /><circle cx="8" cy="12" r="3" fill="currentColor" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                          <rect x="1" y="5" width="22" height="14" rx="7" /><circle cx="16" cy="12" r="3" fill="currentColor" />
                        </svg>
                      )}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      title="Delete user"
                      className="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* ── Create User Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(6,11,24,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setShowModal(false)}
          />

          {/* Modal card */}
          <div
            className="relative w-full max-w-md rounded-2xl border border-[#1a2744] p-6 z-10"
            style={{ background: '#0c1425' }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-white">Create New User</h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Role: Viewer — access to selected companies</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-md text-slate-600 hover:text-slate-300 hover:bg-[#1a2744] transition-all"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  required
                  placeholder="e.g. john.doe"
                  className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600 border border-[#1a2744] focus:outline-none focus:border-cyan-500/60 transition-all"
                  style={{ background: '#060b18' }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                  placeholder="john@dhi.bt"
                  className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600 border border-[#1a2744] focus:outline-none focus:border-cyan-500/60 transition-all"
                  style={{ background: '#060b18' }}
                />
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                    placeholder="Min. 8 characters"
                    className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600 border border-[#1a2744] focus:outline-none focus:border-cyan-500/60 transition-all"
                    style={{ background: '#060b18' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">Confirm</label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))}
                    required
                    placeholder="Repeat password"
                    className="w-full px-3 py-2 rounded-lg text-sm text-slate-200 placeholder-slate-600 border border-[#1a2744] focus:outline-none focus:border-cyan-500/60 transition-all"
                    style={{ background: '#060b18' }}
                  />
                </div>
              </div>

              {/* Company access */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">Company Access</label>
                <div className="flex flex-wrap gap-2">
                  {ACCESS_OPTIONS.map(opt => {
                    const selected = form.companyAccess.includes(opt.value)
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => toggleAccess(opt.value)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                        style={
                          selected
                            ? { background: `${opt.color}18`, color: opt.color, borderColor: `${opt.color}40` }
                            : { background: 'transparent', color: '#475569', borderColor: '#1a2744' }
                        }
                      >
                        {selected && (
                          <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Error */}
              {formError && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <svg width="13" height="13" fill="none" stroke="#ef4444" viewBox="0 0 24 24" strokeWidth="2" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span className="text-xs text-red-400">{formError}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-slate-400 border border-[#1a2744] hover:border-slate-500 hover:text-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #00c8e0, #0062cc)',
                    boxShadow: '0 0 16px rgba(0,229,255,0.2)',
                  }}
                >
                  {saving ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl border text-xs font-medium shadow-xl transition-all ${
            toast.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}
        >
          {toast.type === 'success' ? (
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          )}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
