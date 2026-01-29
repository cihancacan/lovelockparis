import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
  Crown,
  Phone,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  MapPin,
  Calendar,
  Car,
  Plane,
  Helicopter,
  Ship,
  Building2,
  Users,
  Wine,
  Music,
  CheckCircle2,
  ArrowRight,
  Lock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { params: { locale: string } };

// ✅ SEO (tu peux laisser layout gérer le global, ici c’est spécifique page)
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = params.locale || "en";
  const baseUrl = "https://lovelockparis.com";
  const url = `${baseUrl}/${locale}/paris-concierge-service`;

  const fr = {
    title: "Paris Concierge Service | Conciergerie VIP Paris (Couples & Groupes) – LoveLockParis",
    desc:
      "Conciergerie VIP à Paris : chauffeur, voitures premium, jet privé, avion, hélicoptère, yacht, hôtels 5★, appartements d’exception, réservations restaurants, clubs privés accès garanti, événements entreprise, séminaires, groupes. Réponse rapide.",
    keywords: [
      "paris concierge service",
      "conciergerie paris",
      "conciergerie vip paris",
      "luxury concierge paris",
      "paris couple concierge",
      "romantic concierge paris",
      "chauffeur paris",
      "jet privé paris",
      "helicoptere paris",
      "yacht paris",
      "reservation restaurant paris",
      "club privé paris accès garanti",
      "organisation evenement paris",
      "seminaire entreprise paris",
      "service premium paris",
    ],
  };

  const en = {
    title: "Paris Concierge Service | VIP Concierge in Paris (Couples & Groups) – LoveLockParis",
    desc:
      "VIP concierge in Paris: chauffeur, premium cars, private jet, airplane, helicopter, yacht, 5★ hotels, exceptional apartments, restaurant bookings, private clubs with guaranteed access, corporate events, seminars, group logistics. Fast response.",
    keywords: [
      "paris concierge service",
      "vip concierge paris",
      "luxury concierge paris",
      "couple concierge paris",
      "group concierge paris",
      "chauffeur service paris",
      "private jet paris",
      "helicopter paris",
      "yacht charter paris",
      "restaurant reservation paris",
      "private club paris guaranteed access",
      "corporate event planning paris",
      "seminar booking paris",
    ],
  };

  const t = locale === "fr" ? fr : en;

  return {
    title: t.title,
    description: t.desc,
    keywords: t.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: t.title,
      description: t.desc,
      url,
      siteName: "LoveLockParis",
      type: "website",
      images: [
        {
          url: `${baseUrl}/images/concierge/og-concierge.jpg`,
          width: 1200,
          height: 630,
          alt: "Paris Concierge Service",
        },
      ],
    },
  };
}

function tCopy(locale: string) {
  const isFr = locale === "fr";
  return {
    k1: isFr ? "Conciergerie VIP" : "VIP Concierge",
    title: isFr ? "Paris Concierge Service" : "Paris Concierge Service",
    subtitle: isFr
      ? "Couples & Groupes • Accès privilégié • Organisation complète • Discrétion totale"
      : "Couples & Groups • Priority access • Full planning • Total discretion",
    ctaPrimary: isFr ? "Demander un concierge privé" : "Request a private concierge",
    ctaSecondary: isFr ? "Voir les services" : "Explore services",
    trustLine: isFr
      ? "Réponse rapide • Service premium • Couverture Paris + destinations (ski, Côte d’Azur, etc.)"
      : "Fast response • Premium service • Paris + destinations (ski, French Riviera, etc.)",
    formTitle: isFr ? "Décrivez votre demande" : "Tell us what you need",
    formNote: isFr
      ? "Notre équipe répond rapidement. Vous pouvez aussi écrire sur WhatsApp."
      : "Our team replies quickly. You can also message us on WhatsApp.",
    fieldName: isFr ? "Nom" : "Name",
    fieldEmail: isFr ? "Email" : "Email",
    fieldPhone: isFr ? "Téléphone" : "Phone",
    fieldDates: isFr ? "Dates (optionnel)" : "Dates (optional)",
    fieldBudget: isFr ? "Budget (optionnel)" : "Budget (optional)",
    fieldDetails: isFr ? "Votre demande" : "Your request",
    send: isFr ? "Envoyer la demande" : "Send request",
    whatsapp: isFr ? "WhatsApp" : "WhatsApp",
    call: isFr ? "Appeler" : "Call",
    email: isFr ? "Email" : "Email",
    backToLocks: isFr ? "Retour aux cadenas" : "Back to Love Locks",
  };
}

export default async function ParisConciergeServicePage({ params }: Props) {
  const locale = params.locale || "en";
  const C = tCopy(locale);

  // ✅ JSON-LD IA-friendly : LocalBusiness + Service
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "LoveLockParis – Paris Concierge Service",
    url: `https://lovelockparis.com/${locale}/paris-concierge-service`,
    image: "https://lovelockparis.com/images/concierge/og-concierge.jpg",
    telephone: "+33 1 88 84 22 22",
    email: "concierge@lovelockparis.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      postalCode: "75006",
      addressCountry: "FR",
    },
    areaServed: ["Paris", "France", "Europe"],
    priceRange: "$$$$",
    knowsAbout: [
      "Luxury concierge",
      "Private transfers",
      "Private aviation",
      "Helicopter services",
      "Yacht charter",
      "Hotel booking",
      "Restaurant reservations",
      "Private clubs access",
      "Corporate events",
      "Group logistics",
    ],
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Chauffeur & Luxury Cars" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private Jet & Airplane" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Helicopter Transfers" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Yacht / Boat Charter" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hotels, Villas, Chalets, Exceptional Apartments" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Restaurant Reservations" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Private Clubs – Guaranteed Access" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Corporate Events & Seminars (venues + logistics)" } },
      { "@type": "Offer", itemOffered: { "@type": "Service", name: "Coach / Bus for Groups" } },
    ],
  };

  // WhatsApp (numéro sans espaces)
  const whatsappNumber = "33188842222";
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    locale === "fr"
      ? "Bonjour, je souhaite un concierge privé à Paris. Voici ma demande :"
      : "Hello, I’d like a private concierge in Paris. Here is my request:"
  )}`;

  // mailto pré-rempli
  const mailtoHref = `mailto:concierge@lovelockparis.com?subject=${encodeURIComponent(
    "Paris Concierge Service – Request"
  )}&body=${encodeURIComponent(
    locale === "fr"
      ? "Bonjour,\n\nJe souhaite une conciergerie VIP à Paris.\n\nDétails :\n- Dates :\n- Nombre de personnes :\n- Services souhaités (chauffeur/jet/hôtel/restaurants/clubs/événement/groupe) :\n- Budget :\n\nMerci"
      : "Hello,\n\nI’d like VIP concierge assistance in Paris.\n\nDetails:\n- Dates:\n- Number of guests:\n- Services needed (chauffeur/jet/hotel/restaurants/clubs/event/group):\n- Budget:\n\nThank you"
  )}`;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ✅ WhatsApp floating (left) */}
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="fixed left-4 bottom-4 z-[60] flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-2xl hover:bg-emerald-700 transition"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="font-bold text-sm">{C.whatsapp}</span>
      </a>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* ✅ Remplace l’image quand tu veux (premium) */}
          <Image
            src="/images/concierge/hero.jpg"
            alt="Paris VIP concierge service for couples and groups"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 sm:py-20 lg:py-24">
          <div className="max-w-5xl">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <Badge className="bg-white/15 text-white border border-white/25 backdrop-blur-md">
                <Crown className="h-3.5 w-3.5 mr-2" />
                {C.k1}
              </Badge>
              <Badge className="bg-white/10 text-white border border-white/20 backdrop-blur-md">
                <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-300" />
                {locale === "fr" ? "Discrétion & Accès" : "Discretion & Access"}
              </Badge>
              <Badge className="bg-white/10 text-white border border-white/20 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 mr-2 text-rose-300" />
                {locale === "fr" ? "Couples & Groupes" : "Couples & Groups"}
              </Badge>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.05] drop-shadow-2xl">
              {C.title}
            </h1>

            <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-100 max-w-3xl leading-relaxed">
              {C.subtitle}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="#request">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-[#e11d48] to-rose-600 hover:from-rose-700 hover:to-[#be123c] text-white font-bold rounded-full shadow-2xl px-8"
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  {C.ctaPrimary}
                </Button>
              </a>
              <a href="#services">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-white/10 border-white/40 text-white hover:bg-white hover:text-slate-900 font-bold rounded-full px-8"
                >
                  {C.ctaSecondary}
                </Button>
              </a>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-white/90 text-xs sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                {C.trustLine}
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-300" />
                <a className="underline underline-offset-4" href="tel:+33188842222">
                  +33 1 88 84 22 22
                </a>
              </span>
              <span className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-300" />
                <a className="underline underline-offset-4" href={mailtoHref}>
                  concierge@lovelockparis.com
                </a>
              </span>
            </div>

            <div className="mt-10">
              <Link
                href={`/${locale}`}
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition"
              >
                <Lock className="h-4 w-4" />
                <span className="text-sm font-bold">{C.backToLocks}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-14 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                {locale === "fr" ? "Services Concierge Premium à Paris" : "Premium Concierge Services in Paris"}
              </h2>
              <p className="mt-3 text-slate-600 max-w-3xl mx-auto">
                {locale === "fr"
                  ? "Une seule équipe pour tout orchestrer : transport, hébergement, réservations, accès VIP, logistique groupes, événements entreprise."
                  : "One team to orchestrate everything: transportation, stays, bookings, VIP access, group logistics, corporate events."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                      <Car className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Chauffeur & véhicules" : "Chauffeur & vehicles"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Berlines premium, van, SUV" : "Premium sedans, van, SUV"}</li>
                    <li>• {locale === "fr" ? "Disposition à l’heure / journée" : "Hourly / full-day availability"}</li>
                    <li>• {locale === "fr" ? "Transferts aéroports & longue distance" : "Airport transfers & long distance"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                      <Plane className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Jet privé & avion" : "Private jet & airplane"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Jets privés, vols sur mesure" : "Private jets, tailored flights"}</li>
                    <li>• {locale === "fr" ? "Gestion timing & coordination" : "Timing & coordination management"}</li>
                    <li>• {locale === "fr" ? "Couples & groupes" : "Couples & groups"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-700">
                      <Helicopter className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Hélicoptère" : "Helicopter"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Transferts & expériences panoramiques" : "Transfers & panoramic experiences"}</li>
                    <li>• {locale === "fr" ? "Organisation complète" : "End-to-end coordination"}</li>
                    <li>• {locale === "fr" ? "Option romantique & corporate" : "Romantic & corporate options"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700">
                      <Ship className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Yacht / bateau privé" : "Yacht / private boat"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Yacht privé, croisière, expérience VIP" : "Private yacht, cruise, VIP experience"}</li>
                    <li>• {locale === "fr" ? "Chef, musique, planning" : "Chef, music, planning"}</li>
                    <li>• {locale === "fr" ? "Paris + destinations" : "Paris + destinations"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-700">
                      <Building2 className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Hôtels & biens d’exception" : "Hotels & exceptional stays"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Hôtels 5★, hôtel particulier" : "5★ hotels, private mansions"}</li>
                    <li>• {locale === "fr" ? "Appartement d’exception" : "Exceptional apartments"}</li>
                    <li>• {locale === "fr" ? "Chalet (ski), villas" : "Ski chalets, villas"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-700">
                      <Wine className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Restaurants & tables" : "Restaurants & tables"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Réservations prioritaires" : "Priority reservations"}</li>
                    <li>• {locale === "fr" ? "Tables romantiques & groupes" : "Romantic tables & groups"}</li>
                    <li>• {locale === "fr" ? "Préférences & allergies gérées" : "Preferences & allergies handled"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition lg:col-span-2">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <Music className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr"
                        ? "Clubs privés (accès garanti) — Couples & Groupes"
                        : "Private clubs (guaranteed access) — Couples & Groups"}
                    </h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li>• {locale === "fr" ? "Accès select (couples, groupes)" : "Select access (couples, groups)"}</li>
                      <li>• {locale === "fr" ? "Réservation + coordination entrée" : "Booking + entry coordination"}</li>
                      <li>• {locale === "fr" ? "Option table & service premium" : "Table options & premium service"}</li>
                    </ul>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li>• {locale === "fr" ? "Planning soirée complet" : "Full night planning"}</li>
                      <li>• {locale === "fr" ? "Transport retour sécurisé" : "Safe return transport"}</li>
                      <li>• {locale === "fr" ? "Discrétion & confidentialité" : "Discretion & confidentiality"}</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700">
                      <Users className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Groupes & logistique" : "Groups & logistics"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Réservation de car (bus)" : "Coach / bus booking"}</li>
                    <li>• {locale === "fr" ? "Hôtels pour groupes" : "Hotels for groups"}</li>
                    <li>• {locale === "fr" ? "Coordination multi-activités" : "Multi-activity coordination"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-700">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Événements entreprise" : "Corporate events"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Séminaires & réservations hôtels" : "Seminars & hotel blocks"}</li>
                    <li>• {locale === "fr" ? "Lieux emblématiques (booking)" : "Iconic venues (booking)"}</li>
                    <li>• {locale === "fr" ? "Transport, restauration, planning" : "Transport, catering, scheduling"}</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg hover:shadow-xl transition">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {locale === "fr" ? "Parcours & demandes sur mesure" : "Routes & custom requests"}
                    </h3>
                  </div>
                  <ul className="text-sm text-slate-700 space-y-2">
                    <li>• {locale === "fr" ? "Couples : romantique, surprise, demande" : "Couples: romantic, surprise, proposal"}</li>
                    <li>• {locale === "fr" ? "Groupes : planning & timing" : "Groups: planning & timing"}</li>
                    <li>• {locale === "fr" ? "Un point de contact unique" : "One single point of contact"}</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* CTA strip */}
            <div className="mt-10 sm:mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold">
                    {locale === "fr" ? "Besoin d’un accès VIP cette semaine ?" : "Need VIP access this week?"}
                  </h3>
                  <p className="text-slate-300 mt-2">
                    {locale === "fr"
                      ? "Décris ta demande — on revient vers toi rapidement avec une proposition claire."
                      : "Describe your request — we’ll reply quickly with a clear plan."}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <a href="#request" className="w-full sm:w-auto">
                    <Button className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-full px-8">
                      {C.ctaPrimary}
                    </Button>
                  </a>
                  <a href={whatsappHref} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      className="w-full bg-white/5 border-white/25 text-white hover:bg-white hover:text-slate-900 font-bold rounded-full px-8"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {C.whatsapp}
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REQUEST FORM */}
      <section id="request" className="py-14 sm:py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900">
                {C.formTitle}
              </h2>
              <p className="mt-3 text-slate-600 max-w-xl">{C.formNote}</p>

              <div className="mt-6 space-y-3 text-sm">
                <a href="tel:+33188842222" className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 transition">
                  <div className="h-11 w-11 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{C.call}</div>
                    <div className="text-slate-600">+33 1 88 84 22 22</div>
                  </div>
                </a>

                <a href={mailtoHref} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50 transition">
                  <div className="h-11 w-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{C.email}</div>
                    <div className="text-slate-600">concierge@lovelockparis.com</div>
                  </div>
                </a>

                <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 transition">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{C.whatsapp}</div>
                    <div className="text-slate-600">{locale === "fr" ? "Réponse rapide" : "Fast reply"}</div>
                  </div>
                </a>
              </div>

              <div className="mt-8">
                <p className="text-xs text-slate-500">
                  {locale === "fr"
                    ? "Astuce SEO/IA : cette page est pensée pour répondre clairement aux intentions “paris concierge service / conciergerie VIP Paris / couples / groupes”."
                    : "SEO/AI tip: this page is built to answer search intent for “paris concierge service / VIP concierge Paris / couples / groups”."}
                </p>
              </div>
            </div>

            {/* ✅ Form simple (mailto) — si tu veux du POST API plus tard, je te le fais */}
            <Card className="border-2 border-slate-100 shadow-2xl rounded-3xl overflow-hidden">
              <CardContent className="p-6 sm:p-8">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget as HTMLFormElement;
                    const data = new FormData(form);

                    const name = String(data.get("name") || "");
                    const email = String(data.get("email") || "");
                    const phone = String(data.get("phone") || "");
                    const dates = String(data.get("dates") || "");
                    const budget = String(data.get("budget") || "");
                    const details = String(data.get("details") || "");

                    const body = [
                      `Name: ${name}`,
                      `Email: ${email}`,
                      `Phone: ${phone}`,
                      `Dates: ${dates}`,
                      `Budget: ${budget}`,
                      "",
                      "Request:",
                      details,
                    ].join("\n");

                    const href = `mailto:concierge@lovelockparis.com?subject=${encodeURIComponent(
                      "Paris Concierge Service – Request"
                    )}&body=${encodeURIComponent(body)}`;

                    window.location.href = href;
                  }}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-900">{C.fieldName}</label>
                      <input
                        name="name"
                        required
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400"
                        placeholder={locale === "fr" ? "Votre nom" : "Your name"}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-900">{C.fieldEmail}</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-bold text-slate-900">{C.fieldPhone}</label>
                      <input
                        name="phone"
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400"
                        placeholder="+33 ..."
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-900">{C.fieldDates}</label>
                      <input
                        name="dates"
                        className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400"
                        placeholder={locale === "fr" ? "Ex: 12–15 février" : "e.g. Feb 12–15"}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-900">{C.fieldBudget}</label>
                    <input
                      name="budget"
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400"
                      placeholder={locale === "fr" ? "Optionnel" : "Optional"}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-slate-900">{C.fieldDetails}</label>
                    <textarea
                      name="details"
                      required
                      rows={6}
                      className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-rose-400"
                      placeholder={
                        locale === "fr"
                          ? "Ex: chauffeur + dîner romantique + club privé accès garanti + hôtel 5★…"
                          : "e.g. chauffeur + romantic dinner + private club guaranteed access + 5★ hotel…"
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#e11d48] to-rose-600 hover:from-rose-700 hover:to-[#be123c] text-white font-bold rounded-2xl py-6 shadow-xl"
                  >
                    <Mail className="h-5 w-5 mr-2" />
                    {C.send}
                  </Button>

                  <p className="text-xs text-slate-500 text-center">
                    {locale === "fr"
                      ? "En envoyant, vous contactez directement notre équipe concierge."
                      : "By sending, you contact our concierge team directly."}
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-6xl mx-auto mt-12 text-center">
            <p className="text-sm text-slate-600">
              {locale === "fr"
                ? "Astuce SEO : ajoute aussi le lien vers cette page dans le menu et le footer pour pousser l’autorité interne."
                : "SEO tip: add this page link in menu + footer to boost internal authority."}
            </p>
            <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/${locale}/boost`}>
                <Button variant="outline" className="rounded-full">
                  {locale === "fr" ? "Boost Visibility" : "Boost Visibility"}
                </Button>
              </Link>
              <Link href={`/${locale}/marketplace`}>
                <Button variant="outline" className="rounded-full">
                  {locale === "fr" ? "Marketplace" : "Marketplace"}
                </Button>
              </Link>
              <Link href={`/${locale}/purchase`}>
                <Button className="rounded-full bg-[#e11d48] hover:bg-[#be123c] text-white font-bold">
                  {locale === "fr" ? "Sécuriser un cadenas" : "Secure a lock"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
