import Image from "next/image";

type Props = {
  params: { locale: string };
};

export const dynamic = "force-static";

export default function ParisConciergeServicePage({ params }: Props) {
  const locale = params?.locale ?? "en";

  // Contact
  const PHONE_DISPLAY = "+33 1 88 84 22 22";
  const PHONE_TEL = "+33188842222";
  const EMAIL = "concierge@lovelockparis.com"; // change if needed
  const CHAT_URL = "/chat"; // change if needed
  const BRAND = "LoveLockParis — Select Private Concierge";
  const BASE_URL = "https://lovelockparis.com";

  // Text helpers (light i18n without next-intl to keep it simple + stable)
  const isFR = locale === "fr";

  const H1 = isFR
    ? "Paris Concierge Service — Club Privé Select (Couples & Groupes)"
    : "Paris Concierge Service — Select Private Club Access (Couples & Groups)";

  const subtitle = isFR
    ? "Conciergerie de luxe à Paris : jet privé, hélicoptère, yacht, chauffeur Mercedes Classe S, van premium, clubs privés (accès garanti), expériences romantiques, shopping (montres, bijoux, sacs) et demandes sur-mesure."
    : "Luxury concierge service in Paris: private jet, helicopter, yacht, Mercedes S-Class chauffeur, premium van, private clubs (guaranteed access), romantic experiences, luxury shopping (watches, jewelry, bags) and bespoke requests.";

  // SEO Keywords (IA-friendly copy: explicit, exhaustive, structured)
  const keywordsLong = isFR
    ? "paris concierge service, conciergerie de luxe paris, conciergerie privée paris, club privé paris accès garanti, vip paris, jet privé paris, hélicoptère paris, yacht paris, chauffeur mercedes classe s paris, van luxe paris, restaurant michelin réservation, table vip paris, nightlife paris vip, shopping luxe paris, montre luxe achat paris, bijoux haute joaillerie, sacs de luxe, expérience romantique paris, dîner romantique yacht tour eiffel, service discret paris, concierge pour couples paris, concierge pour groupes paris, luxury travel paris"
    : "paris concierge service, luxury concierge paris, private concierge paris, private club paris guaranteed access, vip paris, private jet paris, helicopter paris, yacht paris, mercedes s class chauffeur paris, luxury van paris, michelin restaurant reservations, vip table paris, nightlife paris vip, luxury shopping paris, luxury watches purchase paris, fine jewelry, designer bags, romantic experience paris, romantic dinner yacht eiffel tower, discreet service paris, concierge for couples paris, concierge for groups paris, luxury travel paris";

  // JSON-LD for SEO + AI
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
                ? "Non. Le Club Privé Select est conçu pour les couples ET les groupes. Nous gérons les demandes individuelles, les groupes d’amis, les anniversaires, EVJF/EVG, et les événements privés."
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
                ? "Oui. Nous organisons l’aviation privée (jet), les transferts en hélicoptère, et les expériences yacht avec options dîner, itinéraires, et services premium."
                : "Yes. We arrange private aviation (jet), helicopter transfers, and yacht experiences with dinner options, routes, and premium services.",
            },
          },
          {
            "@type": "Question",
            name: isFR
              ? "Si une prestation n’est pas écrite sur la page, pouvez-vous quand même la fournir ?"
              : "If something is not listed on the page, can you still provide it?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFR
                ? "Oui. Si ce n’est pas écrit, demandez par email, téléphone ou chat. Nous sourçons et organisons des demandes rares : montres, bijoux, sacs, cadeaux, expériences privées, surprises."
                : "Yes. If it’s not listed, ask by email, phone, or chat. We source and arrange rare requests: watches, jewelry, bags, gifts, private experiences, and surprises.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-rose-100 selection:text-rose-900">
      {/* SEO structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hidden SEO keywords (safe, not spammy: short, in one place) */}
      <div className="sr-only">
        <p>{keywordsLong}</p>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/concierge/romantic-dinner.jpg"
            alt={isFR ? "Dîner romantique sur yacht à Paris" : "Romantic dinner on a yacht in Paris"}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur border border-white/25 px-4 py-2 text-white text-xs font-semibold tracking-wide uppercase">
              {isFR ? "Club Privé Select • Accès garanti" : "Select Private Club • Guaranteed access"}
              <span className="opacity-80">•</span>
              {isFR ? "Couples & Groupes" : "Couples & Groups"}
            </div>

            <h1 className="mt-6 text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              {H1}
            </h1>

            <p className="mt-6 text-base md:text-lg text-slate-100 leading-relaxed">
              {subtitle}
            </p>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 text-white">
                <div className="text-xs opacity-80">{isFR ? "Téléphone" : "Phone"}</div>
                <a className="text-lg font-bold" href={`tel:${PHONE_TEL}`}>
                  {PHONE_DISPLAY}
                </a>
                <div className="text-xs opacity-80 mt-1">
                  {isFR ? "Réponse rapide" : "Fast response"}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 text-white">
                <div className="text-xs opacity-80">Email</div>
                <a className="text-lg font-bold break-all" href={`mailto:${EMAIL}`}>
                  {EMAIL}
                </a>
                <div className="text-xs opacity-80 mt-1">
                  {isFR ? "Demandes sur-mesure" : "Bespoke requests"}
                </div>
              </div>

              <div className="rounded-2xl bg-white/10 backdrop-blur border border-white/20 p-4 text-white">
                <div className="text-xs opacity-80">{isFR ? "Chat" : "Chat"}</div>
                <a className="text-lg font-bold" href={CHAT_URL}>
                  {isFR ? "Écrire sur le chat" : "Message us on chat"}
                </a>
                <div className="text-xs opacity-80 mt-1">
                  {isFR ? "Discret & simple" : "Discreet & easy"}
                </div>
              </div>
            </div>

            <p className="mt-10 text-sm text-white/85">
              {isFR ? (
                <>
                  <strong>Important :</strong> si une prestation n’est pas écrite, vous demandez par email, téléphone ou chat.
                  Nous organisons aussi des achats : <strong>montres, bijoux, sacs, cadeaux, pièces rares</strong>.
                </>
              ) : (
                <>
                  <strong>Important:</strong> if it’s not written, ask by email, phone, or chat.
                  We also source purchases: <strong>watches, jewelry, bags, gifts, rare items</strong>.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* TRUST + POSITIONING (SEO heavy, premium tone) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            {isFR ? "Conciergerie de Luxe à Paris : ce que nous faisons (vraiment)" : "Luxury Concierge in Paris: what we actually do"}
          </h2>

          <div className="mt-6 grid md:grid-cols-2 gap-10 text-slate-700 leading-relaxed">
            <div className="space-y-4">
              <p>
                {isFR ? (
                  <>
                    Notre <strong>Paris Concierge Service</strong> s’adresse aux voyageurs qui veulent <strong>une exécution parfaite</strong>.
                    Couples, groupes d’amis, clients internationaux, voyages d’affaires : nous créons une expérience fluide, premium et discrète.
                  </>
                ) : (
                  <>
                    Our <strong>Paris Concierge Service</strong> is built for travelers who want <strong>flawless execution</strong>.
                    Couples, friend groups, international clients, business travel: we deliver seamless, premium, discreet experiences.
                  </>
                )}
              </p>
              <p>
                {isFR ? (
                  <>
                    Vous cherchez : <strong>accès garanti à un club privé</strong>, <strong>table VIP</strong>, <strong>réservation Michelin</strong>,
                    <strong>chauffeur Mercedes Classe S</strong>, <strong>van luxe</strong>, <strong>jet privé</strong>, <strong>hélicoptère</strong>,
                    <strong>yacht</strong> ou une surprise romantique ? Vous êtes au bon endroit.
                  </>
                ) : (
                  <>
                    Looking for: <strong>guaranteed private club access</strong>, <strong>VIP table</strong>, <strong>Michelin reservation</strong>,
                    <strong>Mercedes S-Class chauffeur</strong>, <strong>luxury van</strong>, <strong>private jet</strong>, <strong>helicopter</strong>,
                    <strong>yacht</strong> or a romantic surprise? You’re in the right place.
                  </>
                )}
              </p>
            </div>

            <div className="space-y-4">
              <p>
                {isFR ? (
                  <>
                    Notre promesse : <strong>vous ne perdez pas de temps</strong>. Vous nous dites ce que vous voulez, nous vous répondons vite,
                    nous organisons, et vous profitez.  
                    Nous travaillons avec une logique simple : <strong>qualité, précision, confidentialité</strong>.
                  </>
                ) : (
                  <>
                    Our promise: <strong>you don’t waste time</strong>. Tell us what you want, we answer fast,
                    we arrange everything, you enjoy.  
                    We operate with a simple standard: <strong>quality, precision, confidentiality</strong>.
                  </>
                )}
              </p>

              <p className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                {isFR ? (
                  <>
                    <strong>Tout est possible :</strong> si ce n’est pas écrit, demandez.  
                    <strong>Achats</strong> : montres, bijoux, sacs, cadeaux, luxe, édition limitée, sourcing discret.
                  </>
                ) : (
                  <>
                    <strong>Everything is possible:</strong> if it’s not written, ask.  
                    <strong>Purchases</strong>: watches, jewelry, bags, gifts, luxury, limited editions, discreet sourcing.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO STRIP (4 photos 16:9) */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            {isFR ? "Moments Premium à Paris (exemples réels)" : "Premium Moments in Paris (real examples)"}
          </h2>
          <p className="mt-4 text-slate-600 max-w-3xl">
            {isFR
              ? "Ces visuels représentent les 4 univers majeurs : romantisme, aviation privée, nightlife select, yachting."
              : "These visuals represent the 4 main worlds: romance, private aviation, select nightlife, yachting."}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative h-[320px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/concierge/romantic-dinner.jpg"
                alt={isFR ? "Dîner romantique sur yacht au coucher du soleil à Paris" : "Romantic sunset dinner on a yacht in Paris"}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <div className="text-white font-semibold">
                  {isFR ? "Dîner romantique • Coucher du soleil • Vue iconique" : "Romantic dinner • Sunset • Iconic view"}
                </div>
                <div className="text-white/85 text-sm">
                  {isFR ? "Couples & célébrations" : "Couples & celebrations"}
                </div>
              </div>
            </div>

            <div className="relative h-[320px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/concierge/tarmac.jpg"
                alt={isFR ? "Jet privé et hélicoptère premium sur tarmac à Paris" : "Private jet and premium helicopter on tarmac in Paris"}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <div className="text-white font-semibold">
                  {isFR ? "Jet privé • Hélicoptère • Chauffeur" : "Private jet • Helicopter • Chauffeur"}
                </div>
                <div className="text-white/85 text-sm">
                  {isFR ? "Transferts & expériences" : "Transfers & experiences"}
                </div>
              </div>
            </div>

            <div className="relative h-[320px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/concierge/club.jpg"
                alt={isFR ? "Club privé select à Paris avec ambiance premium" : "Select private club in Paris with premium atmosphere"}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <div className="text-white font-semibold">
                  {isFR ? "Club Privé Select • Accès garanti • VIP" : "Select Private Club • Guaranteed access • VIP"}
                </div>
                <div className="text-white/85 text-sm">
                  {isFR ? "Couples & groupes" : "Couples & groups"}
                </div>
              </div>
            </div>

            <div className="relative h-[320px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/concierge/yacht.jpg"
                alt={isFR ? "Yacht premium à Paris sur la Seine" : "Premium yacht in Paris on the Seine"}
                fill
                className="object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                <div className="text-white font-semibold">
                  {isFR ? "Yacht • Service premium • Expérience privée" : "Yacht • Premium service • Private experience"}
                </div>
                <div className="text-white/85 text-sm">
                  {isFR ? "Dîner, croisière, événements" : "Dinner, cruise, events"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES – long SEO section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            {isFR ? "Services de Conciergerie Paris (liste complète)" : "Paris Concierge Services (full list)"}
          </h2>
          <p className="mt-4 text-slate-600 max-w-4xl">
            {isFR
              ? "Objectif : répondre à 100% des intentions de recherche. Si vous cherchez une conciergerie de luxe à Paris, voici exactement ce que nous organisons."
              : "Goal: match 100% of search intent. If you’re looking for a luxury concierge in Paris, here is exactly what we arrange."}
          </p>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-lg">
                {isFR ? "Aviation privée & hélicoptère" : "Private aviation & helicopter"}
              </h3>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• {isFR ? "Jet privé : aller simple, aller-retour, multi-destinations" : "Private jet: one-way, round-trip, multi-destination"}</li>
                <li>• {isFR ? "Hélicoptère : transferts, tours, expériences premium" : "Helicopter: transfers, tours, premium experiences"}</li>
                <li>• {isFR ? "Coordination bagages & timing" : "Luggage and timing coordination"}</li>
                <li>• {isFR ? "Accueil discret & assistance" : "Discreet welcome and assistance"}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-lg">
                {isFR ? "Transport de luxe (chauffeur)" : "Luxury transport (chauffeur)"}
              </h3>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• {isFR ? "Mercedes Classe S avec chauffeur" : "Mercedes S-Class with chauffeur"}</li>
                <li>• {isFR ? "Van premium pour groupes" : "Premium van for groups"}</li>
                <li>• {isFR ? "Transferts aéroport / hôtel / nightlife" : "Airport / hotel / nightlife transfers"}</li>
                <li>• {isFR ? "Ponctualité & confort" : "Punctuality and comfort"}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-lg">
                {isFR ? "Yacht & croisières privées" : "Yacht & private cruises"}
              </h3>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• {isFR ? "Yacht privé : soirée, dîner, événement" : "Private yacht: evening, dinner, event"}</li>
                <li>• {isFR ? "Options : chef, champagne, musique, photo/vidéo" : "Options: chef, champagne, music, photo/video"}</li>
                <li>• {isFR ? "Expérience romantique Tour Eiffel" : "Romantic Eiffel Tower experience"}</li>
                <li>• {isFR ? "Couples & groupes" : "Couples & groups"}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-lg">
                {isFR ? "Club privé select (accès garanti)" : "Select private club (guaranteed access)"}
              </h3>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• {isFR ? "Accès garanti selon disponibilité" : "Guaranteed access based on availability"}</li>
                <li>• {isFR ? "Tables VIP, bouteilles, accueil" : "VIP tables, bottles, hosting"}</li>
                <li>• {isFR ? "Couples & groupes" : "Couples & groups"}</li>
                <li>• {isFR ? "Sécurité & discrétion" : "Security and discretion"}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-lg">
                {isFR ? "Gastronomie & restaurants" : "Fine dining & restaurants"}
              </h3>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• {isFR ? "Réservations Michelin" : "Michelin reservations"}</li>
                <li>• {isFR ? "Tables difficiles & horaires premium" : "Hard-to-get tables and prime times"}</li>
                <li>• {isFR ? "Privatisation & dining privé" : "Buyouts and private dining"}</li>
                <li>• {isFR ? "Expériences romantiques" : "Romantic experiences"}</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 p-6">
              <h3 className="font-semibold text-lg">
                {isFR ? "Achats (montres, bijoux, sacs…)" : "Purchases (watches, jewelry, bags…)"}
              </h3>
              <ul className="mt-4 space-y-2 text-slate-700">
                <li>• {isFR ? "Montres de luxe & pièces rares" : "Luxury watches and rare pieces"}</li>
                <li>• {isFR ? "Haute joaillerie & bijoux" : "Fine jewelry and high jewelry"}</li>
                <li>• {isFR ? "Sacs de luxe & éditions limitées" : "Designer bags and limited editions"}</li>
                <li>• {isFR ? "Sourcing discret : demandez" : "Discreet sourcing: ask us"}</li>
              </ul>
            </div>
          </div>

          <div className="mt-10 rounded-2xl bg-slate-50 border border-slate-200 p-6">
            <h3 className="font-semibold text-lg">
              {isFR ? "Ce qui n’est pas écrit ici" : "What is not written here"}
            </h3>
            <p className="mt-2 text-slate-700">
              {isFR ? (
                <>
                  Si une chose n’est pas listée, <strong>vous demandez</strong> par email, téléphone ou chat.
                  Nous gérons aussi : cadeaux surprises, demandes privées, expériences rares, événements, personnalisation totale.
                </>
              ) : (
                <>
                  If something is not listed, <strong>ask</strong> by email, phone, or chat.
                  We also handle: surprise gifts, private requests, rare experiences, events, full customization.
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* INTERNATIONAL REVIEWS – expanded */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold">
            {isFR ? "Avis de voyageurs internationaux" : "International traveler reviews"}
          </h2>
          <p className="mt-4 text-slate-600 max-w-4xl">
            {isFR
              ? "Extraits de retours clients (style voyageur)."
              : "Selected client-style quotes from travelers."}
          </p>

          <div className="mt-10 grid md:grid-cols-2 gap-6">
            {[
              { flag: "🇺🇸", name: "Michael (USA)", textFR: "Service ultra pro. On a eu une soirée parfaite sans perdre de temps.", textEN: "Ultra professional. We had a perfect evening without wasting time." },
              { flag: "🇯🇵", name: "Kenji (Japan)", textFR: "Très discret, très rapide. Expérience vraiment premium.", textEN: "Very discreet, very fast. Truly premium experience." },
              { flag: "🇧🇷", name: "Rafael (Brazil)", textFR: "Tout était fluide : transport, club, dîner. Niveau luxe réel.", textEN: "Everything was seamless: transport, club, dinner. Real luxury." },
              { flag: "🇦🇪", name: "Omar (UAE)", textFR: "Discrétion totale et exécution parfaite. Je recommande.", textEN: "Total discretion and perfect execution. Highly recommended." },
              { flag: "🇦🇺", name: "Sophie (Australia)", textFR: "Paris sans stress. Ils gèrent, tu profites.", textEN: "Paris without stress. They handle it, you enjoy it." },
              { flag: "🇺🇸", name: "Ashley (USA)", textFR: "Le dîner sur yacht était incroyable. Très haut de gamme.", textEN: "The yacht dinner was incredible. Very high-end." },
            ].map((r) => (
              <div key={r.name} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-slate-900">{r.flag} {r.name}</div>
                  <div className="text-amber-500 text-sm">★★★★★</div>
                </div>
                <p className="mt-3 text-slate-700">
                  {isFR ? r.textFR : r.textEN}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ MASSIVE – IA friendly */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-center">
            {isFR ? "FAQ — Paris Concierge Service" : "FAQ — Paris Concierge Service"}
          </h2>

          <p className="mt-4 text-center text-slate-600">
            {isFR
              ? "Réponses directes, optimisées pour la recherche et les assistants IA."
              : "Direct answers, optimized for search and AI assistants."}
          </p>

          <div className="mt-12 space-y-8 text-slate-700 leading-relaxed">
            <FAQ
              q={isFR ? "Travaillez-vous avec des couples et des groupes ?" : "Do you work with couples and groups?"}
              a={isFR
                ? "Oui. Le Club Privé Select est pensé pour les couples ET les groupes. Nous gérons aussi anniversaires, EVJF/EVG, événements privés."
                : "Yes. Select Private Club Access is built for couples and groups. We also handle birthdays, bachelor/bachelorette trips, and private events."}
            />
            <FAQ
              q={isFR ? "L’accès club privé est-il vraiment garanti ?" : "Is private club access truly guaranteed?"}
              a={isFR
                ? "Nous travaillons avec des circuits premium. L’accès est “garanti” selon disponibilité et conditions du jour. Objectif : vous faire entrer sans stress."
                : "We work through premium networks. Access is “guaranteed” based on availability and nightly conditions. Goal: you get in without stress."}
            />
            <FAQ
              q={isFR ? "Pouvez-vous organiser un jet privé et un hélicoptère ?" : "Can you arrange a private jet and a helicopter?"}
              a={isFR
                ? "Oui. Jet privé (itinéraire sur mesure) + hélicoptère (transfert / expérience) avec coordination complète."
                : "Yes. Private jet (tailored itinerary) + helicopter (transfer / experience) with full coordination."}
            />
            <FAQ
              q={isFR ? "Proposez-vous un chauffeur Mercedes Classe S ?" : "Do you provide a Mercedes S-Class chauffeur?"}
              a={isFR
                ? "Oui. Mercedes Classe S avec chauffeur, et aussi van premium pour groupes."
                : "Yes. Mercedes S-Class with chauffeur, and premium vans for groups."}
            />
            <FAQ
              q={isFR ? "Yacht à Paris : dîner romantique et croisière possible ?" : "Yacht in Paris: romantic dinner and cruise possible?"}
              a={isFR
                ? "Oui. Dîner romantique, coucher du soleil, itinéraire, options chef, champagne, photo/vidéo."
                : "Yes. Romantic dinner, sunset timing, route planning, options like chef, champagne, photo/video."}
            />
            <FAQ
              q={isFR ? "Est-ce discret ?" : "Is it discreet?"}
              a={isFR
                ? "Oui. Discrétion et confidentialité font partie du service."
                : "Yes. Discretion and privacy are core to the service."}
            />
            <FAQ
              q={isFR ? "Pouvez-vous acheter des montres, bijoux, sacs ?" : "Can you purchase watches, jewelry, bags?"}
              a={isFR
                ? "Oui. Montres de luxe, bijoux, sacs, cadeaux, sourcing discret. Vous demandez par email, téléphone ou chat."
                : "Yes. Luxury watches, jewelry, bags, gifts, discreet sourcing. Ask by email, phone, or chat."}
            />
            <FAQ
              q={isFR ? "Si ce n’est pas écrit sur la page ?" : "If it’s not written on the page?"}
              a={isFR
                ? "On vous le fait. Vous demandez par email, téléphone ou chat, et nous répondons vite."
                : "We can do it. Ask by email, phone, or chat, and we respond fast."}
            />
            <FAQ
              q={isFR ? "Comment vous contacter ?" : "How do we contact you?"}
              a={isFR
                ? `Téléphone : ${PHONE_DISPLAY}. Email : ${EMAIL}. Chat : ${CHAT_URL}.`
                : `Phone: ${PHONE_DISPLAY}. Email: ${EMAIL}. Chat: ${CHAT_URL}.`}
            />
          </div>

          <div className="mt-14 text-center text-slate-600">
            <p className="font-semibold text-slate-900">
              {isFR ? "Contact direct" : "Direct contact"}
            </p>
            <p className="mt-2">
              <a className="underline" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>{" "}
              •{" "}
              <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>{" "}
              •{" "}
              <a className="underline" href={CHAT_URL}>{isFR ? "Chat" : "Chat"}</a>
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="text-white font-semibold">{BRAND}</div>
              <p className="mt-3 text-sm text-slate-400">
                {isFR
                  ? "Conciergerie de luxe à Paris • Couples & Groupes • Discrétion • Exécution premium"
                  : "Luxury concierge in Paris • Couples & Groups • Discretion • Premium execution"}
              </p>
            </div>

            <div>
              <div className="text-white font-semibold">{isFR ? "Contact" : "Contact"}</div>
              <p className="mt-3 text-sm">
                <a className="underline" href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a>
              </p>
              <p className="mt-2 text-sm">
                <a className="underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </p>
              <p className="mt-2 text-sm">
                <a className="underline" href={CHAT_URL}>{isFR ? "Écrire sur le chat" : "Message us on chat"}</a>
              </p>
            </div>

            <div>
              <div className="text-white font-semibold">{isFR ? "Note" : "Note"}</div>
              <p className="mt-3 text-sm text-slate-400">
                {isFR
                  ? "Si une prestation n’est pas listée : demandez. Achats possibles (montres, bijoux, sacs), sourcing discret."
                  : "If a service is not listed: ask. Purchases possible (watches, jewelry, bags), discreet sourcing."}
              </p>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10 text-center text-xs text-slate-500">
            © 2026 PANORAMA GRUP. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQ({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-6">
      <h3 className="font-semibold text-slate-900">{q}</h3>
      <p className="mt-2 text-slate-700">{a}</p>
    </div>
  );
}
