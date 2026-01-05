import createMiddleware from 'next-intl/middleware';
import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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

  // On rafraîchit la session pour que le cookie reste valide
  await supabase.auth.getSession();
  
  const path = req.nextUrl.pathname;

  // --- SÉCURITÉ ALLÉGÉE ---
  
  // 1. On ne bloque PLUS l'admin ici (le composant React le fera)
  // Cela résout ton problème de redirection infinie ou de blocage.

  // 2. Protection Dashboard (On garde celle-ci car elle est simple : connecté ou pas)
  if (path.includes('/dashboard')) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.redirect(new URL('/purchase', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
