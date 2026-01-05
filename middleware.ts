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

  // REVENIR À getSession (Plus rapide et stable que getUser pour le middleware)
  const { data: { session } } = await supabase.auth.getSession();
  
  const path = req.nextUrl.pathname;

  // --- SÉCURITÉ ---

  // A. Protection ADMIN
  if (path.includes('/admin')) {
    // 1. Si pas connecté du tout -> Redirection vers Login
    if (!session) {
      return NextResponse.redirect(new URL('/purchase', req.url));
    }

    // 2. Vérification email (Nettoyage majuscules/espaces pour éviter les bugs)
    const userEmail = session.user.email?.trim().toLowerCase();
    const adminEmail = ADMIN_EMAIL.trim().toLowerCase();

    // Si l'email ne correspond pas -> Redirection vers Accueil
    if (userEmail !== adminEmail) {
      console.log(`[Middleware] Accès refusé à ${userEmail} (Attendu: ${adminEmail})`);
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // B. Protection DASHBOARD
  if (path.includes('/dashboard')) {
    if (!session) {
      return NextResponse.redirect(new URL('/purchase', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
// C'est la SEULE et UNIQUE configuration à garder à la fin
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
