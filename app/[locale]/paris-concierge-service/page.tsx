// app/[locale]/paris-concierge-service/page.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { Header } from "@/components/home/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Award,
  Building2,
  Calendar,
  Car,
  CheckCircle2,
  Crown,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  ShieldCheck,
  Ship,
  Sparkles,
  Star,
  Users,
  Wine,
} from "lucide-react";

const PHONE_DISPLAY = "+33 1 88 84 22 22";
const PHONE_TEL = "+33188842222";
const EMAIL = "concierge@lovelockparis.com";

export const metadata: Metadata = {
  title: "Paris Concierge Service • Luxe, VIP & Accès Club Privé Garanti",
  description:
    "Conciergerie de luxe à Paris pour couples et groupes : jet privé, avion, hélicoptère, yacht, chauffeur Mercedes Classe S, van premium, réservation restaurants, shopping luxe (montres, bijoux, sacs) et accès club privé select garanti.",
  alternates: { canonical: "/paris-concierge-service" },
  openGraph: {
    title: "Paris Concierge Service • Luxe, VIP & Accès Club Privé Garanti",
    description:
      "Jet privé, hélico, yacht, Mercedes Classe S + van, tables rares, nightlife select et accès club privé garanti.",
    type: "website",
    url: "/paris-concierge-service",
  },
};

export default async function ParisConciergeServicePage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = params.locale;

  const isFR = locale === "fr";
  const isZHCN = locale === "zh-CN";

  const STR = {
    // Header translations (utilise ceux de la home)
    navBridge: isFR ? "Pont 3D" : isZHCN ? "3D桥梁" : "3D Bridge",
    problemHeading: isFR
      ? "Pourquoi c’est interdit ?"
      : isZHCN
      ? "为什么被禁止？"
      : "Why it’s banned?",
    solutionHeading: isFR
      ? "Notre solution"
      : isZHCN
      ? "我们的解决方案"
      : "Our solution",
    ctaStart: isFR ? "Commencer" : isZHCN ? "开始" : "Start",

    pageDesc: isFR
      ? "Conciergerie de luxe à Paris pour couples et groupes : jet privé, avion, hélicoptère, yacht, chauffeur Mercedes Classe S, van premium, réservation restaurants, shopping luxe (montres, bijoux, sacs), et accès club privé select garanti."
      : isZHCN
      ? "巴黎高端礼宾：情侣与团体皆可。私人飞机/航班、直升机、游艇、奔驰S级司机、豪华VAN、餐厅预订、奢侈品采购（腕表/珠宝/包）与私密俱乐部保证入场。"
      : "Luxury concierge in Paris for couples and groups: private jet, flights, helicopter, yacht, Mercedes S-Class chauffeur, premium van, restaurant bookings, luxury shopping (watches, jewelry, bags), and guaranteed access to select private clubs.",

    heroKicker: isFR
      ? "PARIS 24/7 • CLUB PRIVÉ SELECT • ACCÈS GARANTI"
      : isZHCN
      ? "巴黎 24/7 • 私密俱乐部 • 保证入场"
      : "PARIS 24/7 • PRIVATE CLUB SELECT • GUARANTEED ACCESS",

    heroH1a: isFR
      ? "Paris Concierge Service"
      : isZHCN
      ? "巴黎奢华礼宾服务"
      : "Paris Concierge Service",

    heroH1b: isFR
      ? "Expérience VIP premium — Couples & Groupes"
      : isZHCN
      ? "VIP尊享 — 情侣与团体"
      : "Premium VIP experience — Couples & Groups",

    heroSub: isFR
      ? "Conciergerie de luxe à Paris pour organiser, réserver, transporter et sublimer votre séjour : jet privé, hélicoptère, yacht, chauffeur Mercedes Classe S, van premium, tables rares, nightlife select."
      : isZHCN
      ? "在巴黎，为你安排、预订、接送与升级全程体验：私人飞机、直升机、游艇、奔驰S级司机、豪华VAN、稀缺餐厅与精选夜生活。"
      : "Luxury concierge in Paris to plan, book, transport and elevate your stay: private jet, helicopter, yacht, Mercedes S-Class chauffeur, premium van, rare tables, select nightlife.",

    ctaCall: isFR ? "Appeler maintenant" : isZHCN ? "立即致电" : "Call now",
    ctaEmail: isFR ? "Écrire par email" : isZHCN ? "发送邮件" : "Email us",

    trust1: isFR
      ? "Accès club privé select garanti"
      : isZHCN
      ? "私密俱乐部保证入场"
      : "Guaranteed private club access",
    trust2: isFR ? "Couples & groupes" : isZHCN ? "情侣与团体" : "Couples & groups",
    trust3: isFR ? "Réponse rapide 24/7" : isZHCN ? "24/7快速响应" : "Fast response 24/7",
    trust4: isFR
      ? "Service premium, discret, sécurisé"
      : isZHCN
      ? "高端、低调、安全"
      : "Premium, discreet, secure",
  };

  // Schema.org (LocalBusiness + FAQ)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        name: "LoveLockParis • Paris Concierge Service",
        url: "https://lovelockparis.com",
        telephone: PHONE_TEL,
        email: EMAIL,
        areaServed: ["Paris", "Île-de-France"],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Paris",
          addressCountry: "FR",
        },
        description: STR.pageDesc,
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: isFR
              ? "Proposez-vous un Paris concierge service pour couples ET groupes ?"
              : "Do you offer concierge service in Paris for couples AND groups?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFR
                ? "Oui. Notre conciergerie de luxe à Paris est conçue pour les couples, les groupes, les familles et les voyages corporate : transferts, réservations, nightlife select, shopping luxe, événements."
                : "Yes. Our luxury concierge in Paris is built for couples, groups, families and corporate travel: transfers, bookings, select nightlife, luxury shopping, events.",
            },
          },
          {
            "@type": "Question",
            name: isFR
              ? "L’accès au club privé select est-il garanti ?"
              : "Is private club select access guaranteed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFR
                ? "Oui. Nous travaillons sur des créneaux confirmés et des entrées validées, selon le profil du groupe et le timing. Appelez-nous pour valider le plan idéal."
                : "Yes. We operate with confirmed slots and validated entry, depending on group profile and timing. Call us to confirm the best plan.",
            },
          },
          {
            "@type": "Question",
            name: isFR
              ? "Faites-vous du shopping luxe (montres, bijoux, sacs) ?"
              : "Do you handle luxury shopping (watches, jewelry, bags)?",
            acceptedAnswer: {
              "@type": "Answer",
              text: isFR
                ? "Oui. Personal shopping, sourcing, achats en boutique ou sur demande. Si un besoin n’est pas listé, contactez-nous par mail, téléphone ou chat."
                : "Yes. Personal shopping, sourcing, boutique purchases or on request. If something isn’t listed, contact us by email, phone or chat.",
            },
          },
        ],
      },
    ],
  };

  const ServiceCard = ({
    icon,
    title,
    desc,
    bullets,
    badge,
  }: {
    icon: ReactNode;
    title: string;
    desc: string;
    bullets: string[];
    badge?: string;
  }) => (
    <Card className="rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden">
      <CardContent className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              {icon}
            </div>
            <div>
              <p className="font-serif font-bold text-slate-900 text-lg">{title}</p>
              {badge ? (
                <Badge className="mt-1 bg-slate-900 text-white border border-slate-800 font-bold">
                  {badge}
                </Badge>
              ) : null}
            </div>
          </div>
          <Star className="h-5 w-5 text-amber-500" />
        </div>

        <p className="mt-4 text-slate-700 leading-relaxed text-sm sm:text-base">
          {desc}
        </p>

        <ul className="mt-4 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900 overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header
        translations={{
          navBridge: STR.navBridge,
          problemHeading: STR.problemHeading,
          solutionHeading: STR.solutionHeading,
          ctaStart: STR.ctaStart,
        }}
      />

      <main>
        {/* HERO */}
        <section className="relative min-h-[82vh] flex items-center justify-center px-4 py-10 sm:py-16 overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src="/images/concierge/hero-concierge-paris.jpg"
              alt="Paris concierge service luxury VIP experience in Paris with private jet helicopter yacht and private club access"
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />
          </div>

          <div className="relative z-10 w-full max-w-6xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/15 backdrop-blur-lg border border-white/20 text-white shadow-2xl">
                <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-rose-400" />
                <span className="text-[11px] sm:text-xs font-extrabold tracking-wider uppercase">
                  {STR.heroKicker}
                </span>
              </div>
            </div>

            <div className="text-center space-y-5 sm:space-y-7">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-[1.05] drop-shadow-2xl">
                {STR.heroH1a}
                <span className="block mt-2 text-2xl sm:text-3xl lg:text-4xl font-semibold text-rose-300">
                  {STR.heroH1b}
                </span>
              </h1>

              <p className="max-w-4xl mx-auto text-sm sm:text-base md:text-lg text-slate-100/95 leading-relaxed">
                {STR.heroSub}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pt-2">
                <a href={`tel:${PHONE_TEL}`} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-bold rounded-full px-6 sm:px-8 py-6 shadow-2xl hover:scale-[1.02] transition"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    {STR.ctaCall} • {PHONE_DISPLAY}
                  </Button>
                </a>

                <a href={`mailto:${EMAIL}`} className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-white/10 backdrop-blur-md border-white/40 text-white hover:bg-white hover:text-slate-900 font-bold rounded-full px-6 sm:px-8 py-6"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    {STR.ctaEmail}
                  </Button>
                </a>
              </div>

              <div className="pt-4 sm:pt-6 flex flex-wrap justify-center gap-3 sm:gap-5 text-white/90 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> {STR.trust1}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-amber-300" /> {STR.trust2}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-sky-300" /> {STR.trust3}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-purple-300" /> {STR.trust4}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* INTRO SEO */}
        <section className="py-10 sm:py-14 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2">
                  <Badge className="bg-rose-100 text-rose-900 border border-rose-200 font-bold">
                    Luxury Concierge Paris
                  </Badge>
                  <Badge className="bg-slate-100 text-slate-900 border border-slate-200 font-bold">
                    VIP Concierge Service
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-900 border border-emerald-200 font-bold">
                    Private Club Access
                  </Badge>
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900">
                  {isFR
                    ? "Conciergerie de luxe à Paris : tout organiser, tout réserver, tout sublimer"
                    : isZHCN
                    ? "巴黎高端礼宾：安排、预订与升级一切体验"
                    : "Luxury concierge in Paris: plan, book and elevate everything"}
                </h2>

                <p className="text-slate-700 leading-relaxed text-sm sm:text-base md:text-lg">
                  {isFR ? (
                    <>
                      Vous cherchez un <strong>Paris concierge service</strong> vraiment premium ? Pour <strong>couples</strong> et{" "}
                      <strong>groupes</strong> : <strong>jet privé</strong>, <strong>avion</strong>,{" "}
                      <strong>hélicoptère</strong>, <strong>yacht</strong>, transferts{" "}
                      <strong>Mercedes Classe S</strong> et <strong>van premium</strong>, tables rares, événements privés et{" "}
                      <strong>accès club privé select garanti</strong>.
                      <br />
                      <br />
                      Et si un besoin n’est pas écrit (montres, bijoux, sacs, achats sur mesure, surprises) :{" "}
                      <strong>mail</strong>, <strong>appel</strong> ou <strong>chat</strong> — on s’occupe du reste.
                    </>
                  ) : (
                    <>
                      Looking for a premium <strong>Paris concierge service</strong>? For <strong>couples</strong> and{" "}
                      <strong>groups</strong>: <strong>private jet</strong>, <strong>flights</strong>,{" "}
                      <strong>helicopter</strong>, <strong>yacht</strong>, <strong>S-Class</strong> and <strong>premium van</strong>, rare tables,
                      private events and <strong>guaranteed private club select access</strong>.
                      <br />
                      <br />
                      If it’s not listed (watches, jewelry, bags, bespoke purchases, surprises): <strong>email</strong>,{" "}
                      <strong>call</strong> or <strong>chat</strong>.
                    </>
                  )}
                </p>
              </div>

              <div className="lg:col-span-5">
                <Card className="border-2 border-slate-100 shadow-xl rounded-3xl overflow-hidden">
                  <CardContent className="p-6 sm:p-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-5 w-5 text-amber-500" />
                        <p className="font-bold text-slate-900">
                          {isFR ? "Contact concierge" : "Concierge contact"}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                        {isFR ? "24/7" : "24/7"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Phone className="h-4 w-4 text-rose-600" />
                          {isFR ? "Téléphone" : "Phone"}
                        </div>
                        <a
                          href={`tel:${PHONE_TEL}`}
                          className="mt-1 block text-sm text-slate-700 hover:text-rose-700 font-semibold"
                        >
                          {PHONE_DISPLAY}
                        </a>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 text-slate-900 font-bold">
                          <Mail className="h-4 w-4 text-rose-600" />
                          Email
                        </div>
                        <a
                          href={`mailto:${EMAIL}`}
                          className="mt-1 block text-sm text-slate-700 hover:text-rose-700 font-semibold break-all"
                        >
                          {EMAIL}
                        </a>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white border border-white/10">
                      <p className="font-bold flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-rose-300" />
                        {isFR ? "Vous demandez, on exécute." : "You request, we deliver."}
                      </p>
                      <p className="text-sm text-white/85 mt-1 leading-relaxed">
                        {isFR
                          ? "Montres, bijoux, sacs, surprises, multi-véhicules, événements privés, last-minute."
                          : "Watches, jewelry, bags, surprises, multi-vehicle, private events, last-minute."}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href={`tel:${PHONE_TEL}`} className="w-full">
                        <Button className="w-full rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold">
                          <Phone className="mr-2 h-4 w-4" />
                          {isFR ? "Appeler" : "Call"}
                        </Button>
                      </a>
                      <a href={`mailto:${EMAIL}`} className="w-full">
                        <Button variant="outline" className="w-full rounded-full font-bold">
                          <Mail className="mr-2 h-4 w-4" />
                          {isFR ? "Email" : "Email"}
                        </Button>
                      </a>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      {isFR
                        ? "Le chat est déjà présent sur le site."
                        : "Chat is already available on the site."}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY 4 PHOTOS */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {isFR ? "Vos 4 expériences premium" : "Your 4 premium experiences"}
              </h2>
              <p className="text-slate-600 mt-3 max-w-3xl mx-auto text-sm sm:text-base">
                {isFR
                  ? "Dîner romantique, tarmac avion + hélico, club privé select, yacht : placements 16:9."
                  : "Romantic dinner, jet+helicopter tarmac, private club select, yacht: 16:9 placements."}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 sm:gap-7">
              {[
                {
                  src: "/images/concierge/romantic-yacht-dinner.jpg",
                  alt: "Couple romantic dinner on yacht at sunset with Eiffel Tower view - Paris luxury concierge service",
                  tag1: isFR ? "Dîner romantique" : "Romantic dinner",
                  tag2: isFR ? "Vue Tour Eiffel" : "Eiffel view",
                  title: isFR ? "Coucher de soleil • expérience privée" : "Sunset • private experience",
                },
                {
                  src: "/images/concierge/tarmac-jet-heli-sclass-van.jpg",
                  alt: "Private jet and helicopter on tarmac with Mercedes S-Class and premium van - Paris VIP concierge service",
                  tag1: isFR ? "Jet • Avion" : "Jet • Flight",
                  tag2: isFR ? "Hélico premium" : "Premium helicopter",
                  title: isFR ? "Tarmac coordonné • arrivée sans friction" : "Coordinated tarmac • seamless arrival",
                },
                {
                  src: "/images/concierge/private-club-select.jpg",
                  alt: "High-end private club in Paris with VIP atmosphere and select access guarantee - Paris concierge service",
                  tag1: isFR ? "Club privé select" : "Private club select",
                  tag2: isFR ? "Accès garanti" : "Access guaranteed",
                  title: isFR ? "Tables • zones VIP • service discret" : "Tables • VIP areas • discreet service",
                  highlight: true,
                },
                {
                  src: "/images/concierge/yacht-paris-premium.jpg",
                  alt: "Luxury yacht experience for couples and groups in Paris - private concierge service",
                  tag1: "Yacht",
                  tag2: isFR ? "Couples & groupes" : "Couples & groups",
                  title: isFR ? "Croisière premium • moment signature" : "Premium cruise • signature moment",
                },
              ].map((x) => (
                <Card key={x.src} className="overflow-hidden rounded-3xl border-2 border-slate-100 shadow-xl">
                  <div className="relative aspect-video">
                    <Image
                      src={x.src}
                      alt={x.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-white/15 text-white border-white/20 backdrop-blur font-bold">
                          {x.tag1}
                        </Badge>
                        <Badge
                          className={
                            x.highlight
                              ? "bg-emerald-500/80 text-white border-emerald-300/30 backdrop-blur font-bold"
                              : "bg-white/15 text-white border-white/20 backdrop-blur font-bold"
                          }
                        >
                          {x.tag2}
                        </Badge>
                      </div>
                      <p className="mt-2 text-white font-bold text-lg">{x.title}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a href={`tel:${PHONE_TEL}`} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-7 py-6 shadow-xl">
                  <Phone className="mr-2 h-5 w-5" />
                  {isFR ? "Appeler pour réserver" : "Call to book"} • {PHONE_DISPLAY}
                </Button>
              </a>
              <a href={`mailto:${EMAIL}`} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-bold px-7 py-6">
                  <Mail className="mr-2 h-5 w-5" />
                  {isFR ? "Demande par email" : "Request by email"}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-14 sm:py-18 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {isFR ? "Services de conciergerie VIP à Paris" : "VIP concierge services in Paris"}
              </h2>
              <p className="mt-3 text-slate-600 max-w-3xl mx-auto text-sm sm:text-base">
                {isFR
                  ? "Transports premium, club privé select, tables rares, événements, shopping luxe et demandes sur mesure."
                  : "Premium transport, private club select, rare tables, events, luxury shopping and bespoke requests."}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-5 sm:gap-7">
              <ServiceCard
                icon={<Plane className="h-5 w-5 text-rose-700" />}
                title={isFR ? "Jet privé, avion & tarmac" : "Private jet, flights & tarmac"}
                badge={isFR ? "Premium" : "Premium"}
                desc={isFR
                  ? "Coordination tarmac, timing, arrivée VIP et transferts immédiats. Couples, groupes, corporate."
                  : "Tarmac coordination, timing, VIP arrival and immediate transfers. Couples, groups, corporate."}
                bullets={[
                  isFR ? "Jet privé & avion sur demande" : "Private jet & flight on request",
                  isFR ? "Accueil + coordination tarmac" : "Welcome + tarmac coordination",
                  isFR ? "Exécution rapide et claire" : "Fast and clear execution",
                ]}
              />

              <ServiceCard
                icon={<Ship className="h-5 w-5 text-rose-700" />}
                title={isFR ? "Yacht & expériences signature" : "Yacht & signature experiences"}
                badge={isFR ? "Expérience" : "Experience"}
                desc={isFR
                  ? "Croisière premium, dîner romantique, sunset, événements privés. Discrétion, élégance, précision."
                  : "Premium cruise, romantic dinner, sunset, private events. Discreet, elegant, precise."}
                bullets={[
                  isFR ? "Dîner romantique & ambiance" : "Romantic dinner & ambiance",
                  isFR ? "Couples & groupes" : "Couples & groups",
                  isFR ? "Coordination boissons & timing" : "Drinks & timing coordination",
                ]}
              />

              <ServiceCard
                icon={<Car className="h-5 w-5 text-rose-700" />}
                title={isFR ? "Mercedes Classe S + Van" : "Mercedes S-Class + premium van"}
                badge={isFR ? "Chauffeur" : "Chauffeur"}
                desc={isFR
                  ? "Transferts premium à Paris : Classe S avec chauffeur + van haut de gamme pour groupes."
                  : "Premium transfers in Paris: S-Class chauffeur + high-end van for groups."}
                bullets={[
                  isFR ? "Mercedes Classe S avec chauffeur" : "Mercedes S-Class with chauffeur",
                  isFR ? "Van premium (groupes)" : "Premium van (groups)",
                  isFR ? "Multi-véhicules sur demande" : "Multi-vehicle on request",
                ]}
              />

              <ServiceCard
                icon={<Crown className="h-5 w-5 text-rose-700" />}
                title={isFR ? "Club privé select — accès garanti" : "Private club select — guaranteed access"}
                badge={isFR ? "Garanti" : "Guaranteed"}
                desc={isFR
                  ? "Nightlife premium : entrées validées, timing optimisé, zones VIP selon disponibilité."
                  : "Premium nightlife: validated entry, optimized timing, VIP zones subject to availability."}
                bullets={[
                  isFR ? "Couples & groupes" : "Couples & groups",
                  isFR ? "Table & zone VIP selon créneau" : "Table & VIP area depending on slot",
                  isFR ? "Service discret" : "Discreet service",
                ]}
              />

              <ServiceCard
                icon={<Wine className="h-5 w-5 text-rose-700" />}
                title={isFR ? "Restaurants & tables rares" : "Restaurants & rare tables"}
                badge={isFR ? "Réservation" : "Booking"}
                desc={isFR
                  ? "Tables difficiles, expériences gastronomiques, privatisations. Organisation simple."
                  : "Hard-to-book tables, fine dining, privatizations. Simple coordination."}
                bullets={[
                  isFR ? "Tables rares & last-minute" : "Rare & last-minute tables",
                  isFR ? "Dîners privés & événements" : "Private dinners & events",
                  isFR ? "Transport + arrivée coordonnés" : "Transport + arrival coordinated",
                ]}
              />

              <ServiceCard
                icon={<Award className="h-5 w-5 text-rose-700" />}
                title={isFR ? "Shopping luxe & achats sur mesure" : "Luxury shopping & bespoke purchases"}
                badge={isFR ? "Sourcing" : "Sourcing"}
                desc={isFR
                  ? "Montres, bijoux, sacs, cadeaux : sourcing + achats. Si ce n’est pas écrit, vous demandez."
                  : "Watches, jewelry, bags, gifts: sourcing + purchases. If it’s not listed, ask."}
                bullets={[
                  isFR ? "Montres, bijoux, sacs, cadeaux" : "Watches, jewelry, bags, gifts",
                  isFR ? "Sur demande, en boutique" : "On request, in boutique",
                  isFR ? "Mail, appel ou chat" : "Email, call or chat",
                ]}
              />
            </div>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a href={`tel:${PHONE_TEL}`} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold px-8 py-6 shadow-xl">
                  <Phone className="mr-2 h-5 w-5" />
                  {isFR ? "Appeler le concierge" : "Call the concierge"} • {PHONE_DISPLAY}
                </Button>
              </a>
              <a href={`mailto:${EMAIL}`} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-bold px-8 py-6">
                  <Mail className="mr-2 h-5 w-5" />
                  {isFR ? "Envoyer une demande" : "Send a request"}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ (grosse) */}
        <section className="py-14 sm:py-18 bg-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-slate-900">
                {isFR ? "FAQ — Paris Concierge Service" : "FAQ — Paris Concierge Service"}
              </h2>
              <p className="mt-3 text-slate-600 max-w-3xl mx-auto text-sm sm:text-base">
                {isFR
                  ? "Réponses claires, SEO dense, et très lisible (IA-friendly)."
                  : "Clear answers, SEO-dense, and easy to parse (AI-friendly)."}
              </p>
            </div>

            <Card className="rounded-3xl border-2 border-slate-100 shadow-xl">
              <CardContent className="p-4 sm:p-7">
                <Accordion type="single" collapsible className="w-full">
                  {[
                    {
                      q: isFR
                        ? "Travaillez-vous pour des couples ET des groupes ?"
                        : "Do you work with couples AND groups?",
                      a: isFR
                        ? "Oui. Couples, groupes d’amis, familles, corporate : nous adaptons le transport, les réservations, le timing et les accès VIP."
                        : "Yes. Couples, friend groups, families, corporate: we adapt transport, bookings, timing and VIP access.",
                    },
                    {
                      q: isFR
                        ? "Accès club privé select : comment c’est garanti ?"
                        : "Private club select access: how is it guaranteed?",
                      a: isFR
                        ? "Nous fonctionnons sur des créneaux confirmés et une coordination stricte. Le timing et le profil du groupe sont pris en compte."
                        : "We operate with confirmed slots and strict coordination. Timing and group profile are considered.",
                    },
                    {
                      q: isFR
                        ? "Pouvez-vous organiser jet privé / avion / hélicoptère ?"
                        : "Can you arrange private jet / flights / helicopter?",
                      a: isFR
                        ? "Oui : coordination tarmac, accueil, puis transfert immédiat en Mercedes Classe S et/ou van premium."
                        : "Yes: tarmac coordination, welcome, then immediate transfer by S-Class and/or premium van.",
                    },
                    {
                      q: isFR
                        ? "Proposez-vous yacht + dîner romantique ?"
                        : "Do you offer yacht + romantic dinner?",
                      a: isFR
                        ? "Oui : format dîner, sunset, ambiance, boissons, et ajustements selon votre style et votre heure."
                        : "Yes: dinner format, sunset, ambiance, drinks, and tailoring based on your style and time.",
                    },
                    {
                      q: isFR
                        ? "Shopping luxe : montres, bijoux, sacs… possible ?"
                        : "Luxury shopping: watches, jewelry, bags… possible?",
                      a: isFR
                        ? `Oui. Sourcing et achats sur demande. Si ce n’est pas écrit, contactez-nous : ${EMAIL} ou ${PHONE_DISPLAY} (ou chat).`
                        : `Yes. Sourcing and purchases on request. If it’s not listed, contact us: ${EMAIL} or ${PHONE_DISPLAY} (or chat).`,
                    },
                    {
                      q: isFR
                        ? "Que faire si ma demande n’est pas dans la liste ?"
                        : "What if my request isn’t listed?",
                      a: isFR
                        ? "Vous nous dites ce que vous voulez. Mail, appel ou chat. On propose une solution premium."
                        : "Tell us what you want. Email, call or chat. We’ll propose a premium solution.",
                    },
                    {
                      q: isFR
                        ? "Quel est le moyen le plus rapide pour réserver ?"
                        : "What’s the fastest way to book?",
                      a: isFR
                        ? `L’appel : ${PHONE_DISPLAY}. Sinon email : ${EMAIL}.`
                        : `Call: ${PHONE_DISPLAY}. Or email: ${EMAIL}.`,
                    },
                  ].map((item, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-slate-100">
                      <AccordionTrigger className="text-left font-bold text-slate-900">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-700 leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <a href={`tel:${PHONE_TEL}`} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-6 shadow-xl">
                  <Phone className="mr-2 h-5 w-5" />
                  {isFR ? "Appeler maintenant" : "Call now"} • {PHONE_DISPLAY}
                </Button>
              </a>
              <a href={`mailto:${EMAIL}`} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full font-bold px-8 py-6">
                  <Mail className="mr-2 h-5 w-5" />
                  {isFR ? "Écrire par email" : "Email us"} • {EMAIL}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER (INLINE) */}
        <footer className="bg-slate-950 text-white">
          <div className="container mx-auto px-4 max-w-6xl py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <p className="font-serif text-2xl font-bold">Paris Concierge Service</p>
                <p className="mt-3 text-white/75 leading-relaxed text-sm">
                  {isFR
                    ? "Conciergerie de luxe à Paris pour couples et groupes : jet privé, avion, hélicoptère, yacht, Mercedes Classe S, van premium, restaurants, club privé select (accès garanti) et shopping luxe."
                    : "Luxury concierge in Paris for couples and groups: private jet, flights, helicopter, yacht, S-Class, premium van, restaurants, private club select (guaranteed access) and luxury shopping."}
                </p>

                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <a href={`tel:${PHONE_TEL}`} className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold">
                      <Phone className="mr-2 h-4 w-4" />
                      {PHONE_DISPLAY}
                    </Button>
                  </a>
                  <a href={`mailto:${EMAIL}`} className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto rounded-full border-white/30 text-white hover:bg-white hover:text-slate-950 font-bold">
                      <Mail className="mr-2 h-4 w-4" />
                      {EMAIL}
                    </Button>
                  </a>
                </div>

                <p className="mt-4 text-xs text-white/55">
                  {isFR
                    ? "Le chat est disponible sur le site. Si un besoin n’est pas listé : mail, appel ou chat."
                    : "Chat is available on the site. If a request isn’t listed: email, call or chat."}
                </p>
              </div>

              <div>
                <p className="font-bold text-white">Services</p>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li className="flex gap-2"><Plane className="h-4 w-4 text-white/70" /> Jet / Avion / Tarmac</li>
                  <li className="flex gap-2"><Ship className="h-4 w-4 text-white/70" /> Yacht</li>
                  <li className="flex gap-2"><Car className="h-4 w-4 text-white/70" /> Mercedes S + Van</li>
                  <li className="flex gap-2"><Crown className="h-4 w-4 text-white/70" /> Club privé select</li>
                  <li className="flex gap-2"><Award className="h-4 w-4 text-white/70" /> Shopping luxe</li>
                </ul>
              </div>

              <div>
                <p className="font-bold text-white">Paris</p>
                <ul className="mt-3 space-y-2 text-sm text-white/75">
                  <li className="flex gap-2"><MapPin className="h-4 w-4 text-white/70" /> Paris • Île-de-France</li>
                  <li className="flex gap-2"><Calendar className="h-4 w-4 text-white/70" /> 7j/7 • 24/7</li>
                  <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-white/70" /> Discrétion & sécurité</li>
                  <li className="flex gap-2"><Users className="h-4 w-4 text-white/70" /> Couples & groupes</li>
                </ul>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <p className="text-xs text-white/55">
                © {new Date().getFullYear()} • Paris Concierge Service • All rights reserved.
              </p>
              <p className="text-xs text-white/55">
                {isFR
                  ? "Aucune promesse irréaliste : tout se fait selon disponibilité et validation."
                  : "No unrealistic promises: everything depends on availability and validation."}
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
