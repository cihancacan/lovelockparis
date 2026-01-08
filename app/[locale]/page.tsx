import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Lock, Heart, DollarSign, Globe, ShoppingCart, Target, Medal, ShieldCheck, 
  ArrowRight, Smartphone, Coins, Users, MapPin, Star, TrendingUp, CheckCircle, 
  Calendar, Eye, Award, Clock, Zap, ChevronRight, Trophy, Crown, Sparkles, 
  InfinityIcon, Building, Euro, BarChart3, Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Header } from '@/components/home/header';
import { Badge } from '@/components/ui/badge';
import { PurchaseNotifications } from '@/components/home/purchase-notifications';

export default async function Home({ params }: { params: { locale: string } }) {
  const t = await getTranslations('home');
  const locale = params.locale;

  // DONNÉES STRUCTURÉES (SEO)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TouristAttraction",
        "name": "Love Lock Bridge Paris (Virtual Registry)",
        "alternateName": ["Lock of Love Bridge Paris", "Pont des Arts Love Locks", "Paris Love Lock Bridge"],
        "url": "https://lovelockparis.com",
        "image": "https://lovelockparis.com/images/concept-value.jpg",
        "description": "Official digital love lock registry for Pont des Arts in Paris. Virtual augmented reality experience for couples.",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Pont des Arts",
          "addressLocality": "Paris",
          "postalCode": "75006",
          "addressCountry": "FR"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 48.858370,
          "longitude": 2.337480
        },
        "openingHours": "24/7",
        "publicAccess": true
      },
      {
        "@type": "Product",
        "name": "Digital Love Lock - Pont des Arts",
        "description": "Permanent digital love lock secured on the Paris Love Lock Registry. Visible in augmented reality.",
        "image": "https://lovelockparis.com/images/skin-gold.png",
        "brand": {
          "@type": "Brand",
          "name": "LoveLockParis"
        },
        "offers": {
          "@type": "Offer",
          "price": "29.99",
          "priceCurrency": "USD",
          "priceValidUntil": "2026-12-31",
          "availability": "https://schema.org/InStock",
          "url": "https://lovelockparis.com/purchase"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "1247",
          "bestRating": "5",
          "worstRating": "1"
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Header
        translations={{
          navBridge: t('nav.bridge'),
          problemHeading: t('problem.heading'),
          solutionHeading: t('solution.heading'),
          ctaStart: t('cta.start'),
        }}
      />

      <main>
        {/* =====================================================================================
            HERO SECTION
        ===================================================================================== */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-0 pb-0">
          
          <div className="absolute inset-0 z-0">
            {/* 1. CORRECTION IMAGE : Utilisation de concept-value.jpg */}
            <Image 
              src="/images/concept-value.jpg" 
              alt="Couple placing digital love lock on Pont des Arts bridge Paris using augmented reality" 
              fill 
              className="object-cover object-center" 
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
          </div>

         <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8 pt-4 md:pt-20">
            
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-lg border-2 border-white/30 text-white shadow-2xl">
                <ShieldCheck className="h-5 w-5 text-[#e11d48]" />
                <span className="text-[12px] md:text-xs font-bold tracking-wider uppercase">
                  {locale === 'fr' ? 'Le Registre Officiel • Paris 2026' : 
                   locale === 'es' ? 'El Registro Oficial • París 2026' :
                   locale === 'zh-CN' ? '官方注册处 • 巴黎 2026' :
                   'The Official Registry • Paris 2026'}
                </span>
              </div>
            </div>

            {/* H1 Principal */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.0] text-white drop-shadow-2xl">
              {locale === 'fr' ? (
                <>
                  Le Véritable<br/>
                  <span className="text-[#e11d48]">Pont des Cadenas</span>
                  <span className="text-4xl sm:text-5xl md:text-6xl">Paris • Pont des Arts</span>
                </>
              ) : locale === 'zh-CN' ? (
                <>
                  真正的<br/>
                  <span className="text-[#e11d48]">巴黎爱情锁桥</span><br/>
                  <span className="text-4xl sm:text-5xl md:text-6xl">艺术桥 • 巴黎</span>
                </>
              ) : (
                <>
                  The Original<br/>
                  <span className="text-[#e11d48]">Lock of Love Bridge</span><br/>
                  <span className="text-4xl sm:text-5xl md:text-6xl">Paris • Pont des Arts</span>
                </>
              )}
            </h1>

            {/* Sous-titre avec CORRECTION STRONG (JSX) */}
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed drop-shadow-lg font-medium px-4">
                {locale === 'fr' ? (
                  <>Recherchez le <strong>Pont des Cadenas d&apos;Amour Paris France</strong> ? Les cadenas physiques sont <strong>interdits depuis 2015</strong>. Rejoignez le registre officiel <strong>Love Lock Paris</strong>. Votre amour, immortalisé sur le Pont des Arts.</>
                ) : locale === 'zh-CN' ? (
                  <>寻找<strong>巴黎爱情锁桥法国</strong>？实体锁自<strong>2015年起已被禁止</strong>。加入官方<strong>巴黎爱情锁</strong>数字注册处。通过增强现实将您的爱情永远铭刻在艺术桥上。</>
                ) : (
                  <>Looking for the <strong>Love Lock Bridge Paris France</strong>? Physical locks are <strong>illegal since 2015</strong>. Join the official <strong>Love Lock Paris</strong> digital registry. Your love, immortalized on the historic Pont des Arts via augmented reality.</>
                )}
              </p>
            </div>

            {/* CTA Principale */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-0 w-full max-w-xl mx-auto sm:max-w-none">
              <Link href="/purchase" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-lg md:text-xl px-10 py-7 bg-gradient-to-r from-[#e11d48] to-rose-600 hover:from-rose-700 hover:to-[#be123c] text-white font-bold rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-[#e11d48]/50 border-none">
                  <Lock className="mr-3 h-6 w-6" />
                  {locale === 'fr' ? 'Sécuriser Mon Cadenas • 29,99€' :
                   locale === 'zh-CN' ? '购买数字锁 • ￥29.99' :
                   'Secure My Digital Lock • $29.99'}
                </Button>
              </Link>
              <Link href="/bridge" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg md:text-xl px-10 py-7 bg-white/15 backdrop-blur-md border-3 border-white/60 text-white hover:bg-white hover:text-slate-900 font-bold rounded-full">
                  <Globe className="mr-3" />
                  {locale === 'fr' ? 'Explorer le Pont 3D' :
                   locale === 'zh-CN' ? '探索3D桥梁' :
                   'Explore 3D Bridge First'}
                </Button>
              </Link>
            </div>
            
            <div className="pt-6">
              <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
                <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" /> 
                  {locale === 'fr' ? 'Légal & Autorisé' :
                   locale === 'zh-CN' ? '合法授权' :
                   'Legal & Authorized'}
                </span>
                <span className="flex items-center gap-2"><Award className="h-4 w-4 text-amber-400" /> 
                  {locale === 'fr' ? 'Note 4.9/5' :
                   locale === 'zh-CN' ? '评分4.9/5' :
                   '4.9/5 Rating'}
                </span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-400" /> 
                  {locale === 'fr' ? 'Livraison Instantanée' :
                   locale === 'zh-CN' ? '即时交付' :
                   'Instant Delivery'}
                </span>
                <span className="flex items-center gap-2"><InfinityIcon className="h-4 w-4 text-purple-400" /> 
                  {locale === 'fr' ? 'Accès à Vie' :
                   locale === 'zh-CN' ? '终身访问' :
                   'Lifetime Access'}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* STATISTICS BAR */}
        <section className="py-10 bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">347.293+</div>
                <div className="text-sm text-slate-300">
                  {locale === 'fr' ? 'Cadenas Numériques' :
                   locale === 'zh-CN' ? '数字锁已放置' :
                   'Digital Locks Placed'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">4.9/5</div>
                <div className="text-sm text-slate-300">
                  {locale === 'fr' ? 'Note Clients' :
                   locale === 'zh-CN' ? '客户评分' :
                   'Customer Rating'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2">142</div>
                <div className="text-sm text-slate-300">
                  {locale === 'fr' ? 'Pays' :
                   locale === 'zh-CN' ? '国家/地区' :
                   'Countries'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-rose-400 mb-2">24/7</div>
                <div className="text-sm text-slate-300">
                  {locale === 'fr' ? 'Support' :
                   locale === 'zh-CN' ? '支持服务' :
                   'Support'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================================
            PROBLEM/SOLUTION SECTION
        ===================================================================================== */}
        <section className="py-24 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-rose-100 text-rose-800 rounded-full text-sm font-bold mb-6">
                    {locale === 'fr' ? '⚠️ Important' :
                     locale === 'zh-CN' ? '⚠️ 重要通知' :
                     '⚠️ Important Notice'}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                    {locale === 'fr' ? (
                      <>Le <span className="text-[#e11d48]">Pont des Cadenas d&apos;Amour</span><br/>a Changé Pour Toujours</>
                    ) : locale === 'zh-CN' ? (
                      <>巴黎<span className="text-[#e11d48]">爱情锁桥</span><br/>已永久改变</>
                    ) : (
                      <>The <span className="text-[#e11d48]">Love Lock Bridge Paris</span><br/>Has Changed Forever</>
                    )}
                  </h2>
                  <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                    {locale === 'fr' ? (
                      <>Depuis 2015, placer des cadenas physiques sur le <strong>Pont des Arts à Paris</strong> est interdit et passible d&apos;une amende de 500€. Les grilles d&apos;origine se sont effondrées sous 45 tonnes de métal.</>
                    ) : locale === 'zh-CN' ? (
                      <>自2015年起，在<strong>巴黎艺术桥上</strong>放置实体锁已被禁止，违者将被处以500欧元罚款。原桥栏杆因承受45吨金属重量而倒塌。</>
                    ) : (
                      <>Since 2015, placing physical locks on the <strong>Pont des Arts bridge in Paris</strong> is illegal and punishable by €500 fines. The original bridge railings collapsed under 45 tons of metal locks.</>
                    )}
                  </p>

                  {/* PARAGRAPHE SEO "STORYTELLING" (Gardé comme demandé) */}
                  <div className="bg-slate-50 border-l-4 border-emerald-500 p-6 rounded-r-xl shadow-sm">
                    <p className="text-base text-slate-600 italic leading-relaxed">
                      {locale === 'fr' ? (
                        <>
                          &quot;En 2025, dix ans après l&apos;interdiction, une startup française a dévoilé une évolution durable. En fusionnant patrimoine et Réalité Augmentée, l&apos;initiative a relancé la tradition du <strong>Pont des Cadenas d&apos;Amour</strong>. À ce jour, plus de <strong>350 000 cadenas numériques</strong> provenant du monde entier ont déjà été fixés, remplissant rapidement la <strong>limite historique d&apos;un million d&apos;emplacements</strong>. C&apos;est désormais la seule façon légale de poser un <strong>cadenas d&apos;amour Paris</strong>.&quot;
                        </>
                      ) : locale === 'zh-CN' ? (
                        <>
                          &quot;2025年，即禁令十年后，一家法国初创公司推出了可持续发展的演变方案。通过融合遗产保护与增强现实技术，这一举措复兴了<strong>巴黎爱情锁桥</strong>的传统。迄今为止，已有来自世界各地的超过<strong>350,000个数字锁</strong>被固定，迅速填补了<strong>100万个历史位置的限额</strong>。这已成为放置<strong>巴黎爱情锁</strong>的唯一合法方式。&quot;
                        </>
                      ) : (
                        <>
                          &quot;In 2025, exactly a decade after the removal of 45 tons of metal, a French startup unveiled a sustainable evolution. By merging heritage conservation with Augmented Reality, this initiative revived the <strong>Lock of love bridge paris</strong> tradition. To date, over <strong>350,000 digital locks</strong> from couples worldwide have already been secured, rapidly filling the <strong>historic limit of 1,000,000 spots</strong>. This initiative transforms the site into the world&apos;s first eco-friendly <strong>love lock bridge paris</strong>, offering the only legal way to place a <strong>love lock paris</strong> today.&quot;
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                    <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-[#e11d48] font-bold text-xl">✗</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">
                        {locale === 'fr' ? 'Cadenas Physiques (Interdits)' :
                         locale === 'zh-CN' ? '实体锁（禁止）' :
                         'Physical Locks (Banned)'}
                      </h4>
                      <ul className="text-slate-600 space-y-1 text-sm">
                        <li>• {locale === 'fr' ? 'Illegaux (500€ d\'amende)' : locale === 'zh-CN' ? '违法（罚款500欧元）' : 'Illegal with €500 fines'}</li>
                        <li>• {locale === 'fr' ? 'Retirés tous les 6 mois' : locale === 'zh-CN' ? '每6个月清除一次' : 'Removed every 6 months'}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-lg border-2 border-emerald-200">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xl">✓</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">
                        {locale === 'fr' ? 'Cadenas Numériques (Officiel)' :
                         locale === 'zh-CN' ? '数字锁（官方）' :
                         'Digital Locks (Official)'}
                      </h4>
                      <ul className="text-slate-600 space-y-1 text-sm">
                        <li>• {locale === 'fr' ? '100% légal et autorisé' : locale === 'zh-CN' ? '100%合法授权' : '100% legal & authorized'}</li>
                        <li>• {locale === 'fr' ? 'Permanent sur blockchain' : locale === 'zh-CN' ? '区块链永久存储' : 'Permanent on blockchain'}</li>
                        <li>• {locale === 'fr' ? 'Visible de partout' : locale === 'zh-CN' ? '随时随地可查看' : 'View from anywhere'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl">
                  <h3 className="text-3xl font-bold mb-6">
                    {locale === 'fr' ? 'Pourquoi Choisir LoveLockParis ?' :
                     locale === 'zh-CN' ? '为什么选择巴黎爱情锁？' :
                     'Why Choose LoveLockParis?'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <MapPin className="h-6 w-6 text-rose-300 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {locale === 'fr' ? 'Emplacement Authentique' :
                           locale === 'zh-CN' ? '真实地理位置' :
                           'Authentic Location'}
                        </h4>
                        <p className="text-slate-300">
                          {locale === 'fr' ? 'Positionnement GPS précis sur le véritable <strong>Pont des Arts</strong>' :
                           locale === 'zh-CN' ? '在真实的<strong>艺术桥</strong>上进行GPS精确定位' :
                           'GPS-precise positioning on the actual <strong>Pont des Arts Love Lock Bridge</strong>'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Crown className="h-6 w-6 text-amber-300 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {locale === 'fr' ? 'Registre Officiel' :
                           locale === 'zh-CN' ? '官方注册处' :
                           'Official Registry'}
                        </h4>
                        <p className="text-slate-300">
                          {locale === 'fr' ? 'Reconnu comme le successeur légitime de la tradition physique' :
                           locale === 'zh-CN' ? '被公认为实体传统的合法继承者' :
                           'Recognized as the legitimate successor to the physical tradition'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Sparkles className="h-6 w-6 text-purple-300 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {locale === 'fr' ? 'Réalité Augmentée' :
                           locale === 'zh-CN' ? '增强现实' :
                           'Augmented Reality'}
                        </h4>
                        <p className="text-slate-300">
                          {locale === 'fr' ? 'Voyez votre cadenas apparaître sur le vrai pont via votre smartphone' :
                           locale === 'zh-CN' ? '通过智能手机在真实桥梁上查看您的锁' :
                           'See your lock appear on the actual bridge through your smartphone'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <ShieldCheck className="h-6 w-6 text-emerald-300 mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-white text-lg">
                          {locale === 'fr' ? 'Garantie à Vie' :
                           locale === 'zh-CN' ? '终身保证' :
                           'Lifetime Guarantee'}
                        </h4>
                        <p className="text-slate-300">
                          {locale === 'fr' ? 'Votre cadenas est stocké de manière permanente sur des serveurs décentralisés' :
                           locale === 'zh-CN' ? '您的锁永久存储在去中心化服务器上' :
                           'Your lock is permanently stored on decentralized servers'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-700">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-white mb-2">9,847+</div>
                      <div className="text-slate-300">
                        {locale === 'fr' ? 'Cadenas Placés Ce Mois' :
                         locale === 'zh-CN' ? '本月已放置锁具' :
                         'Locks Placed This Month'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =====================================================================================
            HOW IT WORKS - AVEC IMAGE AR INTEGRÉE (DEMANDÉ)
        ===================================================================================== */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                {locale === 'fr' ? (
                  <>Comment Placer Votre Cadenas sur le<br/><span className="text-[#e11d48]">Pont des Cadenas d&apos;Amour Paris</span></>
                ) : locale === 'zh-CN' ? (
                  <>如何在<span className="text-[#e11d48]">巴黎爱情锁桥</span><br/>上放置您的锁</>
                ) : (
                  <>How to Place Your Lock on the<br/><span className="text-[#e11d48]">Love Lock Bridge Paris France</span></>
                )}
              </h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                {locale === 'fr' ? 'Trois étapes simples pour immortaliser votre amour sur le Pont des Arts' :
                 locale === 'zh-CN' ? '三个简单步骤，将您的爱情永远铭刻在艺术桥上' :
                 'Three simple steps to immortalize your love on the historic Pont des Arts'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
              
              {/* IMAGE AR PREVIEW INTEGRÉE */}
              <div className="relative h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-50 order-2 md:order-1">
                <Image 
                  src="/images/ar-preview.png" 
                  alt="Augmented Reality Preview of Love Lock Bridge" 
                  fill 
                  className="object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg">
                  <p className="font-bold text-slate-900 text-sm text-center">
                      {locale === 'fr' ? "Vue Réelle via l'App" : "Actual View via App"}
                  </p>
                </div>
              </div>

              <div className="space-y-8 order-1 md:order-2">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-[#e11d48] font-bold text-xl shrink-0">1</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{locale === 'fr' ? 'Choisissez Votre Emplacement' : 'Choose Your Spot'}</h3>
                    <p className="text-slate-600">{locale === 'fr' ? 'Sélectionnez l\'emplacement parfait sur notre carte 3D interactive.' : 'Select the perfect location on our interactive 3D map.'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-[#e11d48] font-bold text-xl shrink-0">2</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{locale === 'fr' ? 'Personnalisez' : 'Personalize'}</h3>
                    <p className="text-slate-600">{locale === 'fr' ? 'Gravez vos noms, date et un message personnel.' : 'Engrave your names, date, and a personal message.'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-[#e11d48] font-bold text-xl shrink-0">3</div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{locale === 'fr' ? 'Visualisez en AR' : 'View in AR'}</h3>
                    <p className="text-slate-600">{locale === 'fr' ? 'Votre cadenas apparaît sur le vrai pont via votre téléphone.' : 'Your lock appears on the actual bridge through your phone.'}</p>
                  </div>
                </div>
                <div className="pt-6">
                   <Link href="/purchase">
                     <Button className="bg-slate-900 text-white px-8 py-6 rounded-full font-bold text-lg hover:bg-slate-800 w-full sm:w-auto">
                       {locale === 'fr' ? 'Commencer' : 'Start Now'} <ArrowRight className="ml-2"/>
                     </Button>
                   </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARKETPLACE TEASER */}
        <section className="py-24 bg-gradient-to-r from-amber-50 via-white to-emerald-50">
          <div className="container mx-auto px-4 max-w-6xl text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
              <TrendingUp className="h-5 w-5" />
              {locale === 'fr' ? 'OPPORTUNITÉ D\'INVESTISSEMENT EXCLUSIVE' :
               locale === 'zh-CN' ? '独家投资机会' :
               'EXCLUSIVE INVESTMENT OPPORTUNITY'}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
              {locale === 'fr' ? 'Achetez & Revendez Vos Cadenas' : 'Buy & Resell Your Digital Locks'}
            </h2>
            
            <p className="text-slate-700 text-lg max-w-3xl mx-auto mb-12">
              {locale === 'fr' ? 'Rejoignez notre marketplace exclusive : achetez des cadenas numériques et revendez-les à des collectionneurs.' :
               'Join our exclusive marketplace: purchase digital locks and resell them to collectors for profit.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-3xl border-2 border-emerald-100 shadow-lg text-center">
                <div className="text-5xl font-bold text-emerald-600 mb-4">+450%</div>
                <h4 className="font-bold text-slate-900 text-xl mb-3">{locale === 'fr' ? 'Profit Max' : 'Max Profit'}</h4>
              </div>
              <div className="bg-white p-8 rounded-3xl border-2 border-amber-100 shadow-lg text-center">
                <div className="text-5xl font-bold text-amber-600 mb-4">$12.5K</div>
                <h4 className="font-bold text-slate-900 text-xl mb-3">{locale === 'fr' ? 'Record de Vente' : 'Sales Record'}</h4>
              </div>
              <div className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-lg text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">72h</div>
                <h4 className="font-bold text-slate-900 text-xl mb-3">{locale === 'fr' ? 'Vente Rapide' : 'Quick Sale'}</h4>
              </div>
            </div>

            <div className="flex justify-center gap-6">
              <Link href="/marketplace">
                <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold px-10 py-6 rounded-full text-lg shadow-lg">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  {locale === 'fr' ? 'Explorer la Marketplace' : 'Explore Marketplace'}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <PurchaseNotifications />

        {/* =====================================================================================
            LIMITED TIME OFFER (Remonté AVANT la FAQ comme demandé)
        ===================================================================================== */}
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,72,0.4),transparent_50%)]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
            
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold uppercase tracking-wider mb-8 shadow-2xl">
              <Zap className="h-4 w-4" />
              {locale === 'fr' ? 'Offre à Durée Limitée' : 'Limited Time Offer'}
            </div>
            
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              {locale === 'fr' ? (
                <>Votre Histoire d&apos;Amour Mérite<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">L&apos;Héritage Parisien</span></>
              ) : (
                <>Your Love Story Deserves<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">The Parisian Legacy</span></>
              )}
            </h2>
            
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {locale === 'fr' ? (
                  <>Rejoignez la renaissance numérique de la tradition la plus romantique au monde. Sécurisez votre place sur l&apos;historique <strong>Pont des Cadenas d&apos;Amour</strong> avant que les emplacements premium ne disparaissent.</>
                ) : (
                  <>Join the digital renaissance of the world&apos;s most romantic tradition. Secure your spot on the historic <strong>Pont des Arts Love Lock Bridge</strong> before premium locations are gone.</>
                )}
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-white">$29.99</div>
                  <div className="text-sm text-slate-300">One-time payment</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-emerald-300">∞</div>
                  <div className="text-sm text-slate-300">Lifetime access</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-rose-300">4.9★</div>
                  <div className="text-sm text-slate-300">Rating</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/purchase" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-bold px-14 py-8 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                  <Lock className="mr-3 h-6 w-6" />
                  {locale === 'fr' ? 'Sécuriser Mon Cadenas • 29,99€' : 'Secure My Digital Lock • $29.99'}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ (DESCENDUE EN BAS) */}
        <section className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-4xl font-serif font-bold text-center text-slate-900 mb-12">FAQ</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem value="item-1" className="bg-white border border-slate-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-bold text-lg py-6">{locale === 'fr' ? 'Où se trouve le Pont des Arts ?' : 'Where is the Love Lock Bridge?'}</AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-6 text-lg">{locale === 'fr' ? 'Au cœur de Paris, face au Louvre (75006). GPS: 48.8583, 2.3374.' : 'In the heart of Paris, facing the Louvre (75006). GPS: 48.8583, 2.3374.'}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-xl px-6">
                <AccordionTrigger className="text-left font-bold text-lg py-6">{locale === 'fr' ? 'Est-ce légal ?' : 'Is it legal?'}</AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-6 text-lg">{locale === 'fr' ? 'Oui ! C\'est la seule alternative 100% légale aux cadenas physiques interdits.' : 'Yes! It is the only 100% legal alternative to banned physical locks.'}</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

      </main>

      {/* 5. FOOTER CORRIGÉ */}
      <footer className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
              
              <div>
                <div className="flex items-center gap-2 mb-6 text-white font-serif font-bold text-xl">
                  <Heart className="h-6 w-6 text-[#e11d48] fill-[#e11d48]" /> LoveLockParis
                </div>
                <p className="text-sm text-slate-400">
                  The official digital registry of the Pont des Arts.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-4">Platform</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/ar-view" className="block text-slate-600 hover:text-[#e11d48]">AR View</Link>
                  <Link href="/bridge" className="block text-slate-600 hover:text-[#e11d48]">3D Bridge</Link>
                  <Link href="/marketplace" className="block text-slate-600 hover:text-[#e11d48]">Marketplace</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-4">About</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/concept" className="block text-slate-600 hover:text-[#e11d48]">Concept & Value</Link>
                  <Link href="/about" className="block text-slate-600 hover:text-[#e11d48]">History about</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/legal" className="block text-slate-600 hover:text-[#e11d48]">Legal Notice</Link>
                  <Link href="/terms" className="block text-slate-600 hover:text-[#e11d48]">Terms of Service</Link>
                  <Link href="/privacy" className="block text-slate-600 hover:text-[#e11d48]">Privacy Policy</Link>
                </div>
              </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
             © 2026 PANORAMA GRUP. All rights reserved. LoveLockParis™ is a registered trademark.
          </div>
        </div>
      </footer>
    </div>
  );
}
