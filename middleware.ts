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
  // 2. D'abord, on génère la réponse qui gère la langue (ex: redirection vers /en)
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
            // On écrit les cookies sur la demande ET la réponse pour que ça soit immédiat
            req.cookies.set(name, value);
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // 4. On récupère l'utilisateur (getUser est plus sûr que getSession pour le middleware)
  const { data: { user } } = await supabase.auth.getUser();

  const path = req.nextUrl.pathname;

  // --- SÉCURITÉ ---

  // A. Protection ADMIN
  if (path.includes('/admin')) {
    // Si pas connecté OU email incorrect
    if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      // On redirige vers l'accueil (en gardant la langue actuelle si possible)
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

  // C. Gestion de la page LOGIN (Si on est déjà connecté, on ne retourne pas sur le login)
  // (Optionnel, mais améliore l'expérience)
  if (path.includes('/purchase') && !path.includes('/success') && user) {
    // Si l'utilisateur va sur /purchase alors qu'il est déjà connecté, on le met au Dashboard
    // return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 5. On renvoie la réponse finale (qui contient la langue + les cookies mis à jour)
  return res;
}

export const config = {
  // On exclut les fichiers statiques, les images, l'API et les fichiers systèmes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
};

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
