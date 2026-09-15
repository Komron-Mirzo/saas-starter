import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth/session';

// Only run middleware on paths that actually need protection
export const config = {
  matcher: ['/dashboard/:path*'],
};

export async function middleware(request: NextRequest) {
  // --- HTTP BASIC AUTH PROTECTION ---
  const basicAuth = request.headers.get('authorization');
  
  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    if (user !== 'worthfit777' || pwd !== 'worthfit777') {
      return unauthorizedResponse();
    }
  } else {
    return unauthorizedResponse();
  }
  // ----------------------------------

  const sessionCookie = request.cookies.get('session');

  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  try {
    // Just verify the token exists and is valid without rewriting it on every GET
    await verifyToken(sessionCookie.value);
    return NextResponse.next();
  } catch (error) {
    console.error('Session verification failed:', error);
    const response = NextResponse.redirect(new URL('/sign-in', request.url));
    response.cookies.delete('session');
    return response;
  }
}

function unauthorizedResponse() {
  return new NextResponse('Auth required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}