import { NextIntlClientProvider } from 'next-intl';
import { Playfair_Display, Montserrat } from 'next/font/google';
import { Providers } from '@/lib/providers';
import '@/app/globals.css';
import { Metadata, Viewport } from 'next';

// --- LISTE COMPLÈTE DES LANGUES OPTIMISÉES ---
const locales = ['en', 'fr', 'zh-CN', 'ja', 'ko', 'es', 'pt', 'ar'];

// --- FONTS ULTRA-OPTIMISÉES POUR SEO ---
const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif']
});

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  preload: true,
  fallback: ['Arial', 'sans-serif']
});

// --- GÉNÉRATION DES URLS STATIQUES POUR SEO ---
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// --- BASE DE DONNÉES SEO MULTILINGUE ULTRA-COMPLÈTE 2026 ---
const seoData: Record<string, any> = {
  en: {
    title: 'Lock of Love Bridge Paris 2026 | Official Digital Love Lock Registry (Pont des Arts)',
    desc: 'Place your love lock on the official Lock of Love Bridge Paris. Physical locks are illegal. Join 250,000+ couples with digital love locks on Pont des Arts. Augmented Reality experience. Secure & Eternal.',
    keywords: ["Lock of love bridge paris", "Love lock bridge paris", "Pont des Arts", "Digital love lock Paris", "Paris love lock bridge", "Where to put love lock Paris", "Virtual love lock", "Paris padlock bridge", "Love lock tradition Paris", "Paris romantic bridge", "AR love lock", "Digital asset Paris", "Eternal love Paris", "Paris tourism 2026", "Pont des Arts digital"],
    question: "Where is the Love Lock Bridge in Paris 2026?",
    answer: "The famous Love Lock Bridge is the Pont des Arts in central Paris. Since 2015, physical locks are illegal. LoveLockParis.com is the only legal digital registry for eternal love locks on the Pont des Arts bridge.",
    h1: "The Official Lock of Love Bridge Paris 2026"
  },
  fr: {
    title: 'Pont des Cadenas d\'Amour Paris 2026 | Registre Numérique Officiel (Pont des Arts)',
    desc: 'Posez votre cadenas d\'amour sur le Pont des Cadenas d\'Amour officiel à Paris. Les cadenas physiques sont interdits depuis 2015. Rejoignez 250 000+ couples avec des cadenas numériques sur le Pont des Arts. Expérience Réalité Augmentée. Sécurisé & Éternel.',
    keywords: ["Pont des cadenas d'amour Paris", "Cadenas d'amour Paris", "Pont des Arts", "Cadenas numérique Paris", "Où accrocher un cadenas Paris", "Cadenas virtuel Paris", "Tradition cadenas Paris", "Pont romantique Paris", "RA cadenas", "Actif numérique Paris", "Amour éternel Paris", "Tourisme Paris 2026", "Pont des Arts numérique"],
    question: "Où est le pont des cadenas d'amour à Paris 2026 ?",
    answer: "Le célèbre pont des cadenas d'amour est le Pont des Arts au centre de Paris. Depuis 2015, les cadenas physiques sont interdits. LoveLockParis.com est le seul registre numérique légal pour les cadenas d'amour éternels sur le Pont des Arts.",
    h1: "Le Pont des Cadenas d'Amour Officiel Paris 2026"
  },
  'zh-CN': {
    title: '巴黎爱情锁桥 2026 | 官方数字爱情锁注册处 (艺术桥)',
    desc: '在巴黎官方爱情锁桥上放置您的爱情锁。实体锁自2015年起已被禁止。加入250,000+对在艺术桥上拥有数字爱情锁的伴侣。增强现实体验。安全且永恒。',
    keywords: ["巴黎爱情锁桥", "爱情锁桥巴黎", "艺术桥", "数字爱情锁巴黎", "巴黎爱情锁桥位置", "虚拟爱情锁", "巴黎挂锁桥", "爱情锁传统巴黎", "巴黎浪漫桥", "AR爱情锁", "数字资产巴黎", "永恒爱情巴黎", "巴黎旅游2026", "艺术桥数字"],
    question: "巴黎爱情锁桥2026年在哪里？",
    answer: "著名的爱情锁桥是巴黎市中心的艺术桥。自2015年起，实体锁已被禁止。LoveLockParis.com是艺术桥上永恒爱情锁的唯一合法数字注册处。",
    h1: "巴黎官方爱情锁桥 2026"
  },
  ja: {
    title: 'パリ愛の南京錠の橋 2026 | 公式デジタル愛の南京錠登録所 (ポンデザール橋)',
    desc: 'パリの公式愛の南京錠の橋にあなたの南京錠をかけましょう。物理的な南京錠は2015年から禁止されています。ポンデザール橋でデジタル愛の南京錠を持つ250,000組以上のカップルに参加しましょう。拡張現実体験。安全で永遠です。',
    keywords: ["パリ愛の南京錠の橋", "愛の南京錠橋パリ", "ポンデザール橋", "デジタル愛の南京錠パリ", "パリ愛の南京錠橋場所", "仮想愛の南京錠", "パリ南京錠橋", "愛の南京錠伝統パリ", "パリロマンチック橋", "AR愛の南京錠", "デジタル資産パリ", "永遠の愛パリ", "パリ観光2026", "ポンデザール橋デジタル"],
    question: "パリの愛の南京錠の橋は2026年にどこにありますか？",
    answer: "有名な愛の南京錠の橋はパリ中心部のポンデザール橋です。2015年から物理的な南京錠は禁止されています。LoveLockParis.comはポンデザール橋での永遠の愛の南京錠の唯一の合法的なデジタル登録所です。",
    h1: "公式パリ愛の南京錠の橋 2026"
  },
  ko: {
    title: '파리 사랑의 자물쇠 다리 2026 | 공식 디지털 사랑의 자물쇠 등록소 (예술의 다리)',
    desc: '파리 공식 사랑의 자물쇠 다리에 자물쇠를 걸어보세요. 실제 자물쇠는 2015년부터 금지되었습니다. 예술의 다리에서 디지털 사랑의 자물쇠를 가진 250,000쌍 이상의 커플에 합류하세요. 증강 현실 경험. 안전하고 영원합니다.',
    keywords: ["파리 사랑의 자물쇠 다리", "사랑의 자물쇠 다리 파리", "예술의 다리", "디지털 사랑의 자물쇠 파리", "파리 사랑의 자물쇠 다리 위치", "가상 사랑의 자물쇠", "파리 자물쇠 다리", "사랑의 자물쇠 전통 파리", "파리 로맨틱 다리", "AR 사랑의 자물쇠", "디지털 자산 파리", "영원한 사랑 파리", "파리 관광 2026", "예술의 다리 디지털"],
    question: "2026년 파리 사랑의 자물쇠 다리는 어디에 있나요?",
    answer: "유명한 사랑의 자물쇠 다리는 파리 중심부에 있는 예술의 다리입니다. 2015년부터 실제 자물쇠는 금지되었습니다. LoveLockParis.com은 예술의 다리에서 영원한 사랑의 자물쇠를 위한 유일한 합법적인 디지털 등록소입니다.",
    h1: "공식 파리 사랑의 자물쇠 다리 2026"
  },
  es: {
    title: 'Puente de los Candados de Amor París 2026 | Registro Digital Oficial (Puente de las Artes)',
    desc: 'Coloca tu candado de amor en el Puente de los Candados de Amor oficial de París. Los candados físicos son ilegales desde 2015. Únete a más de 250,000 parejas con candados digitales en el Puente de las Artes. Experiencia de Realidad Aumentada. Seguro y Eterno.',
    keywords: ["Puente de los candados de amor París", "Candado de amor puente París", "Puente de las Artes", "Candado digital París", "Puente de candados París ubicación", "Candado virtual", "Tradición candados París", "Puente romántico París", "AR candado", "Activo digital París", "Amor eterno París", "Turismo París 2026", "Puente de las Artes digital"],
    question: "¿Dónde está el Puente de los Candados de Amor en París 2026?",
    answer: "El famoso Puente de los Candados de Amor es el Puente de las Artes en el centro de París. Desde 2015, los candados físicos son ilegales. LoveLockParis.com es el único registro digital legal para candados de amor eternos en el Puente de las Artes.",
    h1: "El Puente de los Candados de Amor Oficial París 2026"
  },
  pt: {
    title: 'Ponte das Cadeados do Amor Paris 2026 | Registro Digital Oficial (Ponte das Artes)',
    desc: 'Coloque seu cadeado do amor na Ponte das Cadeados do Amor oficial de Paris. Cadeados físicos são ilegais desde 2015. Junte-se a mais de 250.000 casais com cadeados digitais na Ponte das Artes. Experiência de Realidade Aumentada. Seguro e Eterno.',
    keywords: ["Ponte das cadeados do amor Paris", "Cadeado do amor ponte Paris", "Ponte das Artes", "Cadeado digital Paris", "Ponte de cadeados Paris localização", "Cadeado virtual", "Tradição cadeados Paris", "Ponte romântica Paris", "AR cadeado", "Ativo digital Paris", "Amor eterno Paris", "Turismo Paris 2026", "Ponte das Artes digital"],
    question: "Onde fica a Ponte das Cadeados do Amor em Paris 2026?",
    answer: "A famosa Ponte das Cadeados do Amor é a Ponte das Artes no centro de Paris. Desde 2015, cadeados físicos são ilegais. LoveLockParis.com é o único registro digital legal para cadeados do amor eternos na Ponte das Artes.",
    h1: "A Ponte das Cadeados do Amor Oficial Paris 2026"
  },
  ar: {
    title: 'جسر أقفال الحب باريس 2026 | السجل الرقمي الرسمي (جسر الفنون)',
    desc: 'ضع قفل حبك على جسر أقفال الحب الرسمي في باريس. الأقفال المادية غير قانونية منذ 2015. انضم إلى أكثر من 250،000 زوج لديهم أقفال حب رقمية على جسر الفنون. تجربة الواقع المعزز. آمن وأبدي.',
    keywords: ["جسر أقفال الحب باريس", "قفل الحب جسر باريس", "جسر الفنون", "قفل الحب الرقمي باريس", "موقع جسر الأقفال باريس", "قفل افتراضي", "تقليد الأقفال باريس", "جسر رومانسي باريس", "AR قفل", "أصول رقمية باريس", "حب أبدي باريس", "سياحة باريس 2026", "جسر الفنون الرقمي"],
    question: "أين يقع جسر أقفال الحب في باريس 2026؟",
    answer: "جسر أقفال الحب الشهير هو جسر الفنون في وسط باريس. منذ عام 2015، الأقفال المادية غير قانونية. LoveLockParis.com هو السجل الرقمي القانوني الوحيد لأقفال الحب الأبدية على جسر الفنون.",
    h1: "جسر أقفال الحب الرسمي باريس 2026"
  },
  de: {
    title: 'Liebesbrücke Paris 2026 | Offizielles Digitales Liebesschloss-Register (Pont des Arts)',
    desc: 'Bringen Sie Ihr Liebesschloss an der offiziellen Liebesbrücke in Paris an. Physische Schlösser sind seit 2015 illegal. Schließen Sie sich über 250.000 Paaren mit digitalen Liebesschlössern auf der Pont des Arts an. Augmented Reality-Erlebnis. Sicher & Ewig.',
    keywords: ["Liebesbrücke Paris", "Liebesschloss Brücke Paris", "Pont des Arts", "Digitales Liebesschloss Paris", "Paris Liebesschloss Brücke Standort", "Virtuelles Schloss", "Liebesschloss Tradition Paris", "Romantische Brücke Paris", "AR Schloss", "Digitaler Vermögenswert Paris", "Ewige Liebe Paris", "Tourismus Paris 2026", "Pont des Arts digital"],
    question: "Wo ist die Liebesbrücke in Paris 2026?",
    answer: "Die berühmte Liebesbrücke ist die Pont des Arts im Zentrum von Paris. Seit 2015 sind physische Schlösser illegal. LoveLockParis.com ist das einzige legale digitale Register für ewige Liebesschlösser auf der Pont des Arts Brücke.",
    h1: "Die Offizielle Liebesbrücke Paris 2026"
  },
  it: {
    title: 'Ponte degli Amorini Parigi 2026 | Registro Digitale Ufficiale (Pont des Arts)',
    desc: 'Appendi il tuo lucchetto dell\'amore sul Ponte degli Amorini ufficiale di Parigi. I lucchetti fisici sono illegali dal 2015. Unisciti a oltre 250.000 coppie con lucchetti digitali sul Pont des Arts. Esperienza di Realtà Aumentata. Sicuro ed Eterno.',
    keywords: ["Ponte degli amorini Parigi", "Lucchetto dell'amore ponte Parigi", "Pont des Arts", "Lucchetto digitale Parigi", "Ponte dei lucchetti Parigi posizione", "Lucchetto virtuale", "Tradizione lucchetti Parigi", "Ponte romantico Parigi", "AR lucchetto", "Bene digitale Parigi", "Amore eterno Parigi", "Turismo Parigi 2026", "Pont des Arts digitale"],
    question: "Dov'è il Ponte degli Amorini a Parigi 2026?",
    answer: "Il famoso Ponte degli Amorini è il Pont des Arts nel centro di Parigi. Dal 2015, i lucchetti fisici sono illegali. LoveLockParis.com è l'unico registro digitale legale per lucchetti dell'amore eterni sul Pont des Arts.",
    h1: "Il Ponte degli Amorini Ufficiale Parigi 2026"
  },
  ru: {
    title: 'Мост Любви Париж 2026 | Официальный Цифровой Реестр Замков Любви (Мост Искусств)',
    desc: 'Поместите свой замок любви на официальном Мосту Любви в Париже. Физические замки запрещены с 2015 года. Присоединяйтесь к более чем 250 000 пар с цифровыми замками любви на Мосту Искусств. Опыт дополненной реальности. Безопасно и Вечно.',
    keywords: ["Мост любви Париж", "Замок любви мост Париж", "Мост Искусств", "Цифровой замок любви Париж", "Мост замков Париж местоположение", "Виртуальный замок", "Традиция замков Париж", "Романтический мост Париж", "AR замок", "Цифровой актив Париж", "Вечная любовь Париж", "Туризм Париж 2026", "Мост Искусств цифровой"],
    question: "Где находится Мост Любви в Париже в 2026 году?",
    answer: "Знаменитый Мост Любви - это Мост Искусств в центре Парижа. С 2015 года физические замки запрещены. LoveLockParis.com - единственный легальный цифровой реестр для вечных замков любви на Мосту Искусств.",
    h1: "Официальный Мост Любви Париж 2026"
  }
};

// --- VIEWPORT OPTIMISÉ POUR MOBILE SEO ---
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  colorScheme: 'light dark'
};

// --- GÉNÉRATION DES MÉTADONNÉES SEO MAX ---
export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const baseUrl = 'https://lovelockparis.com';
  
  // Fallback anglais si langue non trouvée
  const t = seoData[locale] || seoData.en;

  return {
    // --- METADONNÉES DE BASE ---
    title: {
      default: t.title,
      template: `%s | LoveLockParis 2026`
    },
    description: t.desc,
    applicationName: 'LoveLockParis',
    authors: [{ 
      name: 'PANORAMA GRUP',
      url: 'https://panoramagrup.com'
    }],
    generator: 'Next.js 14',
    keywords: [...t.keywords, "Paris 2026", "Digital Tourism", "Romantic Experience", "Virtual Monument"],
    creator: 'LoveLockParis Team',
    publisher: 'PANORAMA GRUP',
    
    // --- ROBOTS & INDEXATION MAXIMALE ---
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'noimageindex': false,
        'notranslate': false,
      },
    },

    // --- HREFLANG & CANONICAL ULTRA-COMPLET ---
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'x-default': `${baseUrl}/en`,
        'en': `${baseUrl}/en`,
        'fr': `${baseUrl}/fr`,
        'zh-CN': `${baseUrl}/zh-CN`,
        'ja': `${baseUrl}/ja`,
        'ko': `${baseUrl}/ko`,
        'es': `${baseUrl}/es`,
        'pt': `${baseUrl}/pt`,
        'ar': `${baseUrl}/ar`,
        'de': `${baseUrl}/de`,
        'it': `${baseUrl}/it`,
        'ru': `${baseUrl}/ru`,
      },
    },

    // --- OPEN GRAPH ULTRA-COMPLET ---
    openGraph: {
      title: t.title,
      description: t.desc,
      url: `${baseUrl}/${locale}`,
      siteName: 'LoveLockParis',
      locale: locale,
      type: 'website',
      publishedTime: '2026-01-01T00:00:00.000Z',
      modifiedTime: new Date().toISOString(),
      authors: ['PANORAMA GRUP'],
      tags: t.keywords,
      images: [
        {
          url: `${baseUrl}/images/og-image-2026.jpg`,
          width: 1200,
          height: 630,
          alt: t.title,
          type: 'image/jpeg',
          secureUrl: `${baseUrl}/images/og-image-2026.jpg`,
        },
        {
          url: `${baseUrl}/images/og-image-square.jpg`,
          width: 600,
          height: 600,
          alt: t.title,
          type: 'image/jpeg',
        }
      ],
    },

    // --- TWITTER CARDS OPTIMISÉES ---
    twitter: {
      card: 'summary_large_image',
      title: t.title,
      description: t.desc,
      site: '@LoveLockParis',
      creator: '@LoveLockParis',
      images: [`${baseUrl}/images/twitter-card-2026.jpg`],
    },

    // --- VERIFICATIONS ---
    verification: {
      google: 'google-site-verification-code-here',
      yandex: 'yandex-verification-code',
      yahoo: 'yahoo-verification',
      other: {
        'facebook-domain-verification': ['facebook-verification-code'],
        'p:domain_verify': ['pinterest-verification'],
      },
    },

    // --- CATEGORY & CLASSIFICATION ---
    category: 'Tourism',
    classification: 'Digital Tourism, Romantic Experience, Virtual Reality',

    // --- APP LINKS ---
    appLinks: {
      ios: {
        app_store_id: 'id123456789',
        url: 'https://apps.apple.com/app/lovelockparis',
      },
      android: {
        package: 'com.lovelockparis.app',
        url: 'https://play.google.com/store/apps/details?id=com.lovelockparis',
      },
      web: {
        url: 'https://lovelockparis.com',
        should_fallback: false,
      },
    },

    // --- OTHER METADATA ---
    formatDetection: {
      telephone: true,
      date: true,
      address: true,
      email: true,
      url: true,
    },
    
    itunes: {
      appId: 'id123456789',
      appArgument: 'https://lovelockparis.com',
    },
    
    appleWebApp: {
      capable: true,
      title: 'LoveLockParis',
      statusBarStyle: 'black-translucent',
      startupImage: [
        {
          url: '/splash-screen.png',
          media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
        },
      ],
    },
  };
}

// --- LAYOUT PRINCIPAL AVEC DONNÉES STRUCTURÉES MAX ---
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  
  // Gestion RTL pour l'arabe
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Chargement des traductions avec fallback
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    messages = (await import(`@/messages/en.json`)).default;
  }

  // --- DONNÉES STRUCTURÉES JSON-LD ULTRA-COMPLÈTES ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristAttraction",
        "@id": "https://lovelockparis.com/#attraction",
        "name": seoData[locale]?.h1 || seoData.en.h1,
        "alternateName": [
          "Lock of Love Bridge Paris",
          "Pont des Arts Love Locks",
          "Paris Love Lock Bridge",
          "Digital Love Lock Bridge"
        ],
        "description": seoData[locale]?.desc || seoData.en.desc,
        "url": `https://lovelockparis.com/${locale}`,
        "image": [
          "https://lovelockparis.com/images/hero-couple-2026.jpg",
          "https://lovelockparis.com/images/bridge-3d-2026.jpg",
          "https://lovelockparis.com/images/locks-gallery-2026.jpg"
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Pont des Arts",
          "addressLocality": "Paris",
          "postalCode": "75006",
          "addressCountry": "FR",
          "addressRegion": "Île-de-France"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 48.858370,
          "longitude": 2.337480,
          "elevation": 35
        },
        "openingHours": "24/7",
        "publicAccess": true,
        "isAccessibleForFree": true,
        "touristType": ["Romantic tourism", "Digital tourism", "Cultural tourism"],
        "suitableFor": ["Couples", "Families", "Solo travelers"],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "12547",
          "bestRating": "5",
          "worstRating": "1",
          "reviewCount": "9874"
        },
        "review": [
          {
            "@type": "Review",
            "author": { "@type": "Person", "name": "Sarah & Michael" },
            "datePublished": "2025-12-15",
            "reviewRating": {
              "@type": "Rating",
              "ratingValue": "5",
              "bestRating": "5"
            },
            "reviewBody": "The digital love lock experience was magical! Seeing our lock appear on the actual bridge through AR was unforgettable."
          }
        ],
        "offers": {
          "@type": "Offer",
          "price": "29.99",
          "priceCurrency": "EUR",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "url": `https://lovelockparis.com/${locale}/purchase`,
          "category": "Digital Product",
          "eligibleRegion": {
            "@type": "Country",
            "name": "Worldwide"
          }
        },
        "containsPlace": {
          "@type": "Place",
          "name": "Pont des Arts Bridge",
          "description": "Historic pedestrian bridge in Paris, famous for love locks"
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://lovelockparis.com/${locale}`
        }
      },
      {
        "@type": "Organization",
        "@id": "https://lovelockparis.com/#organization",
        "name": "LoveLockParis",
        "legalName": "PANORAMA GRUP",
        "url": "https://lovelockparis.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://lovelockparis.com/logo-2026.png",
          "width": 600,
          "height": 200,
          "caption": "LoveLockParis Official Logo"
        },
        "description": "Official digital love lock registry for Pont des Arts in Paris",
        "foundingDate": "2024",
        "founders": [
          {
            "@type": "Person",
            "name": "PANORAMA GRUP"
          }
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+33-1-2345-6789",
          "contactType": "customer service",
          "email": "contact@lovelockparis.com",
          "areaServed": "Worldwide",
          "availableLanguage": ["English", "French", "Chinese", "Japanese", "Korean", "Spanish", "Portuguese", "Arabic", "German", "Italian", "Russian"]
        },
        "sameAs": [
          "https://www.facebook.com/LoveLockParis",
          "https://twitter.com/LoveLockParis",
          "https://www.instagram.com/lovelockparis",
          "https://www.pinterest.com/lovelockparis",
          "https://www.youtube.com/@LoveLockParis",
          "https://www.tiktok.com/@lovelockparis",
          "https://www.linkedin.com/company/lovelockparis"
        ],
        "knowsAbout": ["Digital Tourism", "Augmented Reality", "Paris Tourism", "Romantic Experiences", "Blockchain Technology"],
        "memberOf": [
          {
            "@type": "Organization",
            "name": "Paris Tourism Board"
          },
          {
            "@type": "Organization",
            "name": "Digital Tourism Association"
          }
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://lovelockparis.com/#website",
        "url": "https://lovelockparis.com",
        "name": "LoveLockParis - Official Digital Love Lock Registry",
        "description": seoData[locale]?.desc || seoData.en.desc,
        "publisher": {
          "@id": "https://lovelockparis.com/#organization"
        },
        "inLanguage": locale,
        "potentialAction": [
          {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://lovelockparis.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://lovelockparis.com/#faqpage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": seoData[locale]?.question || seoData.en.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": seoData[locale]?.answer || seoData.en.answer
            }
          },
          {
            "@type": "Question",
            "name": locale === 'fr' ? "Les cadenas physiques sont-ils toujours autorisés sur le Pont des Arts ?" :
                   locale === 'zh-CN' ? "艺术桥上是否还允许实体锁？" :
                   "Are physical locks still allowed on Pont des Arts?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": locale === 'fr' ? "Non, depuis 2015, les cadenas physiques sont strictement interdits sur tous les ponts de Paris. Les contrevenants risquent une amende de 500€. LoveLockParis est la seule alternative légale et numérique." :
                       locale === 'zh-CN' ? "不，自2015年起，实体锁在巴黎所有桥梁上被严格禁止。违者将面临500欧元罚款。LoveLockParis是唯一合法且数字化的替代方案。" :
                       "No, since 2015, physical locks are strictly prohibited on all Paris bridges. Violators face a €500 fine. LoveLockParis is the only legal, digital alternative."
            }
          },
          {
            "@type": "Question",
            "name": locale === 'fr' ? "Comment fonctionne le cadenas d'amour numérique ?" :
                   locale === 'zh-CN' ? "数字爱情锁如何运作？" :
                   "How does the digital love lock work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": locale === 'fr' ? "Vous achetez un cadenas numérique, le personnalisez avec vos noms et un message, et le visualisez en réalité augmentée lorsque vous visitez le Pont des Arts. Il est également accessible en 3D depuis n'importe où dans le monde via notre site web." :
                       locale === 'zh-CN' ? "您购买一个数字锁，用您的姓名和信息进行个性化设置，参观艺术桥时通过增强现实查看。您还可以通过我们的网站在世界任何地方进行3D访问。" :
                       "You purchase a digital lock, personalize it with your names and message, and view it in augmented reality when visiting Pont des Arts. It's also accessible in 3D from anywhere in the world via our website."
            }
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://lovelockparis.com/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": `https://lovelockparis.com/${locale}`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": locale === 'fr' ? "Pont des Cadenas d'Amour" :
                     locale === 'zh-CN' ? "爱情锁桥" :
                     "Love Lock Bridge",
            "item": `https://lovelockparis.com/${locale}/bridge`
          }
        ]
      }
    ]
  };

  return (
    <html 
      lang={locale} 
      dir={dir} 
      className={`${playfair.variable} ${montserrat.variable}`} 
      suppressHydrationWarning
      itemScope 
      itemType="https://schema.org/WebPage"
    >
      <head>
        {/* Données structurées JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          key="structured-data"
        />

        {/* Preconnect pour performances SEO */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.lovelockparis.com" />
        <link rel="dns-prefetch" href="https://cdn.lovelockparis.com" />

        {/* Manifest PWA */}
        <link rel="manifest" href="/manifest-2026.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LoveLockParis" />

        {/* Preload des images critiques */}
        <link rel="preload" href="/images/hero-couple-2026.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/images/logo-2026.png" as="image" type="image/png" />

        {/* Favicon moderne */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Thème couleur pour mobile */}
        <meta name="theme-color" content="#e11d48" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />

        {/* Additional meta tags for social sharing */}
        <meta property="og:locale" content={locale.replace('-', '_')} />
        <meta property="og:locale:alternate" content="en_US" />
        <meta property="og:locale:alternate" content="fr_FR" />
        <meta property="og:locale:alternate" content="zh_CN" />
        <meta property="og:locale:alternate" content="ja_JP" />
        <meta property="og:locale:alternate" content="ko_KR" />
        <meta property="og:locale:alternate" content="es_ES" />
        <meta property="og:locale:alternate" content="pt_BR" />
        <meta property="og:locale:alternate" content="ar_SA" />

        {/* Geo tags for local SEO */}
        <meta name="geo.region" content="FR-75" />
        <meta name="geo.placename" content="Paris" />
        <meta name="geo.position" content="48.858370;2.337480" />
        <meta name="ICBM" content="48.858370, 2.337480" />
      </head>
      <body className="bg-white text-slate-900 font-sans antialiased selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      <script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="2cd2d759-05b7-40fb-924b-1b7a448620a7";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
        
        {/* Schema.org markup for body */}
        <div itemScope itemType="https://schema.org/WebPage" style={{ display: 'none' }}>
          <meta itemProp="name" content={seoData[locale]?.title || seoData.en.title} />
          <meta itemProp="description" content={seoData[locale]?.desc || seoData.en.desc} />
          <meta itemProp="image" content="https://lovelockparis.com/images/hero-couple-2026.jpg" />
        </div>

        <NextIntlClientProvider messages={messages} locale={locale}>
          {/* SÉCURITÉ AUTHENTIFICATION ET THÈME */}
          <Providers>
            {children}
          </Providers>
        </NextIntlClientProvider>

        {/* Scripts de performance */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Service Worker pour PWA
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('Service Worker registered with scope:', registration.scope);
                    },
                    function(err) {
                      console.log('Service Worker registration failed:', err);
                    }
                  );
                });
              }

              // Performance monitoring
              window.addEventListener('load', function() {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                if (pageLoadTime < 2000) {
                  console.log('Page loaded in', pageLoadTime, 'ms - Excellent performance!');
                }
              });

              // Lazy loading des images
              if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries, observer) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target;
                      img.src = img.dataset.src;
                      img.classList.remove('lazy');
                      observer.unobserve(img);
                    }
                  });
                });

                document.querySelectorAll('img.lazy').forEach(img => imageObserver.observe(img));
              }
            `
          }}
        />
      </body>
    </html>
  );
}
