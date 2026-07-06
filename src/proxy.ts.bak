import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define public auth routes where authenticated users shouldn't go
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/signup') || path.startsWith('/forgot-password') || path.startsWith('/reset-password') || path.startsWith('/verify-otp');
  
  // Define protected routes
  const isProtectedRoute = path.startsWith('/dashboard') || path.startsWith('/checkout') || path.startsWith('/orders') || path.startsWith('/profile');

  const refreshToken = request.cookies.get('refreshToken')?.value;

  // If user is logged in and trying to access auth pages, redirect to dashboard
  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is not logged in and trying to access protected routes, redirect to login
  if (isProtectedRoute && !refreshToken) {
    const url = new URL('/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(request.url));
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/verify-otp',
    '/dashboard/:path*',
    '/checkout/:path*',
    '/orders/:path*',
    '/profile/:path*'
  ]
};
