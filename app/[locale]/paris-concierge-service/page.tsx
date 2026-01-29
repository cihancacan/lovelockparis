import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Crown,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Music,
  Navigation,
  Phone,
  Plane,
  ShieldCheck,
  Ship,
  Sparkles,
  Users,
  Wine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/home/header";

export default async function ParisConciergeServicePage({
  params,
}: {
  params: { locale: string };
}) {
  const t = await getTranslations("home"); // tu peux aussi créer un namespace "concierge" si tu veux
  const locale = params.locale;

  const isFr = locale === "fr";
  const isZh = locale === "zh-CN";

  const copy = {
    eyebrow: isFr
      ? "Paris Concierge Service • Club privé • Accès garanti"
      : isZh
      ? "巴黎高端礼宾服务 • 私人俱乐部 • 保证入场"
      : "Paris Concierge Service • Private Club • Guaranteed Access",
    h1a: isFr ? "Paris" : isZh ? "巴黎" : "Paris",
    h1b: isFr
      ? "Concierge Service"
      : isZh
      ? "高端礼宾服务"
      : "Concierge Service",
    sub: isFr
      ? "Expériences premium sur-mesure : couples & groupes. Club privé select (accès garanti), jets privés, avion, hélicoptère, chauffeur, yacht, restaurants et événements."
      : isZh
      ? "为情侣与团体定制的高端体验：精选私人俱乐部（保证入场）、私人飞机、直升机、豪车接送、游艇、餐厅与活动。"
      : "Premium tailor-made experiences for couples & groups: select private club (guaranteed access), private jets, flights, helicopter transfers, chauffeur, yacht, restaurants & events.",
    cta1: isFr ? "Contacter le Concierge" : isZh ? "联系礼宾团队" : "Contact Concierge",
    cta2: isFr ? "Voir LoveLockParis" : isZh ? "查看 LoveLockParis" : "Explore LoveLockParis",
    emailLabel: isFr ? "Email direct" : isZh ? "邮箱" : "Direct email",
    email: "concierge@lovelockparis.com",
    phoneLabel: isFr ? "Téléphone" : isZh ? "电话" : "Phone",
    phone: "+33 6 00 00 00 00",
    availability: isFr
      ? "Réponse rapide • 7j/7"
      : isZh
      ? "快速回复 • 7天/周"
      : "Fast reply • 7 days/week",
    trust1: isFr ? "Accès garanti" : isZh ? "保证入场" : "Guaranteed access",
    trust2: isFr ? "Couples & groupes" : isZh ? "情侣与团体" : "Couples & groups",
    trust3: isFr ? "Discrétion" : isZh ? "高度保密" : "Discretion",
    trust4: isFr ? "Premium only" : isZh ? "仅限高端" : "Premium only",
  };

  // Structured data SEO (Service + Org + FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "LoveLockParis",
        url: "https://lovelockparis.com",
        logo: "https://lovelockparis.com/logo.png",
        sameAs: [
          "https://www.instagram.com/lovelockparis",
          "https://www.facebook.com/lovelockparis",
          "https://twitter.com/lovelockparis",
        ],
      },
      {
        "@type": "Service",
        name: "Paris Concierge Service (LoveLockParis)",
        serviceType: "Luxury concierge service",
        provider: {
          "@type": "Organization",
          name: "LoveLockParis",
          url: "https://lovelockparis.com",
        },
        areaServed: {
          "@type": "City",
          name: "Paris",
          addressCountry: "FR",
        },
        availableChannel: [
          {
            "@type": "ServiceChannel",
            serviceUrl: "https://lovelockparis.com/paris-concierge-service",
            availableLanguage: ["fr", "en", "zh-CN"],
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: isFr
              ? "Le club privé est-il accessible aux couples et aux groupes ?"
              : isZh
              ? "私人俱乐部是否支持情侣与团体？"
              : "Is the private club available for couples and groups?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFr
                ? "Oui. Notre offre est conçue pour les couples et les groupes, avec un accès garanti selon disponibilité et conditions."
                : isZh
                ? "是的。我们的服务适用于情侣与团体，并可在满足条件与库存的情况下提供保证入场。"
                : "Yes. Our offer is built for couples and groups, with guaranteed access subject to availability and conditions.",
            },
          },
          {
            "@type": "Question",
            name: isFr
              ? "Quels transferts premium proposez-vous ?"
              : isZh
              ? "你们提供哪些高端交通方式？"
              : "Which premium transfers do you offer?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFr
                ? "Jet privé, avion, transferts hélicoptère, chauffeur (car), et yacht selon votre programme."
                : isZh
                ? "私人飞机、航班、直升机接送、豪车司机接送、游艇等。"
                : "Private jet, flights, helicopter transfers, chauffeur car services, and yacht options depending on your plan.",
            },
          },
          {
            "@type": "Question",
            name: isFr
              ? "Comment faire une demande ?"
              : isZh
              ? "如何提交需求？"
              : "How do I request a booking?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFr
                ? "Contactez-nous par email avec vos dates, le nombre de personnes, et vos souhaits. Nous vous répondons rapidement."
                : isZh
                ? "通过邮箱告知日期、人数与需求，我们会尽快回复。"
                : "Email us with your dates, group size, and requests. We reply fast.",
            },
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header
        translations={{
          navBridge: t("nav.bridge"),
          problemHeading: t("problem.heading"),
          solutionHeading: t("solution.heading"),
          ctaStart: t("cta.start"),
        }}
      />

      <main>
        {/* HERO */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-0 pb-0 md:pt-8">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/paris-concierge-hero.jpg"
              alt="Paris Concierge Service by LoveLockParis — luxury experiences, private club access, chauffeur, yacht, jet"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8 pt-4 md:pt-20 px-2 sm:px-4">
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/15 backdrop-blur-lg border-2 border-white/25 text-white shadow-2xl">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#e11d48]" />
                <span className="text-[11px] sm:text-[12px] md:text-xs font-bold tracking-wider uppercase">
                  {copy.eyebrow}
                </span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-[1.1] text-white drop-shadow-2xl px-2">
              {copy.h1a}{" "}
              <span className="text-[#e11d48]">{copy.h1b}</span>
            </h1>

            <div className="max-w-4xl mx-auto">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-slate-100 leading-relaxed drop-shadow-lg font-medium px-4">
                {copy.sub}
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center pt-0 w-full max-w-xl mx-auto sm:max-w-none px-2">
              <a
                href={`mailto:${copy.email}?subject=${encodeURIComponent(
                  "Paris Concierge Service — Request"
                )}`}
                className="w-full sm:w-auto"
              >
                <Button
                  size="lg"
                  className="w-full text-base sm:text-lg md:text-xl px-4 sm:px-8 md:px-10 py-4 sm:py-6 md:py-7 bg-gradient-to-r from-[#e11d48] to-rose-600 hover:from-rose-700 hover:to-[#be123c] text-white font-bold rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-[#e11d48]/50 border-none"
                >
                  <Mail className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  {copy.cta1}
                </Button>
              </a>

              <Link href="/" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full text-base sm:text-lg md:text-xl px-4 sm:px-8 md:px-10 py-4 sm:py-6 md:py-7 bg-white/12 backdrop-blur-md border-2 border-white/60 text-white hover:bg-white hover:text-slate-900 font-bold rounded-full"
                >
                  <Lock className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  {copy.cta2}
                </Button>
              </Link>
            </div>

            {/* Trust chips */}
            <div className="pt-4 sm:pt-6">
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 text-white/90 text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  {copy.trust1}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-300" />
                  {copy.trust2}
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-300" />
                  {copy.trust3}
                </span>
                <span className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-purple-300" />
                  {copy.trust4}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT STRIP */}
        <section className="py-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-5 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-rose-300" />
                  <div className="text-left">
                    <div className="text-xs text-slate-300">{copy.emailLabel}</div>
                    <a
                      className="font-bold hover:text-rose-200"
                      href={`mailto:${copy.email}`}
                    >
                      {copy.email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-5 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-amber-300" />
                  <div className="text-left">
                    <div className="text-xs text-slate-300">{copy.phoneLabel}</div>
                    <a className="font-bold hover:text-amber-200" href={`tel:${copy.phone}`}>
                      {copy.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10 rounded-2xl">
                <CardContent className="p-5 flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-emerald-300" />
                  <div className="text-left">
                    <div className="text-xs text-slate-300">
                      {isFr ? "Disponibilité" : isZh ? "可用性" : "Availability"}
                    </div>
                    <div className="font-bold">{copy.availability}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-14 sm:py-18 md:py-22 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10 sm:mb-14">
              <Badge className="bg-rose-100 text-rose-800 border-rose-200">
                {isFr ? "Services premium" : isZh ? "高端服务" : "Premium Services"}
              </Badge>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {isFr
                  ? "Tout Paris. Sans friction."
                  : isZh
                  ? "巴黎一切安排，毫不费力。"
                  : "All of Paris. Zero friction."}
              </h2>
              <p className="mt-3 text-slate-600 max-w-3xl mx-auto">
                {isFr
                  ? "Vous nous donnez l’objectif. On s’occupe du reste : accès, logistique, timing, discrétion."
                  : isZh
                  ? "告诉我们目标，我们负责其余：入场、行程、时间与保密。"
                  : "Tell us the outcome. We handle access, logistics, timing and discretion."}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-2 border-slate-100 shadow-lg rounded-3xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4">
                    <Crown className="h-6 w-6 text-[#e11d48]" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    {isFr ? "Club privé select" : isZh ? "精选私人俱乐部" : "Select private club"}
                  </h3>
                  <p className="text-slate-600 mt-2">
                    {isFr
                      ? "Accès garanti pour couples et groupes, selon conditions."
                      : isZh
                      ? "情侣与团体保证入场（需满足条件）。"
                      : "Guaranteed access for couples and groups, subject to conditions."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg rounded-3xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <Plane className="h-6 w-6 text-blue-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    {isFr ? "Jet / Avion" : isZh ? "私人飞机/航班" : "Jet / Flights"}
                  </h3>
                  <p className="text-slate-600 mt-2">
                    {isFr
                      ? "Vols privés, coordination, slots et services VIP."
                      : isZh
                      ? "私人航班安排、时段协调与VIP服务。"
                      : "Private flights, coordination, slots and VIP services."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg rounded-3xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4">
                    <Navigation className="h-6 w-6 text-emerald-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    {isFr ? "Hélicoptère" : isZh ? "直升机" : "Helicopter"}
                  </h3>
                  <p className="text-slate-600 mt-2">
                    {isFr
                      ? "Transferts rapides, survol, arrivée iconique."
                      : isZh
                      ? "快速接送、俯瞰巴黎、标志性抵达。"
                      : "Fast transfers, aerial views, iconic arrivals."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg rounded-3xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                    <Car className="h-6 w-6 text-slate-900" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    {isFr ? "Chauffeur & Car" : isZh ? "豪车司机接送" : "Chauffeur & Car"}
                  </h3>
                  <p className="text-slate-600 mt-2">
                    {isFr
                      ? "Déplacements fluides, discret, premium."
                      : isZh
                      ? "顺畅出行，高度保密，优雅体验。"
                      : "Seamless transfers, discreet, premium."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg rounded-3xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 flex items-center justify-center mb-4">
                    <Ship className="h-6 w-6 text-cyan-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    {isFr ? "Yacht" : isZh ? "游艇" : "Yacht"}
                  </h3>
                  <p className="text-slate-600 mt-2">
                    {isFr
                      ? "Croisière privée, dîner, coucher de soleil."
                      : isZh
                      ? "私人游船、晚宴、日落体验。"
                      : "Private cruise, dinner, sunset moments."}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-slate-100 shadow-lg rounded-3xl hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center mb-4">
                    <Wine className="h-6 w-6 text-amber-700" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl">
                    {isFr ? "Dîners & tables" : isZh ? "餐厅与晚宴" : "Dining & tables"}
                  </h3>
                  <p className="text-slate-600 mt-2">
                    {isFr
                      ? "Réservations difficiles, expériences signature."
                      : isZh
                      ? "热门餐厅预订与定制体验。"
                      : "Hard-to-get bookings, signature experiences."}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${copy.email}?subject=${encodeURIComponent(
                  "Paris Concierge Service — Request"
                )}`}
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto bg-gradient-to-r from-[#e11d48] to-rose-600 hover:from-rose-700 hover:to-[#be123c] text-white font-bold rounded-full px-8 py-6 shadow-xl">
                  {copy.cta1} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <Link href="/purchase" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full px-8 py-6 border-2"
                >
                  {isFr ? "Découvrir Love Lock" : isZh ? "了解 Love Lock" : "Discover Love Lock"}{" "}
                  <Lock className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-14 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10">
              <Badge className="bg-slate-100 text-slate-800 border-slate-200">
                {isFr ? "Process" : isZh ? "流程" : "Process"}
              </Badge>
              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl font-serif font-bold">
                {isFr ? "Simple. Rapide. Premium." : isZh ? "简单 • 快速 • 高端" : "Simple. Fast. Premium."}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Card className="rounded-3xl border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-sm font-bold text-slate-500">
                    {isFr ? "Étape 1" : isZh ? "第1步" : "Step 1"}
                  </div>
                  <div className="mt-2 text-xl font-bold">{isFr ? "Vous contactez" : isZh ? "联系" : "You reach out"}</div>
                  <p className="mt-2 text-slate-600">
                    {isFr
                      ? "Email direct avec dates, nombre de personnes, objectifs."
                      : isZh
                      ? "邮件说明日期、人数与需求目标。"
                      : "Direct email with dates, group size, and goals."}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-sm font-bold text-slate-500">
                    {isFr ? "Étape 2" : isZh ? "第2步" : "Step 2"}
                  </div>
                  <div className="mt-2 text-xl font-bold">{isFr ? "Plan sur-mesure" : isZh ? "定制方案" : "Tailored plan"}</div>
                  <p className="mt-2 text-slate-600">
                    {isFr
                      ? "Itinéraire, accès, transferts, timing, options VIP."
                      : isZh
                      ? "行程、入场、交通、时间与VIP选项。"
                      : "Itinerary, access, transfers, timing and VIP options."}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-2 border-slate-100 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-sm font-bold text-slate-500">
                    {isFr ? "Étape 3" : isZh ? "第3步" : "Step 3"}
                  </div>
                  <div className="mt-2 text-xl font-bold">{isFr ? "Exécution parfaite" : isZh ? "完美执行" : "Flawless execution"}</div>
                  <p className="mt-2 text-slate-600">
                    {isFr
                      ? "Vous profitez. Nous gérons le reste, en toute discrétion."
                      : isZh
                      ? "你享受体验，我们全程保密执行。"
                      : "You enjoy. We manage everything else, discreetly."}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-14 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {isFr ? "Questions fréquentes" : isZh ? "常见问题" : "FAQ"}
              </h2>
              <p className="mt-3 text-slate-600">
                {isFr
                  ? "Infos rapides : couples, groupes, accès garanti, transferts premium."
                  : isZh
                  ? "情侣、团体、保证入场与高端交通。"
                  : "Quick info: couples, groups, guaranteed access and premium transfers."}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-3">
              <AccordionItem
                value="item-1"
                className="bg-white border-2 border-slate-200 rounded-2xl px-4 shadow-sm"
              >
                <AccordionTrigger className="text-left font-bold text-slate-900 py-5">
                  <Users className="h-5 w-5 text-[#e11d48] mr-3" />
                  {isFr
                    ? "C’est pour les couples uniquement ?"
                    : isZh
                    ? "只服务情侣吗？"
                    : "Is it only for couples?"}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-5">
                  {isFr
                    ? "Non. C’est pour les couples ET les groupes. L’accès garanti dépend des conditions et de la disponibilité."
                    : isZh
                    ? "不是。适用于情侣与团体。保证入场取决于条件与库存。"
                    : "No. It’s built for couples AND groups. Guaranteed access depends on conditions and availability."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-2"
                className="bg-white border-2 border-slate-200 rounded-2xl px-4 shadow-sm"
              >
                <AccordionTrigger className="text-left font-bold text-slate-900 py-5">
                  <Plane className="h-5 w-5 text-blue-600 mr-3" />
                  {isFr
                    ? "Vous gérez jet privé, avion et hélicoptère ?"
                    : isZh
                    ? "可以安排私人飞机与直升机吗？"
                    : "Do you handle jet, flights, and helicopter?"}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-5">
                  {isFr
                    ? "Oui. On coordonne les transferts premium selon votre programme et vos contraintes."
                    : isZh
                    ? "可以。我们根据你的行程与需求进行安排协调。"
                    : "Yes. We coordinate premium transfers based on your plan and constraints."}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="item-3"
                className="bg-white border-2 border-slate-200 rounded-2xl px-4 shadow-sm"
              >
                <AccordionTrigger className="text-left font-bold text-slate-900 py-5">
                  <MapPin className="h-5 w-5 text-emerald-600 mr-3" />
                  {isFr
                    ? "Vous opérez uniquement à Paris ?"
                    : isZh
                    ? "只在巴黎吗？"
                    : "Is it Paris only?"}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-5">
                  {isFr
                    ? "Paris est le cœur. Pour des demandes spécifiques (Côte d’Azur, etc.), on peut étudier selon le projet."
                    : isZh
                    ? "巴黎为核心。其他地区可根据项目评估。"
                    : "Paris is the core. For specific requests (French Riviera, etc.), we can evaluate depending on the project."}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="mt-10 text-center">
              <a href={`mailto:${copy.email}`} className="inline-block">
                <Button className="bg-gradient-to-r from-[#e11d48] to-rose-600 hover:from-rose-700 hover:to-[#be123c] text-white font-bold rounded-full px-10 py-6 shadow-xl">
                  {copy.cta1} <MessageCircle className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <p className="mt-4 text-xs text-slate-500">
                {isFr
                  ? "Email conseillé : dates + nombre de personnes + souhaits (club / jet / hélico / car / yacht)."
                  : isZh
                  ? "建议邮件包含：日期 + 人数 + 需求（俱乐部/飞机/直升机/豪车/游艇）。"
                  : "Email tip: dates + group size + requests (club / jet / helicopter / car / yacht)."}
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer minimal (optionnel) */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="container mx-auto px-4 text-center">
          <div className="text-sm text-slate-600">
            © 2026 PANORAMA GRUP. LoveLockParis™
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {isFr
              ? "Service concierge premium • Paris, France"
              : isZh
              ? "高端礼宾服务 • 巴黎, 法国"
              : "Premium concierge service • Paris, France"}
          </div>
        </div>
      </footer>
    </div>
  );
}
