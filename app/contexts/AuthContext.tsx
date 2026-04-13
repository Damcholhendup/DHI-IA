'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import {
  Session,
  getSession,
  clearSession,
  initializeUsers,
} from '../lib/auth'

interface AuthContextType {
  session: Session | null
  loading: boolean
  logout: () => void
  refreshSession: () => void
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  logout: () => {},
  refreshSession: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    initializeUsers().then(() => {
      setSession(getSession())
      setLoading(false)
    })
  }, [])

  function logout() {
    clearSession()
    setSession(null)
    router.push('/login')
  }

  function refreshSession() {
    setSession(getSession())
  }

  return (
    <AuthContext.Provider value={{ session, loading, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
