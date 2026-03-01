import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value;

    // Define public paths that don't require authentication
    const publicPaths = ['/auth', '/api/auth', '/unauthorized'];
    const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

    // Allow static assets and Next.js internals
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/favicon') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Allow public paths
    if (isPublicPath) {
        // If user is already logged in and tries to access login, redirect to dashboard
        if (token && pathname.startsWith('/auth')) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
        return NextResponse.next();
    }

    // Protect dashboard and other routes
    if (!token && pathname.startsWith('/dashboard')) {
        const loginUrl = new URL('/auth/v1/login', request.url);
        loginUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api routes (except /api/auth)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         */
        '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico).*)',
    ],
};
