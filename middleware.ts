import createMiddleware from 'next-intl/middleware';
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_EMAIL = 'cacancihan@gmail.com';

const intlMiddleware = createMiddleware({
  locales: ['en', 'fr', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export default async function middleware(req: NextRequest) {
  const res = intlMiddleware(req);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.get('Cookie') ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // Protection Admin (Porte fermée sauf pour toi)
  if (path.includes('/admin')) {
    if (!session) return NextResponse.redirect(new URL('/purchase', req.url));
    if (session.user.email !== ADMIN_EMAIL) return NextResponse.redirect(new URL('/', req.url));
  }

  // Protection Dashboard (Porte fermée sauf si connecté)
  if (path.includes('/dashboard')) {
    if (!session) return NextResponse.redirect(new URL('/purchase', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};