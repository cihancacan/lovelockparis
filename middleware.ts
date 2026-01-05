import createMiddleware from 'next-intl/middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_EMAIL = 'cacancihan@gmail.com';

// 1. Configurer les langues
const intlMiddleware = createMiddleware({
  locales: ['en', 'fr', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'as-needed'
});

export default async function middleware(req: NextRequest) {
  // 2. D'abord, on génère la réponse qui gère la langue
  const res = intlMiddleware(req);

  // 3. Ensuite, on branche Supabase sur CETTE réponse
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

  // 4. On récupère l'utilisateur
  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;

  // --- SÉCURITÉ ---

  // A. Protection ADMIN
  if (path.includes('/admin')) {
    // Si pas connecté OU email incorrect
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // B. Protection DASHBOARD
  if (path.includes('/dashboard')) {
    if (!user) {
      // Si pas connecté, on renvoie vers la page d'achat/login
      return NextResponse.redirect(new URL('/purchase', req.url));
    }
  }

  return res;
}

// C'est ici qu'il y avait le doublon : on ne garde que celui-ci
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
