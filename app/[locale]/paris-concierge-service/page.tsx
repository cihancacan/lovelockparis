import Image from "next/image";
import type { Metadata } from "next";

type Props = {
  params: { locale: string };
};

export const dynamic = "force-static";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params?.locale ?? "en";
  const isFR = locale === "fr";
  
  const title = isFR
    ? "Paris Concierge Service — Club Privé Select (Couples & Groupes) | LoveLockParis"
    : "Paris Concierge Service — Select Private Club Access (Couples & Groups) | LoveLockParis";
  
  const description = isFR
    ? "Conciergerie de luxe à Paris : jet privé, hélicoptère, yacht, chauffeur Mercedes Classe S, van premium, clubs privés (accès garanti), expériences romantiques, shopping (montres, bijoux, sacs) et demandes sur-mesure."
    : "Luxury concierge service in Paris: private jet, helicopter, yacht, Mercedes S-Class chauffeur, premium van, private clubs (guaranteed access), romantic experiences, luxury shopping (watches, jewelry, bags) and bespoke requests.";
  
  const keywords = isFR
    ? "paris concierge service, conciergerie de luxe paris, conciergerie privée paris, club privé paris accès garanti, vip paris, jet privé paris, hélicoptère paris, yacht paris, chauffeur mercedes classe s paris, van luxe paris, restaurant michelin réservation, table vip paris, nightlife paris vip, shopping luxe paris, montre luxe achat paris, bijoux haute joaillerie, sacs de luxe, expérience romantique paris, dîner romantique yacht tour eiffel, service discret paris, concierge pour couples paris, concierge pour groupes paris, luxury travel paris"
    : "paris concierge service, luxury concierge paris, private concierge paris, private club paris guaranteed access, vip paris, private jet paris, helicopter paris, yacht paris, mercedes s class chauffeur paris, luxury van paris, michelin restaurant reservations, vip table paris, nightlife paris vip, luxury shopping paris, luxury watches purchase paris, fine jewelry, designer bags, romantic experience paris, romantic dinner yacht eiffel tower, discreet service paris, concierge for couples paris, concierge for groups paris, luxury travel paris";

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: isFR ? "fr_FR" : "en_US",
      url: `https://lovelockparis.com/${locale}/paris-concierge-service`,
      title,
      description: description.substring(0, 155),
      images: [
        {
          url: "https://lovelockparis.com/images/concierge/og-image.jpg",
          width: 1200,
          height: 630,
          alt: isFR ? "Service Conciergerie de Luxe Paris" : "Luxury Concierge Service Paris",
        },
      ],
      siteName: "LoveLockParis",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description.substring(0, 155),
      images: ["https://lovelockparis.com/images/concierge/twitter-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `https://lovelockparis.com/${locale}/paris-concierge-service`,
      languages: {
        "en": "https://lovelockparis.com/en/paris-concierge-service",
        "fr": "https://lovelockparis.com/fr/paris-concierge-service",
      },
    },
  };
}

export default function ParisConciergeServicePage({ params }: Props) {
  const locale = params?.locale ?? "en";
  const isFR = locale === "fr";

  // Contact
  const PHONE_DISPLAY = "+33 1 88 84 22 22";
  const PHONE_TEL = "+33188842222";
  const EMAIL = "concierge@lovelockparis.com";
  const CHAT_URL = "/chat";
  const BRAND = "LoveLockParis — Select Private Concierge";
  const BASE_URL = "https://lovelockparis.com";

  // Text content
  const H1 = isFR
    ? "Paris Concierge Service — Club Privé Select (Couples & Groupes)"
    : "Paris Concierge Service — Select Private Club Access (Couples & Groups)";

  const subtitle = isFR
    ? "Conciergerie de luxe à Paris : jet privé, hélicoptère, yacht, chauffeur Mercedes Classe S, van premium, clubs privés (accès garanti), expériences romantiques, shopping (montres, bijoux, sacs) et demandes sur-mesure."
    : "Luxury concierge service in Paris: private jet, helicopter, yacht, Mercedes S-Class chauffeur, premium van, private clubs (guaranteed access), romantic experiences, luxury shopping (watches, jewelry, bags) and bespoke requests.";

  // Keywords
  const keywordsLong = isFR
    ? "paris concierge service, conciergerie de luxe paris, conciergerie privée paris, club privé paris accès garanti, vip paris, jet privé paris, hélicoptère paris, yacht paris, chauffeur mercedes classe s paris, van luxe paris, restaurant michelin réservation, table vip paris, nightlife paris vip, shopping luxe paris, montre luxe achat paris, bijoux haute joaillerie, sacs de luxe, expérience romantique paris, dîner romantique yacht tour eiffel, service discret paris, concierge pour couples paris, concierge pour groupes paris, luxury travel paris"
    : "paris concierge service, luxury concierge paris, private concierge paris, private club paris guaranteed access, vip paris, private jet paris, helicopter paris, yacht paris, mercedes s class chauffeur paris, luxury van paris, michelin restaurant reservations, vip table paris, nightlife paris vip, luxury shopping paris, luxury watches purchase paris, fine jewelry, designer bags, romantic experience paris, romantic dinner yacht eiffel tower, discreet service paris, concierge for couples paris, concierge for groups paris, luxury travel paris";

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: BRAND,
        url: `${BASE_URL}/${locale}/paris-concierge-service`,
        telephone: PHONE_DISPLAY,
        email: EMAIL,
        areaServed: ["Paris", "Île-de-France", "France", "International"],
        description: subtitle,
        image: [
          `${BASE_URL}/images/concierge/romantic-dinner.jpg`,
          `${BASE_URL}/images/concierge/tarmac.jpg`,
          `${BASE_URL}/images/concierge/club.jpg`,
          `${BASE_URL}/images/concierge/yacht.jpg`,
        ],
      },
      {
        "@type": "Service",
        name: isFR ? "Conciergerie de Luxe à Paris" : "Luxury Concierge Service in Paris",
        provider: { "@type": "Organization", name: "LoveLockParis" },
        serviceType: [
          "Private Concierge",
          "VIP Nightlife",
          "Private Aviation",
          "Luxury Transport",
          "Yacht Charter",
          "Luxury Shopping",
          "Bespoke Experiences",
        ],
        areaServed: ["Paris", "France", "International"],
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceSpecification: {
            "@type": "PriceSpecification",
            priceCurrency: "EUR",
          },
        },
      },
      {
        "@type": "AggregateOffer",
        availability: "https://schema.org/InStock",
        priceCurrency: "EUR",
        lowPrice: "500",
        highPrice: "50000",
        offerCount: "50",
        offeredBy: {
          "@type": "Organization",
          name: "LoveLockParis"
        }
      },
      {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "127",
        bestRating: "5",
        worstRating: "1"
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: isFR
              ? "Votre Paris Concierge Service est-il réservé aux couples uniquement ?"
              : "Is your Paris concierge service only for couples?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFR
                ? "Non. Le Club Privé Select est conçu pour les couples ET les groupes. Nous gérons les demandes individuelles, les groupes d'amis, les anniversaires, EVJF/EVG, et les événements privés."
                : "No. Select Private Club Access is designed for both couples and groups. We handle individual requests, friend groups, birthdays, bachelor/bachelorette trips, and private events.",
            },
          },
          {
            "@type": "Question",
            name: isFR
              ? "Pouvez-vous organiser jet privé, hélicoptère et yacht à Paris ?"
              : "Can you arrange private jet, helicopter, and yacht in Paris?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFR
                ? "Oui. Nous organisons l'aviation privée (jet), les transferts en hélicoptère, et les expériences yacht avec options dîner, itinéraires, et services premium."
                : "Yes. We arrange private aviation (jet), helicopter transfers, and yacht experiences with dinner options, routes, and premium services.",
            },
          },
          {
            "@type": "Question",
            name: isFR
              ? "Si une prestation n'est pas écrite sur la page, pouvez-vous quand même la fournir ?"
              : "If something is not listed on the page, can you still provide it?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFR
                ? "Oui. Si ce n'est pas écrit, demandez par email, téléphone ou chat. Nous sourçons et organisons des demandes rares : montres, bijoux, sacs, cadeaux, expériences privées, surprises."
                : "Yes. If it's not listed, ask by email, phone, or chat. We source and arrange rare requests: watches, jewelry, bags, gifts, private experiences, and surprises.",
            },
          },
        ],
      },
    ],
  };

  // Simple navigation for this page only
  const simpleNav = {
    home: { href: `/${locale}`, label: isFR ? "Accueil" : "Home" },
    about: { href: `/${locale}/about`, label: isFR ? "À propos" : "About" },
    services: { href: `/${locale}/services`, label: isFR ? "Services" : "Services" },
    contact: { href: `/${locale}/contact`, label: isFR ? "Contact" : "Contact" },
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hidden SEO keywords */}
      <div className="sr-only">
        <p>{keywordsLong}</p>
      </div>

      {/* SIMPLE HEADER - No external dependencies */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <a href={`/${locale}`} className="text-2xl font-bold text-rose-600">
                LoveLockParis
              </a>
              <span className="ml-2 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {isFR ? "Conciergerie" : "Concierge"}
              </span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href={simpleNav.home.href} className="text-slate-700 hover:text-rose-600 transition-colors">
                {simpleNav.home.label}
              </a>
              <a href={simpleNav.about.href} className="text-slate-700 hover:text-rose-600 transition-colors">
                {simpleNav.about.label}
              </a>
              <a href={simpleNav.services.href} className="text-slate-700 hover:text-rose-600 transition-colors">
                {simpleNav.services.label}
              </a>
              <a href={simpleNav.contact.href} className="bg-rose-600 text-white px-6 py-2 rounded-lg hover:bg-rose-700 transition-colors">
                {simpleNav.contact.label}
              </a>
            </nav>
            <div className="md:hidden">
              <button className="text-slate-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/concierge/romantic-dinner.jpg"
            alt={isFR ? "Dîner romantique sur yacht à Paris" : "Romantic dinner on a yacht in Paris"}
            fill
            priority
            className="object-cover"
            sizes="100vw"
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/25 px-4 py-2 text-white text-xs font-semibold tracking-wide uppercase">
              {isFR ? "Club Privé Select • Accès garanti" : "Select Private Club • Guaranteed access"}
              <span className="opacity-80">•</span>
              {isFR ? "Couples & Groupes" : "Couples & Groups"}
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              {H1}
            </h1>

            <p className="mt-6 text-lg md:text-xl text-slate-100 leading-relaxed max-w-3xl">
              {subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${PHONE_TEL}`}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl hover:from-rose-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {PHONE_DISPLAY}
              </a>
              
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-slate-900 bg-white rounded-xl border-2 border-white/20 hover:bg-slate-50 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {EMAIL}
              </a>
            </div>

            {/* Contact Info Grid */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 text-white">
                <div className="text-sm font-semibold opacity-90">{isFR ? "Téléphone Prioritaire" : "Priority Phone"}</div>
                <a className="text-2xl font-bold mt-2 block hover:text-rose-100 transition-colors" href={`tel:${PHONE_TEL}`}>
                  {PHONE_DISPLAY}
                </a>
                <div className="text-sm opacity-80 mt-3">
                  {isFR ? "Réponse immédiate • 24/7" : "Immediate response • 24/7"}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 text-white">
                <div className="text-sm font-semibold opacity-90">Email Concierge</div>
                <a className="text-xl font-bold mt-2 block hover:text-rose-100 transition-colors break-all" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
                <div className="text-sm opacity-80 mt-3">
                  {isFR ? "Demandes sur-mesure • Réponse rapide" : "Bespoke requests • Fast response"}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-6 text-white">
                <div className="text-sm font-semibold opacity-90">{isFR ? "Chat Direct" : "Direct Chat"}</div>
                <a className="text-2xl font-bold mt-2 block hover:text-rose-100 transition-colors" href={CHAT_URL}>
                  {isFR ? "Écrire maintenant" : "Message Now"}
                </a>
                <div className="text-sm opacity-80 mt-3">
                  {isFR ? "Discret & Instantané" : "Discreet & Instant"}
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-white/10 backdrop-blur">
              <p className="text-white text-lg font-semibold">
                {isFR ? (
                  <>
                    <span className="text-rose-200">✨ Important :</span> si une prestation n'est pas écrite, vous demandez par email, téléphone ou chat. Nous organisons aussi des achats : <span className="text-white font-bold">montres, bijoux, sacs, cadeaux, pièces rares</span>.
                  </>
                ) : (
                  <>
                    <span className="text-rose-200">✨ Important:</span> if it's not written, ask by email, phone, or chat. We also source purchases: <span className="text-white font-bold">watches, jewelry, bags, gifts, rare items</span>.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & POSITIONING SECTION */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              {isFR ? "Conciergerie de Luxe Paris" : "Luxury Concierge Paris"}
            </h2>
            <p className="mt-4 text-xl text-slate-600 max-w-4xl mx-auto">
              {isFR
                ? "Excellence discrète pour couples & groupes — Accès privilégié aux expériences les plus exclusives de Paris"
                : "Discreet excellence for couples & groups — Privileged access to Paris' most exclusive experiences"}
            </p>
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-600 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{isFR ? "Discretion Totale" : "Total Discretion"}</h3>
              <p className="mt-4 text-slate-600">
                {isFR
                  ? "Confidentialité garantie. Votre intimité est notre priorité absolue."
                  : "Guaranteed confidentiality. Your privacy is our absolute priority."}
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-600 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{isFR ? "Accès Garanti" : "Guaranteed Access"}</h3>
              <p className="mt-4 text-slate-600">
                {isFR
                  ? "Accès privilégié aux clubs, restaurants et événements les plus exclusifs."
                  : "Privileged access to the most exclusive clubs, restaurants and events."}
              </p>
            </div>

            <div className="text-center p-8 rounded-3xl bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-50 text-rose-600 mb-6">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{isFR ? "Exécution Rapide" : "Fast Execution"}</h3>
              <p className="mt-4 text-slate-600">
                {isFR
                  ? "Réponse immédiate, organisation fluide, expérience sans attente."
                  : "Immediate response, seamless organization, no-wait experience."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PREMIUM EXPERIENCES GALLERY */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-center text-slate-900">
            {isFR ? "Expériences Premium à Paris" : "Premium Experiences in Paris"}
          </h2>
          <p className="mt-4 text-xl text-slate-600 text-center max-w-3xl mx-auto">
            {isFR
              ? "Quatre univers d'excellence pour des moments inoubliables"
              : "Four worlds of excellence for unforgettable moments"}
          </p>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Romantic Experience */}
            <div className="group relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/concierge/romantic-dinner.jpg"
                alt={isFR ? "Dîner romantique yacht Paris coucher soleil" : "Romantic yacht dinner Paris sunset"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="text-sm font-semibold text-rose-300 uppercase tracking-wider">
                  {isFR ? "Expérience Romantique" : "Romantic Experience"}
                </div>
                <h3 className="text-3xl font-bold mt-2">
                  {isFR ? "Dîner sur Yacht Privé" : "Private Yacht Dinner"}
                </h3>
                <p className="mt-3 text-lg opacity-90">
                  {isFR
                    ? "Coucher de soleil, vue Tour Eiffel, chef privé, champagne"
                    : "Sunset, Eiffel Tower view, private chef, champagne"}
                </p>
              </div>
            </div>

            {/* Private Aviation */}
            <div className="group relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/concierge/tarmac.jpg"
                alt={isFR ? "Jet privé hélicoptère Paris" : "Private jet helicopter Paris"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="text-sm font-semibold text-rose-300 uppercase tracking-wider">
                  {isFR ? "Aviation Privée" : "Private Aviation"}
                </div>
                <h3 className="text-3xl font-bold mt-2">
                  {isFR ? "Jet & Hélicoptère" : "Jet & Helicopter"}
                </h3>
                <p className="mt-3 text-lg opacity-90">
                  {isFR
                    ? "Transferts VIP, tours exclusifs, coordination complète"
                    : "VIP transfers, exclusive tours, full coordination"}
                </p>
              </div>
            </div>

            {/* Nightlife */}
            <div className="group relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/concierge/club.jpg"
                alt={isFR ? "Club privé select Paris VIP" : "Select private club Paris VIP"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="text-sm font-semibold text-rose-300 uppercase tracking-wider">
                  {isFR ? "Nightlife Exclusif" : "Exclusive Nightlife"}
                </div>
                <h3 className="text-3xl font-bold mt-2">
                  {isFR ? "Club Privé Select" : "Select Private Club"}
                </h3>
                <p className="mt-3 text-lg opacity-90">
                  {isFR
                    ? "Accès garanti, tables VIP, bouteilles, service personnalisé"
                    : "Guaranteed access, VIP tables, bottles, personalized service"}
                </p>
              </div>
            </div>

            {/* Luxury Transport */}
            <div className="group relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/images/concierge/yacht.jpg"
                alt={isFR ? "Yacht premium Seine Paris" : "Premium yacht Seine Paris"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <div className="text-sm font-semibold text-rose-300 uppercase tracking-wider">
                  {isFR ? "Transport de Luxe" : "Luxury Transport"}
                </div>
                <h3 className="text-3xl font-bold mt-2">
                  {isFR ? "Mercedes Classe S & Yacht" : "Mercedes S-Class & Yacht"}
                </h3>
                <p className="mt-3 text-lg opacity-90">
                  {isFR
                    ? "Chauffeur privé, croisières, confort absolu"
                    : "Private chauffeur, cruises, absolute comfort"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE SERVICES */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              {isFR ? "Services Complets de Conciergerie" : "Complete Concierge Services"}
            </h2>
            <p className="mt-4 text-xl text-slate-600 max-w-4xl mx-auto">
              {isFR
                ? "Tous les services premium pour une expérience Parisienne parfaite"
                : "All premium services for a perfect Parisian experience"}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: isFR ? "Aviation Privée" : "Private Aviation",
                services: [
                  isFR ? "Jet privé sur mesure" : "Tailored private jet",
                  isFR ? "Hélicoptère VIP" : "VIP helicopter",
                  isFR ? "Transferts aéroport" : "Airport transfers",
                  isFR ? "Coordination complète" : "Full coordination",
                ],
                icon: "✈️"
              },
              {
                title: isFR ? "Transport de Luxe" : "Luxury Transport",
                services: [
                  isFR ? "Mercedes Classe S avec chauffeur" : "Mercedes S-Class with chauffeur",
                  isFR ? "Van premium groupes" : "Premium van for groups",
                  isFR ? "Service 24/7" : "24/7 service",
                  isFR ? "Ponctualité garantie" : "Guaranteed punctuality",
                ],
                icon: "🚗"
              },
              {
                title: isFR ? "Yacht & Croisières" : "Yacht & Cruises",
                services: [
                  isFR ? "Yacht privé personnalisé" : "Custom private yacht",
                  isFR ? "Dîner romantique" : "Romantic dinner",
                  isFR ? "Options chef & champagne" : "Chef & champagne options",
                  isFR ? "Vue Tour Eiffel" : "Eiffel Tower view",
                ],
                icon: "🛥️"
              },
              {
                title: isFR ? "Clubs Privés" : "Private Clubs",
                services: [
                  isFR ? "Accès garanti" : "Guaranteed access",
                  isFR ? "Tables VIP réservées" : "Reserved VIP tables",
                  isFR ? "Service bouteilles" : "Bottle service",
                  isFR ? "Couples & groupes" : "Couples & groups",
                ],
                icon: "🎭"
              },
              {
                title: isFR ? "Gastronomie" : "Fine Dining",
                services: [
                  isFR ? "Réservations Michelin" : "Michelin reservations",
                  isFR ? "Tables impossibles" : "Impossible tables",
                  isFR ? "Privatisation restaurants" : "Restaurant buyouts",
                  isFR ? "Expériences culinaires" : "Culinary experiences",
                ],
                icon: "🍽️"
              },
              {
                title: isFR ? "Shopping Luxe" : "Luxury Shopping",
                services: [
                  isFR ? "Montres de collection" : "Collector watches",
                  isFR ? "Haute joaillerie" : "High jewelry",
                  isFR ? "Sacs édition limitée" : "Limited edition bags",
                  isFR ? "Sourcing discret" : "Discreet sourcing",
                ],
                icon: "💎"
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-6">{service.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
                <ul className="mt-6 space-y-3">
                  {service.services.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg className="w-5 h-5 text-rose-500 mr-3 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex flex-col sm:flex-row gap-6 items-center justify-center p-8 bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl border border-rose-100 max-w-4xl mx-auto">
              <div className="text-5xl">✨</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-slate-900">
                  {isFR ? "Demandes Spéciales" : "Special Requests"}
                </h3>
                <p className="mt-2 text-lg text-slate-700">
                  {isFR
                    ? "Si ce que vous cherchez n'est pas listé, demandez-le. Nous organisons : surprises romantiques, événements privés, cadeaux uniques, expériences rares, et bien plus."
                    : "If what you're looking for isn't listed, ask us. We arrange: romantic surprises, private events, unique gifts, rare experiences, and much more."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              {isFR ? "Avis Clients Internationaux" : "International Client Reviews"}
            </h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">
              {isFR
                ? "Ce que disent nos clients du monde entier"
                : "What our clients from around the world say"}
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Michael & Sarah",
                location: "New York, USA",
                text: isFR ? "Service exceptionnel. Notre soirée sur le yacht était magique. Tout était parfaitement organisé." : "Exceptional service. Our yacht evening was magical. Everything perfectly organized.",
                rating: 5
              },
              {
                name: "Kenji Tanaka",
                location: "Tokyo, Japan",
                text: isFR ? "Discrétion et professionnalisme au top. Accès club garanti comme promis." : "Top discretion and professionalism. Club access guaranteed as promised.",
                rating: 5
              },
              {
                name: "Rafael & Friends",
                location: "São Paulo, Brazil",
                text: isFR ? "Pour notre groupe de 8, tout était fluide : transport, clubs, restaurants. Parfait." : "For our group of 8, everything was seamless: transport, clubs, restaurants. Perfect.",
                rating: 5
              },
              {
                name: "Omar Al-Mansoor",
                location: "Dubai, UAE",
                text: isFR ? "Service haut de gamme. Le jet privé et l'hélicoptère étaient impeccablement organisés." : "High-end service. Private jet and helicopter impeccably organized.",
                rating: 5
              },
              {
                name: "Sophie & David",
                location: "Sydney, Australia",
                text: isFR ? "Notre dîner d'anniversaire romantique était incroyable. Merci pour cette belle surprise !" : "Our romantic anniversary dinner was incredible. Thank you for this beautiful surprise!",
                rating: 5
              },
              {
                name: "The Chen Family",
                location: "Shanghai, China",
                text: isFR ? "Shopping luxe impeccable. Montres et bijoux sourcés avec expertise et discrétion." : "Impeccable luxury shopping. Watches and jewelry sourced with expertise and discretion.",
                rating: 5
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-slate-900">{testimonial.name}</h4>
                    <p className="text-slate-600 text-sm">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPREHENSIVE FAQ */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              {isFR ? "Questions Fréquentes" : "Frequently Asked Questions"}
            </h2>
            <p className="mt-4 text-xl text-slate-600">
              {isFR
                ? "Toutes vos questions sur notre service conciergerie Paris"
                : "All your questions about our Paris concierge service"}
            </p>
          </div>

          <div className="mt-16 space-y-6">
            {[
              {
                q: isFR ? "Pour qui est ce service conciergerie ?" : "Who is this concierge service for?",
                a: isFR ? "Pour les couples cherchant une expérience romantique, les groupes d'amis en voyage, les célébrations (anniversaires, EVJF/EVG), les voyageurs d'affaires premium, et toute personne désirant une expérience Parisienne exclusive sans stress." : "For couples seeking a romantic experience, friend groups traveling together, celebrations (birthdays, bachelor/bachelorette trips), premium business travelers, and anyone wanting a stress-free exclusive Parisian experience."
              },
              {
                q: isFR ? "Comment fonctionne l'accès garanti aux clubs ?" : "How does guaranteed club access work?",
                a: isFR ? "Nous travaillons avec des partenaires privilégiés dans les établissements les plus exclusifs. Nous garantissons l'accès selon disponibilité réelle. En cas d'impossibilité extrême, nous proposons des alternatives équivalentes ou supérieures." : "We work with privileged partners in the most exclusive venues. We guarantee access based on actual availability. In case of extreme impossibility, we offer equivalent or superior alternatives."
              },
              {
                q: isFR ? "Quels sont les délais de réservation ?" : "What are the booking deadlines?",
                a: isFR ? "Pour les services standards : 24-48h. Pour les demandes complexes (jet privé, yacht, privatisation) : 3-7 jours. En urgence, contactez-nous directement par téléphone." : "For standard services: 24-48h. For complex requests (private jet, yacht, buyouts): 3-7 days. For emergencies, contact us directly by phone."
              },
              {
                q: isFR ? "Proposez-vous des forfaits ou tarifs à la carte ?" : "Do you offer packages or à la carte pricing?",
                a: isFR ? "Les deux. Nous créons des forfaits sur mesure selon vos besoins, et proposons aussi chaque service à la carte. Demandez un devis personnalisé sans engagement." : "Both. We create customized packages according to your needs, and also offer each service à la carte. Request a personalized quote with no obligation."
              },
              {
                q: isFR ? "Pouvez-vous organiser des surprises romantiques ?" : "Can you organize romantic surprises?",
                a: isFR ? "Absolument. Nous sommes spécialisés dans les surprises romantiques : propositions de mariage, anniversaires de couple, retrouvailles, déclarations d'amour. Discrétion et créativité garanties." : "Absolutely. We specialize in romantic surprises: marriage proposals, couple anniversaries, reunions, love declarations. Discretion and creativity guaranteed."
              },
              {
                q: isFR ? "Travaillez-vous avec des entreprises pour des événements ?" : "Do you work with companies for events?",
                a: isFR ? "Oui. Nous organisons des événements d'entreprise, incentives, lancements de produits, et réunions haut de gamme à Paris. Contactez-nous pour les détails professionnels." : "Yes. We organize corporate events, incentives, product launches, and high-end meetings in Paris. Contact us for professional details."
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{faq.q}</h3>
                <p className="text-lg text-slate-700 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-rose-600 to-pink-600 rounded-3xl p-12 text-white">
              <h3 className="text-3xl md:text-4xl font-bold">
                {isFR ? "Prêt pour votre expérience Parisienne exclusive ?" : "Ready for your exclusive Parisian experience?"}
              </h3>
              <p className="mt-4 text-xl opacity-90">
                {isFR
                  ? "Contactez-nous maintenant pour un devis personnalisé"
                  : "Contact us now for a personalized quote"}
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-6 justify-center">
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold bg-white text-rose-600 rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:scale-105"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {PHONE_DISPLAY}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center justify-center px-10 py-5 text-lg font-bold bg-rose-700 text-white rounded-xl hover:bg-rose-800 transition-all duration-300 shadow-2xl hover:scale-105"
                >
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {EMAIL}
                </a>
              </div>
              <p className="mt-8 text-lg opacity-90">
                {isFR
                  ? "Réponse garantie dans les 2 heures pendant les heures d'ouverture"
                  : "Guaranteed response within 2 hours during opening hours"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SIMPLE FOOTER - No external dependencies */}
      <footer className="bg-slate-900 text-slate-300 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="text-white font-semibold text-xl">{BRAND}</div>
              <p className="mt-4 text-slate-400">
                {isFR
                  ? "Conciergerie de luxe à Paris • Couples & Groupes • Discrétion • Exécution premium"
                  : "Luxury concierge in Paris • Couples & Groups • Discretion • Premium execution"}
              </p>
            </div>

            <div>
              <div className="text-white font-semibold text-lg mb-4">{isFR ? "Contact Rapide" : "Quick Contact"}</div>
              <div className="space-y-3">
                <a 
                  href={`tel:${PHONE_TEL}`} 
                  className="block text-lg font-semibold text-white hover:text-rose-300 transition-colors"
                >
                  {PHONE_DISPLAY}
                </a>
                <a 
                  href={`mailto:${EMAIL}`} 
                  className="block text-white hover:text-rose-300 transition-colors break-all"
                >
                  {EMAIL}
                </a>
                <a 
                  href={CHAT_URL} 
                  className="block text-white hover:text-rose-300 transition-colors"
                >
                  {isFR ? "💬 Chat Direct" : "💬 Direct Chat"}
                </a>
              </div>
            </div>

            <div>
              <div className="text-white font-semibold text-lg mb-4">{isFR ? "Note Importante" : "Important Note"}</div>
              <p className="text-slate-400">
                {isFR
                  ? "Si une prestation n'est pas listée : demandez. Achats possibles (montres, bijoux, sacs), sourcing discret, demandes spéciales."
                  : "If a service is not listed: ask. Purchases possible (watches, jewelry, bags), discreet sourcing, special requests."}
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-slate-500 text-sm">
                © {new Date().getFullYear()} LoveLockParis. {isFR ? "Tous droits réservés." : "All rights reserved."}
              </div>
              <div className="mt-4 md:mt-0 flex space-x-6">
                <a href={`/${locale}/privacy`} className="text-slate-400 hover:text-white text-sm transition-colors">
                  {isFR ? "Confidentialité" : "Privacy"}
                </a>
                <a href={`/${locale}/terms`} className="text-slate-400 hover:text-white text-sm transition-colors">
                  {isFR ? "Conditions" : "Terms"}
                </a>
                <a href={`/${locale}/contact`} className="text-slate-400 hover:text-white text-sm transition-colors">
                  {isFR ? "Contact" : "Contact"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
