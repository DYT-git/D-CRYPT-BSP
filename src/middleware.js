import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Allow login page and public assets
  if (pathname === '/admin/login' || pathname === '/api/admin/login' || pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Check for admin session cookie
  const token = request.cookies.get('admin_token')?.value || request.cookies.get('admin_session')?.value;

  if (!token) {
    // If it's an API call, return 401 JSON
    if (pathname.startsWith('/api/admin')) {
      return NextResponse.json({ error: 'Unauthorized: Admin authentication required' }, { status: 401 });
    }

    // If it's a page visit, redirect to /admin/login
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
