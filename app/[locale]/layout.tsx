import { NextIntlClientProvider } from 'next-intl';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { Providers } from '@/lib/providers';
import '@/app/globals.css';
import { Metadata, Viewport } from 'next';
import Script from 'next/script';
import { CrispChat } from '@/components/crisp-chat';

const locales = ['en', 'fr', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'ar'];

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
});

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'sans-serif'],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const seoData: Record<string, { title: string; desc: string; keywords: string[] }> = {
  en: {
    title: 'Digital Love Lock Paris | Personalized Love Lock Experience',
    desc: 'Create a personalized digital Love Lock inspired by the Pont des Arts in Paris. Add your names, message and style, then revisit your lock online from anywhere.',
    keywords: ['digital love lock Paris', 'love lock Paris', 'Pont des Arts love lock', 'virtual love lock', 'romantic Paris gift'],
  },
  fr: {
    title: 'Cadenas d’Amour Numérique Paris | LoveLockParis',
    desc: 'Créez un cadenas d’amour numérique personnalisé inspiré du Pont des Arts à Paris. Ajoutez vos prénoms, votre message et votre style, puis retrouvez votre cadenas en ligne.',
    keywords: ['cadenas amour Paris', 'cadenas numérique Paris', 'Pont des Arts cadenas', 'cadeau romantique Paris'],
  },
  es: {
    title: 'Candado de Amor Digital París | LoveLockParis',
    desc: 'Crea un candado de amor digital personalizado inspirado en el Pont des Arts de París. Añade nombres, mensaje y estilo y vuelve a verlo online desde cualquier lugar.',
    keywords: ['candado de amor París', 'candado digital París', 'Pont des Arts', 'regalo romántico París'],
  },
  pt: {
    title: 'Cadeado do Amor Digital Paris | LoveLockParis',
    desc: 'Crie um cadeado do amor digital personalizado inspirado na Pont des Arts em Paris. Adicione nomes, mensagem e estilo e veja novamente online de qualquer lugar.',
    keywords: ['cadeado do amor Paris', 'cadeado digital Paris', 'Pont des Arts', 'presente romântico Paris'],
  },
  'zh-CN': {
    title: '巴黎数字爱情锁 | LoveLockParis',
    desc: '创建受巴黎艺术桥爱情锁传统启发的个性化数字爱情锁。添加名字、留言和样式，并可从世界任何地方再次查看。',
    keywords: ['巴黎爱情锁', '数字爱情锁', '艺术桥', '巴黎浪漫礼物'],
  },
  ja: {
    title: 'パリ デジタルラブロック | LoveLockParis',
    desc: 'パリのポンデザールに着想を得たデジタルラブロック。名前、メッセージ、スタイルをカスタマイズし、どこからでもオンラインで再訪できます。',
    keywords: ['パリ ラブロック', 'デジタル南京錠', 'ポンデザール', 'パリ ロマンチックギフト'],
  },
  ko: {
    title: '파리 디지털 러브락 | LoveLockParis',
    desc: '파리 퐁데자르의 러브락 전통에서 영감을 받은 맞춤형 디지털 러브락을 만들고 어디서든 온라인으로 다시 확인하세요.',
    keywords: ['파리 러브락', '디지털 사랑의 자물쇠', '퐁데자르', '파리 로맨틱 선물'],
  },
  ar: {
    title: 'قفل حب رقمي باريس | LoveLockParis',
    desc: 'أنشئ قفل حب رقميًا مخصصًا مستوحى من جسر الفنون في باريس، وأضف الاسمين والرسالة والتصميم ثم عد إليه عبر الإنترنت من أي مكان.',
    keywords: ['قفل الحب باريس', 'قفل حب رقمي', 'جسر الفنون', 'هدية رومانسية باريس'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const t = seoData[locale] || seoData.en;
  const baseUrl = 'https://lovelockparis.com';
  const canonicalPath = locale === 'en' ? '' : `/${locale}`;

  return {
    title: t.title,
    description: t.desc,
    applicationName: 'LoveLockParis',
    authors: [{ name: 'PANORAMA GRUP', url: 'https://panoramagrup.com' }],
    creator: 'LoveLockParis',
    publisher: 'PANORAMA GRUP',
    keywords: t.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `${baseUrl}${canonicalPath || '/'}`,
      languages: {
        'x-default': baseUrl,
        en: baseUrl,
        fr: `${baseUrl}/fr`,
        'zh-CN': `${baseUrl}/zh-CN`,
        ja: `${baseUrl}/ja`,
        ko: `${baseUrl}/ko`,
        es: `${baseUrl}/es`,
        pt: `${baseUrl}/pt`,
        ar: `${baseUrl}/ar`,
      },
    },
    openGraph: {
      title: t.title,
      description: t.desc,
      url: `${baseUrl}${canonicalPath || '/'}`,
      siteName: 'LoveLockParis',
      locale,
      type: 'website',
      images: [{
        url: `${baseUrl}/images/og-image-2026.jpg`,
        width: 1200,
        height: 630,
        alt: 'LoveLockParis digital Love Lock experience in Paris',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.desc,
      images: [`${baseUrl}/images/twitter-card-2026.jpg`],
    },
    category: 'Travel & Romantic Experiences',
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const locale = locales.includes(params.locale) ? params.locale : 'en';
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = seoData[locale] || seoData.en;

  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch {
    messages = (await import('@/messages/en.json')).default;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://lovelockparis.com/#organization',
        name: 'LoveLockParis',
        legalName: 'PANORAMA GRUP',
        url: 'https://lovelockparis.com',
        logo: 'https://lovelockparis.com/logo-2026.png',
        description: t.desc,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'support@lovelockparis.com',
          availableLanguage: ['English', 'French', 'Spanish', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic'],
        },
      },
      {
        '@type': 'Product',
        '@id': 'https://lovelockparis.com/#love-lock',
        name: 'Personalized Digital Love Lock',
        description: t.desc,
        image: 'https://lovelockparis.com/images/skin-iron.png',
        brand: { '@type': 'Brand', name: 'LoveLockParis' },
        offers: {
          '@type': 'Offer',
          price: '29.99',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: locale === 'en'
            ? 'https://lovelockparis.com/purchase'
            : `https://lovelockparis.com/${locale}/purchase`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': 'https://lovelockparis.com/#website',
        url: 'https://lovelockparis.com',
        name: 'LoveLockParis',
        description: t.desc,
        publisher: { '@id': 'https://lovelockparis.com/#organization' },
        inLanguage: locale,
      },
    ],
  };

  return (
    <html lang={locale} dir={dir} className={`${playfair.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className="bg-white text-slate-900 font-sans antialiased selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>

        <Script src="https://www.googletagmanager.com/gtag/js?id=AW-17850760368" strategy="afterInteractive" />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17850760368');
          `}
        </Script>
        <CrispChat />
      </body>
    </html>
  );
}
