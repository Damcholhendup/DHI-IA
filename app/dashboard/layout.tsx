'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.replace('/login')
    }
  }, [session, loading, router])

  if (loading || !session) {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center"
        style={{ background: '#060b18' }}
      >
        <div className="text-center">
          <div className="relative w-12 h-12 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-t-2 border-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-xs text-slate-600 uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
