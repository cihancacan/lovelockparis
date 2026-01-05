import createMiddleware from 'next-intl/middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
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
          cookiesToSet.forEach(({ name, value, options }) => {
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // IMPORTANT : On utilise getUser() qui valide vraiment le token côté serveur
  const { data: { user }, error } = await supabase.auth.getUser();
  
  const path = req.nextUrl.pathname;

  // --- DEBUGGING (Visible dans les logs Vercel) ---
  if (path.includes('/admin')) {
    console.log(`[Middleware] Tentative accès Admin`);
    console.log(`- User connecté : ${user ? 'OUI' : 'NON'}`);
    if (user) console.log(`- Email : ${user.email}`);
  }

  // --- SÉCURITÉ ---

  // A. Protection ADMIN
  if (path.includes('/admin')) {
    // 1. Si pas connecté
    if (!user) {
      console.log('[Middleware] Admin refusé : Pas connecté');
      return NextResponse.redirect(new URL('/purchase', req.url));
    }

    // 2. Vérification email
    const userEmail = user.email?.trim().toLowerCase();
    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();

    if (userEmail !== adminEmail) {
      console.log(`[Middleware] Admin refusé : ${userEmail} n'est pas l'admin`);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // B. Protection DASHBOARD
  if (path.includes('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/purchase', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
