// Auth types and user management (localStorage-based for pilot)
// Production: replace with a proper backend / JWT service

export type UserRole = 'super_admin' | 'viewer'
export type CompanyAccess = 'bt' | 'drukair' | 'all'

export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  role: UserRole
  companyAccess: CompanyAccess[]
  createdAt: string
  createdBy: string
  isActive: boolean
}

export interface Session {
  userId: string
  username: string
  role: UserRole
  companyAccess: CompanyAccess[]
}

const USERS_KEY = 'dhi_ia_users'
const SESSION_COOKIE = 'dhi_session'

// SHA-256 via Web Crypto API (available in all modern browsers + Node 18+)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// Seed super admin on first load (password: DHI@Admin2024)
export async function initializeUsers(): Promise<void> {
  if (typeof window === 'undefined') return
  const existing = localStorage.getItem(USERS_KEY)
  if (!existing) {
    const passwordHash = await hashPassword('DHI@Admin2024')
    const superAdmin: User = {
      id: 'sa-001',
      username: 'superadmin',
      email: 'admin@dhi.bt',
      passwordHash,
      role: 'super_admin',
      companyAccess: ['all'],
      createdAt: new Date().toISOString(),
      createdBy: 'system',
      isActive: true,
    }
    localStorage.setItem(USERS_KEY, JSON.stringify([superAdmin]))
  }
}

export function getUsers(): User[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]') as User[]
  } catch {
    return []
  }
}

export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export async function authenticateUser(
  username: string,
  password: string,
): Promise<User | null> {
  const hash = await hashPassword(password)
  const user = getUsers().find(
    u => u.username === username && u.passwordHash === hash && u.isActive,
  )
  return user ?? null
}

export function createSession(user: User): void {
  const session: Session = {
    userId: user.id,
    username: user.username,
    role: user.role,
    companyAccess: user.companyAccess,
  }
  const encoded = btoa(JSON.stringify(session))
  // SameSite=Strict; not HttpOnly so middleware + client can both read it (pilot only)
  document.cookie = `${SESSION_COOKIE}=${encoded}; path=/; SameSite=Strict; max-age=86400`
}

export function clearSession(): void {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`
}

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null
  const entry = document.cookie
    .split(';')
    .find(c => c.trim().startsWith(`${SESSION_COOKIE}=`))
  if (!entry) return null
  try {
    const value = entry.trim().slice(SESSION_COOKIE.length + 1)
    return JSON.parse(atob(value)) as Session
  } catch {
    return null
  }
}

export function canAccessCompany(
  session: Session,
  companyId: string,
): boolean {
  if (session.role === 'super_admin') return true
  return (
    session.companyAccess.includes('all') ||
    session.companyAccess.includes(companyId as CompanyAccess)
  )
}
