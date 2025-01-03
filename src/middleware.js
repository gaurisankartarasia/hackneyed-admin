// middleware.js - Edge compatible
import { NextResponse } from 'next/server';

export async function middleware(request) {
  // Get session token from cookie
  const session = request.cookies.get('session')?.value;
  
  // Skip middleware for public routes
  if (request.nextUrl.pathname.startsWith('/_next')) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith('/api/auth')) return NextResponse.next();
  
  const isAuthPage = request.nextUrl.pathname === '/signin';
  
  // Redirect logic based on session existence
  if (!session && !isAuthPage) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
  
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)']
};
