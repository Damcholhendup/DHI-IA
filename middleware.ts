import { NextRequest, NextResponse } from 'next/server'

function parseSession(cookie: string | undefined): { role?: string } | null {
  if (!cookie) return null
  try {
    return JSON.parse(Buffer.from(cookie, 'base64').toString('utf-8'))
  } catch {
    return null
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = parseSession(req.cookies.get('dhi_session')?.value)

  // Already logged in → skip public pages
  if ((pathname === '/' || pathname === '/login') && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Dashboard requires a session
  if (pathname.startsWith('/dashboard') && !session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Admin requires super_admin role
  if (pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    if (session.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|images).*)'],
}
