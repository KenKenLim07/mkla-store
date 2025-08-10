import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isOrdersRoute = pathname === '/orders'

  // Require auth for protected routes
  if ((isAdminRoute || isOrdersRoute) && !session) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }



  return res
}

export const config = {
  matcher: ['/orders', '/admin/:path*'],
} 