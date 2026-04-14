'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authenticateUser, createSession, getSession } from '../lib/auth'
import { useAuth } from '../contexts/AuthContext'

import Image from 'next/image'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { refreshSession } = useAuth()

  // Redirect if already logged in
  useEffect(() => {
    if (getSession()) router.replace('/dashboard')
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await authenticateUser(username.trim(), password)
      if (!user) {
        setError('Invalid username or password.')
        setLoading(false)
        return
      }
      createSession(user)
      refreshSession()
      router.push('/dashboard')
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: '#060b18' }}
    >
      {/* Ambient background glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 20% 50%, rgba(0,229,255,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 80% 50%, rgba(100,60,255,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,229,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Card */}
      <div className="relative w-full max-w-sm mx-4 z-10">
        {/* Logo + title */}
        <div className="text-center mb-8">
          <Image
            src="/images/logos/DHI.webp"
            alt="DHI Logo"
            width={56}
            height={56}
            className="rounded-2xl mx-auto mb-4 shadow-lg shadow-cyan-500/10"
          />
          <h1 className="text-xl font-bold text-white tracking-tight">DHI Data Lake</h1>
          <p className="text-xs text-slate-500 mt-1 tracking-widest uppercase">Intelligence Platform</p>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl border border-[#1a2744] p-8"
          style={{ background: 'rgba(12,20,37,0.9)', backdropFilter: 'blur(20px)' }}
        >
          <h2 className="text-sm font-semibold text-white mb-1">Sign in to your account</h2>
          <p className="text-xs text-slate-500 mb-6">Enter your credentials to access the platform.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoComplete="username"
                required
                placeholder="e.g. superadmin"
                className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-200 placeholder-slate-600 border border-[#1a2744] focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                style={{ background: '#060b18' }}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 rounded-lg text-sm text-slate-200 placeholder-slate-600 border border-[#1a2744] focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                  style={{ background: '#060b18' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <svg width="14" height="14" fill="none" stroke="#ef4444" viewBox="0 0 24 24" strokeWidth="2" className="flex-shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="text-xs text-red-400">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: loading
                  ? 'rgba(0,229,255,0.2)'
                  : 'linear-gradient(135deg, #00c8e0, #0062cc)',
                boxShadow: loading ? 'none' : '0 0 20px rgba(0,229,255,0.2)',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-700 mt-6">
          Druk Holding &amp; Investments · DHI Data Lake
        </p>
      </div>
    </div>
  )
}
