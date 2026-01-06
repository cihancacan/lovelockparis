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
  // 1. Gestion des langues
  const res = intlMiddleware(req);

  // 2. Gestion de la session Supabase (nécessaire pour que le client reste connecté)
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

  // On rafraîchit simplement la session pour garder le cookie actif
  await supabase.auth.getSession();

  // ⚠️ SÉCURITÉ DÉSACTIVÉE ICI POUR ÉVITER LES BOUCLES
  // La sécurité sera gérée par chaque page individuellement (dashboard/page.tsx, admin/page.tsx)
  
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};
