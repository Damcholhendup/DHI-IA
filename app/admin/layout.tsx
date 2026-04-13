'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../contexts/AuthContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!session) router.replace('/login')
      else if (session.role !== 'super_admin') router.replace('/dashboard')
    }
  }, [session, loading, router])

  if (loading || !session || session.role !== 'super_admin') {
    return (
      <div
        className="h-screen w-screen flex items-center justify-center"
        style={{ background: '#060b18' }}
      >
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
        </div>
      </div>
    )
  }

  return <>{children}</>
}
