import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow all non-admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow login page
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // Allow all admin routes - auth handled client-side
  // Database RLS policies enforce admin-only writes
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
