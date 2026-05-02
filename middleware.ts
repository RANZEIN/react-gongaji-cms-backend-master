import { NextResponse, type NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/utils/constants';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    const isAuthRoute = pathname.startsWith('/auth');
    const isStaticAsset = pathname.startsWith('/_next') || pathname.startsWith('/themes') || pathname.startsWith('/layout') || pathname.startsWith('/demo') || pathname === '/favicon.ico' || /\.[a-zA-Z0-9]+$/.test(pathname);

    if (isStaticAsset) {
        return NextResponse.next();
    }

    if (!token && !isAuthRoute) {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    if (isAuthRoute && token && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api).*)']
};
