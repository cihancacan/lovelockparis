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

  // On rafraîchit la session (Important pour que Supabase sache qui est là)
  const { data: { session } } = await supabase.auth.getSession();
  const path = req.nextUrl.pathname;

  // --- MODE "PORTES OUVERTES" (POUR TESTER LA PROD) ---
  // J'ai mis des // devant les protections pour les désactiver.

  // 1. Protection Admin
  // if (path.includes('/admin')) {
  //   if (!session) return NextResponse.redirect(new URL('/purchase', req.url));
  //   // On vérifie l'email en minuscules pour éviter les erreurs de majuscules
  //   if (session.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
  //      return NextResponse.redirect(new URL('/', req.url));
  //   }
  // }

  // 2. Protection Dashboard
  // if (path.includes('/dashboard')) {
  //   if (!session) return NextResponse.redirect(new URL('/purchase', req.url));
  // }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
