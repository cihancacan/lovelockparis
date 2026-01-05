import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
// CORRECTION ICI : J'ai ajouté 'Crown' dans la liste des imports
import { Lock, Heart, DollarSign, Globe, ShoppingCart, Target, Medal, ShieldCheck, ArrowRight, Smartphone, Coins, Users, MapPin, Star, TrendingUp, CheckCircle, Calendar, Eye, Award, Clock, Zap, ChevronRight, Trophy, Sparkles, InfinityIcon, Building, Euro, Crown } from 'lucide-react';
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

  // DONNÉES STRUCTURÉES MULTILINGUE
  const getStructuredData = () => {
    const baseSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "TouristAttraction",
          "name": "Love Lock Bridge Paris (Virtual Registry)",
          "alternateName": ["Lock of Love Bridge Paris", "Pont des Arts Love Locks", "Paris Love Lock Bridge"],
          "url": "https://lovelockparis.com",
          "image": "https://lovelockparis.com/images/hero-couple.jpg",
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
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Where is the Love Lock Bridge in Paris?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "The famous Love Lock Bridge is the Pont des Arts, located between the Louvre Museum and Institut de France in central Paris (75006)."
              }
            },
            {
              "@type": "Question",
              "name": "Are love locks still allowed on Pont des Arts?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No, placing physical locks has been illegal since 2015 due to structural damage. LoveLockParis offers the only legal digital alternative."
              }
            },
            {
              "@type": "Question",
              "name": "How does the digital love lock work?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Purchase a digital lock, customize it with your names, and view it in augmented reality when visiting the bridge or in 3D from anywhere."
              }
            }
          ]
        },
        {
          "@type": "Organization",
          "name": "LoveLockParis",
          "url": "https://lovelockparis.com",
          "logo": "https://lovelockparis.com/logo.png",
          "description": "Official digital love lock registry for Pont des Arts in Paris",
          "sameAs": [
            "https://www.instagram.com/lovelockparis",
            "https://www.facebook.com/lovelockparis",
            "https://twitter.com/lovelockparis"
          ]
        }
      ]
    };

    return baseSchema;
  };

  const jsonLd = getStructuredData();

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-rose-100 selection:text-rose-900">
      
      {/* Structured Data for SEO */}
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
            HERO SECTION - Optimisé pour "lock of love bridge paris"
        ===================================================================================== */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-0 pb-0">
          
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/hero-couple.png" 
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

            {/* Sous-titre */}
            <div className="max-w-4xl mx-auto">
              <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed drop-shadow-lg font-medium px-4">
                {locale === 'fr' ? (
                  <>Recherchez le <strong>Pont des Cadenas d'Amour Paris France</strong> ? Les cadenas physiques sont <strong>interdits depuis 2015</strong>. Rejoignez le registre officiel <strong>Love Lock Paris</strong>. Votre amour, immortalisé sur le Pont des Arts.</>
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

        {/* PROBLEM/SOLUTION SECTION */}
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
                      <>Le <span className="text-[#e11d48]">Pont des Cadenas d'Amour</span><br/>a Changé Pour Toujours</>
                    ) : locale === 'zh-CN' ? (
                      <>巴黎<span className="text-[#e11d48]">爱情锁桥</span><br/>已永久改变</>
                    ) : (
                      <>The <span className="text-[#e11d48]">Love Lock Bridge Paris</span><br/>Has Changed Forever</>
                    )}
                  </h2>
                  <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                    {locale === 'fr' ? (
                      <>Depuis 2015, placer des cadenas physiques sur le <strong>Pont des Arts à Paris</strong> est interdit et passible d'une amende de 500€. Les grilles d'origine se sont effondrées sous 45 tonnes de métal.</>
                    ) : locale === 'zh-CN' ? (
                      <>自2015年起，在<strong>巴黎艺术桥上</strong>放置实体锁已被禁止，违者将被处以500欧元罚款。原桥栏杆因承受45吨金属重量而倒塌。</>
                    ) : (
                      <>Since 2015, placing physical locks on the <strong>Pont des Arts bridge in Paris</strong> is illegal and punishable by €500 fines. The original bridge railings collapsed under 45 tons of metal locks.</>
                    )}
                  </p>
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
                        <li>• {locale === 'fr' ? 'Dégâts environnementaux' : locale === 'zh-CN' ? '环境破坏' : 'Environmental damage'}</li>
                        <li>• {locale === 'fr' ? 'Risque structurel' : locale === 'zh-CN' ? '桥梁结构风险' : 'Bridge structural risk'}</li>
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
                        <li>• {locale === 'fr' ? 'Zéro impact environnemental' : locale === 'zh-CN' ? '零环境影响' : 'Zero environmental impact'}</li>
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
                      <div className="text-sm text-slate-400 mt-2">
                        {locale === 'fr' ? 'Rejoignez des couples de 142 pays' :
                         locale === 'zh-CN' ? '加入来自142个国家的伴侣' :
                         'Join couples from 142 countries'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                {locale === 'fr' ? (
                  <>Comment Placer Votre Cadenas sur le<br/><span className="text-[#e11d48]">Pont des Cadenas d'Amour Paris</span></>
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

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">1</div>
                <Card className="h-full border-2 border-slate-100 shadow-lg hover:shadow-xl transition-shadow pt-12">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                      <MapPin className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                      {locale === 'fr' ? 'Choisissez Votre Emplacement' :
                       locale === 'zh-CN' ? '选择您的位置' :
                       'Choose Your Spot'}
                    </h3>
                    <p className="text-slate-700 text-center mb-6">
                      {locale === 'fr' ? 'Sélectionnez l\'emplacement parfait sur notre carte 3D interactive du <strong>Pont des Arts</strong>. Choisissez entre vue sur la Tour Eiffel, centre du pont, ou emplacements alignés sur le lever du soleil.' :
                       locale === 'zh-CN' ? '在我们<strong>艺术桥</strong>的交互式3D地图上选择完美位置。选择埃菲尔铁塔景观、桥中心或日出对齐位置。' :
                       'Select the perfect location on our interactive 3D map of the <strong>Pont des Arts bridge</strong>. Choose between Eiffel Tower view, bridge center, or sunrise alignment spots.'}
                    </p>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
                        {locale === 'fr' ? 'Le Plus Populaire : Vue Tour Eiffel' :
                         locale === 'zh-CN' ? '最受欢迎：埃菲尔铁塔景观' :
                         'Most Popular: Eiffel View'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">2</div>
                <Card className="h-full border-2 border-slate-100 shadow-lg hover:shadow-xl transition-shadow pt-12">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-[#e11d48] mb-6 mx-auto">
                      <Heart className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                      {locale === 'fr' ? 'Personnalisez Votre Cadenas' :
                       locale === 'zh-CN' ? '个性化您的锁' :
                       'Personalize Your Lock'}
                    </h3>
                    <p className="text-slate-700 text-center mb-6">
                      {locale === 'fr' ? 'Gravez vos noms, date et un message personnel. Choisissez parmi des designs de cadenas or, argent ou diamant. Téléchargez une photo ou vidéo secrète.' :
                       locale === 'zh-CN' ? '刻上您的姓名、日期和个人信息。选择金、银或钻石锁设计。上传秘密照片或视频信息。' :
                       'Engrave your names, date, and a personal message. Choose from gold, silver, or diamond lock designs. Upload a secret photo or video message.'}
                    </p>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 rounded-full text-sm font-bold">
                        {locale === 'fr' ? 'Personnalisation Illimitée' :
                         locale === 'zh-CN' ? '无限定制' :
                         'Unlimited Customization'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-rose-500 text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg">3</div>
                <Card className="h-full border-2 border-slate-100 shadow-lg hover:shadow-xl transition-shadow pt-12">
                  <CardContent className="p-8">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 mx-auto">
                      <Globe className="h-8 w-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">
                      {locale === 'fr' ? 'Expérience en RA' :
                       locale === 'zh-CN' ? '增强现实体验' :
                       'Experience in AR'}
                    </h3>
                    <p className="text-slate-700 text-center mb-6">
                      {locale === 'fr' ? 'Votre cadenas est ajouté de manière permanente au registre <strong>Love Lock Paris</strong>. Visualisez-le en réalité augmentée lorsque vous visitez le pont ou en 3D depuis n\'importe où dans le monde.' :
                       locale === 'zh-CN' ? '您的锁被永久添加到<strong>巴黎爱情锁</strong>注册处。访问桥梁时通过增强现实查看，或从世界任何地方通过3D查看。' :
                       'Your lock is permanently added to the <strong>Love Lock Paris</strong> registry. View it in augmented reality when visiting the bridge or in 3D from anywhere in the world.'}
                    </p>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">
                        {locale === 'fr' ? 'Accès à Vie' :
                         locale === 'zh-CN' ? '终身访问' :
                         'Lifetime Access'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>
          </div>
        </section>

        {/* MARKETPLACE SECTION */}
        <section className="py-24 bg-gradient-to-r from-amber-50 via-white to-emerald-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-bold uppercase tracking-wider mb-6 shadow-lg">
                <TrendingUp className="h-5 w-5" />
                {locale === 'fr' ? 'OPPORTUNITÉ D\'INVESTISSEMENT EXCLUSIVE' :
                 locale === 'zh-CN' ? '独家投资机会' :
                 'EXCLUSIVE INVESTMENT OPPORTUNITY'}
              </div>
              
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                {locale === 'fr' ? (
                  <>Achetez & Revendez Vos<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">Cadenas Numériques avec Profit</span></>
                ) : locale === 'zh-CN' ? (
                  <>购买并转售您的<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">数字锁以获取利润</span></>
                ) : (
                  <>Buy & Resell Your<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-800">Digital Locks for Profit</span></>
                )}
              </h2>
              
              <p className="text-slate-700 text-lg max-w-3xl mx-auto">
                {locale === 'fr' ? 'Rejoignez notre marketplace exclusive : achetez des cadenas numériques sur le Pont des Arts et revendez-les à des collectionneurs pour des profits significatifs.' :
                 locale === 'zh-CN' ? '加入我们的专属市场：购买艺术桥上的数字锁，并转售给收藏家以获取可观的利润。' :
                 'Join our exclusive marketplace: purchase digital locks on Pont des Arts and resell them to collectors for significant profits.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-8 rounded-3xl border-2 border-emerald-100 shadow-lg text-center">
                <div className="text-5xl font-bold text-emerald-600 mb-4">+450%</div>
                <h4 className="font-bold text-slate-900 text-xl mb-3">
                  {locale === 'fr' ? 'Profit Maximal' :
                   locale === 'zh-CN' ? '最高利润' :
                   'Maximum Profit'}
                </h4>
                <p className="text-slate-600">
                  {locale === 'fr' ? 'Certains numéros spéciaux ont augmenté de valeur jusqu\'à 450%' :
                   locale === 'zh-CN' ? '某些特殊编号价值增长高达450%' :
                   'Some special numbers have increased in value up to 450%'}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border-2 border-amber-100 shadow-lg text-center">
                <div className="text-5xl font-bold text-amber-600 mb-4">$12.5K</div>
                <h4 className="font-bold text-slate-900 text-xl mb-3">
                  {locale === 'fr' ? 'Record de Vente' :
                   locale === 'zh-CN' ? '最高销售额' :
                   'Sales Record'}
                </h4>
                <p className="text-slate-600">
                  {locale === 'fr' ? 'Cadenas #777 vendu pour 12,500 USD' :
                   locale === 'zh-CN' ? '锁具#777以12,500美元售出' :
                   'Lock #777 sold for 12,500 USD'}
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-3xl border-2 border-blue-100 shadow-lg text-center">
                <div className="text-5xl font-bold text-blue-600 mb-4">72h</div>
                <h4 className="font-bold text-slate-900 text-xl mb-3">
                  {locale === 'fr' ? 'Vente Rapide' :
                   locale === 'zh-CN' ? '快速销售' :
                   'Quick Sale'}
                </h4>
                <p className="text-slate-600">
                  {locale === 'fr' ? 'Temps moyen de vente pour les numéros premium' :
                   locale === 'zh-CN' ? '优质编号的平均销售时间' :
                   'Average sale time for premium numbers'}
                </p>
              </div>
            </div>

            <div className="mb-16">
              <h3 className="text-3xl font-bold text-slate-900 mb-10 text-center">
                {locale === 'fr' ? 'Exemples Réels de Profits' :
                 locale === 'zh-CN' ? '真实利润示例' :
                 'Real Profit Examples'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-2 border-slate-100 hover:border-emerald-200 transition-all hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-emerald-700 mx-auto mb-4">#777</div>
                    <div className="space-y-3">
                      <div><div className="text-sm text-slate-500">{locale === 'fr' ? 'Prix d\'achat' : 'Purchase Price'}</div><div className="text-xl font-bold text-slate-900">$149</div></div>
                      <div><div className="text-sm text-slate-500">{locale === 'fr' ? 'Prix de vente' : 'Sale Price'}</div><div className="text-2xl font-bold text-emerald-600">$12,500</div></div>
                      <div className="pt-3"><div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold">+8,288%</div></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-slate-100 hover:border-amber-200 transition-all hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-amber-700 mx-auto mb-4">#1313</div>
                    <div className="space-y-3">
                      <div><div className="text-sm text-slate-500">{locale === 'fr' ? 'Prix d\'achat' : 'Purchase Price'}</div><div className="text-xl font-bold text-slate-900">$79</div></div>
                      <div><div className="text-sm text-slate-500">{locale === 'fr' ? 'Prix de vente' : 'Sale Price'}</div><div className="text-2xl font-bold text-amber-600">$2,499</div></div>
                      <div className="pt-3"><div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-bold">+3,063%</div></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-700 mx-auto mb-4">#2024</div>
                    <div className="space-y-3">
                      <div><div className="text-sm text-slate-500">{locale === 'fr' ? 'Prix d\'achat' : 'Purchase Price'}</div><div className="text-xl font-bold text-slate-900">$49</div></div>
                      <div><div className="text-sm text-slate-500">{locale === 'fr' ? 'Prix de vente' : 'Sale Price'}</div><div className="text-2xl font-bold text-blue-600">$1,850</div></div>
                      <div className="pt-3"><div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">+3,676%</div></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-2 border-slate-100 hover:border-purple-200 transition-all hover:shadow-xl">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-purple-700 mx-auto mb-4">#888</div>
                    <div className="space-y-3">
                      <div><div className="text-sm text-slate-500">{locale === 'fr' ? 'Prix d\'achat' : 'Purchase Price'}</div><div className="text-xl font-bold text-slate-900">$49</div></div>
                      <div><div className="text-sm text-slate-500">{locale === 'fr' ? 'Prix de vente' : 'Sale Price'}</div><div className="text-2xl font-bold text-purple-600">$999</div></div>
                      <div className="pt-3"><div className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-bold">+3,345%</div></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.4),transparent_50%)]"></div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-4xl font-bold text-white mb-6">
                  {locale === 'fr' ? (
                    <>Prêt à <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Transformer $49.99 en $12,500</span> ?</>
                  ) : locale === 'zh-CN' ? (
                    <>准备好将<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">$49.99变成$12,500</span>吗？</>
                  ) : (
                    <>Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Turn $49.99 into $12,500</span> ?</>
                  )}
                </h3>
                
                <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
                  {locale === 'fr' ? 'Rejoignez notre marketplace exclusive de cadenas numériques. Achetez des numéros spéciaux, personnalisez-les et revendez-les à des collectionneurs du monde entier.' :
                   locale === 'zh-CN' ? '加入我们的数字锁专属市场。购买特殊编号，个性化定制，然后转售给全球收藏家。' :
                   'Join our exclusive digital lock marketplace. Purchase special numbers, customize them, and resell to collectors worldwide.'}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/marketplace" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold px-14 py-8 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                      <TrendingUp className="mr-3 h-6 w-6" />
                      {locale === 'fr' ? 'Explorer la Marketplace' :
                       locale === 'zh-CN' ? '探索市场' :
                       'Explore Marketplace'}
                    </Button>
                  </Link>
                  <Link href="/purchase?investment=true" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-3 border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-8 text-xl rounded-full">
                      <Coins className="mr-3" />
                      {locale === 'fr' ? 'Acheter à $29.99' :
                       locale === 'zh-CN' ? '以$29.99购买' :
                       'Buy Starting at $29.99'}
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-10 pt-8 border-t border-slate-700">
                  <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-400">
                    <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" />
                      {locale === 'fr' ? 'Garantie 30 jours' :
                       locale === 'zh-CN' ? '30天保证' :
                       '30-day guarantee'}
                    </span>
                    <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-400" />
                      {locale === 'fr' ? 'Propriété vérifiée' :
                       locale === 'zh-CN' ? '验证所有权' :
                       'Verified ownership'}
                    </span>
                    <span className="flex items-center gap-2"><Users className="h-4 w-4 text-purple-400" />
                      {locale === 'fr' ? '85,000+ collectionneurs' :
                       locale === 'zh-CN' ? '85,000+收藏家' :
                       '85,000+ collectors'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">
                {locale === 'fr' ? (
                  <>Tout sur le<br/><span className="text-[#e11d48]">Pont des Cadenas d'Amour Paris</span></>
                ) : locale === 'zh-CN' ? (
                  <>关于<span className="text-[#e11d48]">巴黎爱情锁桥</span><br/>的一切</>
                ) : (
                  <>Everything About the<br/><span className="text-[#e11d48]">Love Lock Bridge Paris</span></>
                )}
              </h2>
              <p className="text-slate-600 text-lg">
                {locale === 'fr' ? 'Réponses aux questions les plus recherchées sur le Pont des Arts et les cadenas d\'amour' :
                 locale === 'zh-CN' ? '关于艺术桥和爱情锁最常搜索问题的答案' :
                 'Answers to the most searched questions about Pont des Arts and love locks'}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              
              <AccordionItem value="item-1" className="bg-white border-2 border-slate-200 rounded-2xl px-6 shadow-sm hover:border-slate-300 transition-colors">
                <AccordionTrigger className="text-left font-bold text-slate-900 text-lg py-6">
                  <MapPin className="h-5 w-5 text-[#e11d48] mr-3" />
                  {locale === 'fr' ? 'Où se trouve exactement le Pont des Cadenas d\'Amour à Paris ?' :
                   locale === 'zh-CN' ? '巴黎爱情锁桥的具体位置在哪里？' :
                   'Where exactly is the Love Lock Bridge in Paris?'}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-6 text-lg">
                  {locale === 'fr' ? (
                    <>Le fameux <strong>Pont des Cadenas d'Amour Paris</strong> s'appelle officiellement <strong>Pont des Arts</strong>. Il est situé dans le 6ᵉ arrondissement de Paris (75006), reliant le Musée du Louvre à l'Institut de France. Coordonnées GPS : 48.858370° N, 2.337480° E. Ce pont piétonnier offre une vue iconique sur la Seine et a été le berceau historique des cadenas d'amour depuis le début de la tradition.</>
                  ) : locale === 'zh-CN' ? (
                    <>著名的<strong>巴黎爱情锁桥</strong>正式名称为<strong>艺术桥</strong>。它位于巴黎第6区（75006），连接卢浮宫博物馆和法兰西学院。GPS坐标：48.858370° N, 2.337480° E。这座人行桥提供了塞纳河的标志性景观，自传统开始以来一直是爱情锁的历史发源地。</>
                  ) : (
                    <>The famous <strong>Love Lock Bridge Paris</strong> is officially called <strong>Pont des Arts</strong>. It's located in the 6th arrondissement of Paris (75006), connecting the Louvre Museum to the Institut de France. GPS coordinates: 48.858370° N, 2.337480° E. This pedestrian bridge offers iconic views of the Seine River and has been the historic home of love locks since the tradition began.</>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border-2 border-slate-200 rounded-2xl px-6 shadow-sm hover:border-slate-300 transition-colors">
                <AccordionTrigger className="text-left font-bold text-slate-900 text-lg py-6">
                  <ShieldCheck className="h-5 w-5 text-amber-600 mr-3" />
                  {locale === 'fr' ? 'Puis-je encore mettre un cadenas physique sur le Pont des Arts ?' :
                   locale === 'zh-CN' ? '我还能在艺术桥上放置实体锁吗？' :
                   'Can I still put a physical lock on Pont des Arts?'}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-6 text-lg">
                  {locale === 'fr' ? (
                    <><strong>Non, c'est strictement interdit et illégal.</strong> Depuis juin 2015, la Ville de Paris a interdit d'attacher tout objet aux ponts. Les contrevenants risquent des amendes allant jusqu'à 500€. Les grilles d'origine ont été remplacées par des panneaux en verre spécialement conçus pour empêcher l'attachement des cadenas. <strong>LoveLockParis.com</strong> est le seul moyen autorisé et légal de perpétuer cette tradition romantique.</>
                  ) : locale === 'zh-CN' ? (
                    <><strong>不，这是严格禁止且违法的。</strong>自2015年6月起，巴黎市已禁止在桥上附着任何物品。违者将面临高达500欧元的罚款。原桥栏杆已更换为专门设计用于防止锁具附着的玻璃板。<strong>LoveLockParis.com</strong>是延续这一浪漫传统的唯一授权合法方式。</>
                  ) : (
                    <><strong>No, it is strictly prohibited and illegal.</strong> Since June 2015, the City of Paris has banned attaching any objects to bridges. Violators face fines up to €500. The original railings were replaced with glass panels specifically designed to prevent lock attachment. <strong>LoveLockParis.com</strong> is the only authorized and legal way to continue this romantic tradition.</>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border-2 border-slate-200 rounded-2xl px-6 shadow-sm hover:border-slate-300 transition-colors">
                <AccordionTrigger className="text-left font-bold text-slate-900 text-lg py-6">
                  <Globe className="h-5 w-5 text-blue-600 mr-3" />
                  {locale === 'fr' ? 'Comment le cadenas d\'amour numérique apparaît-il sur le vrai pont ?' :
                   locale === 'zh-CN' ? '数字爱情锁如何出现在真实桥梁上？' :
                   'How does the digital love lock appear on the actual bridge?'}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-6 text-lg">
                  {locale === 'fr' ? (
                    <>Grâce à notre technologie de réalité augmentée avancée. Lorsque vous visitez le <strong>Pont des Arts à Paris</strong>, ouvrez simplement l'application LoveLockParis sur votre smartphone et pointez votre caméra vers le pont. Votre cadenas numérique personnalisé apparaîtra exactement aux coordonnées GPS choisies, visible uniquement à travers votre appareil. Vous pouvez également le visualiser en 3D depuis n'importe où dans le monde via notre site web.</>
                  ) : locale === 'zh-CN' ? (
                    <>通过我们先进的增强现实技术。当您参观<strong>巴黎艺术桥</strong>时，只需在智能手机上打开LoveLockParis应用程序并将摄像头对准桥梁。您个性化的数字锁将精确出现在您选择的GPS坐标位置，仅通过您的设备可见。您还可以通过我们的网站在世界任何地方进行3D查看。</>
                  ) : (
                    <>Through our advanced augmented reality technology. When you visit the <strong>Pont des Arts in Paris</strong>, simply open the LoveLockParis app on your smartphone and point your camera at the bridge. Your personalized digital lock will appear exactly at your chosen GPS coordinates, visible only through your device. You can also view it in 3D from anywhere in the world via our website.</>
                  )}
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            <div className="mt-16 text-center">
              <Link href="/purchase">
                <Button size="lg" className="bg-gradient-to-r from-[#e11d48] to-rose-600 hover:from-rose-700 hover:to-[#be123c] text-white font-bold px-14 py-8 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                  <Heart className="mr-3 h-6 w-6" />
                  {locale === 'fr' ? 'Créer Votre Cadenas d\'Amour' :
                   locale === 'zh-CN' ? '立即创建您的爱情锁' :
                   'Create Your Love Lock Now'}
                </Button>
              </Link>
              <p className="text-slate-500 mt-6 text-sm">
                <ShieldCheck className="inline h-4 w-4 mr-1" />
                {locale === 'fr' ? 'Garantie de remboursement 30 jours • Pas de frais d\'abonnement' :
                 locale === 'zh-CN' ? '30天退款保证 • 无订阅费用' :
                 '30-day money-back guarantee • No subscription fees'}
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(225,29,72,0.4),transparent_50%)]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
            
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold uppercase tracking-wider mb-8 shadow-2xl">
              <Zap className="h-4 w-4" />
              {locale === 'fr' ? 'Offre à Durée Limitée' :
               locale === 'zh-CN' ? '限时优惠' :
               'Limited Time Offer'}
            </div>
            
            <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
              {locale === 'fr' ? (
                <>Votre Histoire d'Amour Mérite<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">L'Héritage Parisien</span></>
              ) : locale === 'zh-CN' ? (
                <>您的爱情故事值得<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">巴黎遗产</span></>
              ) : (
                <>Your Love Story Deserves<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">The Parisian Legacy</span></>
              )}
            </h2>
            
            <div className="max-w-3xl mx-auto mb-12">
              <p className="text-xl text-slate-300 mb-10 leading-relaxed">
                {locale === 'fr' ? (
                  <>Rejoignez la renaissance numérique de la tradition la plus romantique au monde. Sécurisez votre place sur l'historique <strong>Pont des Cadenas d'Amour</strong> avant que les emplacements premium ne disparaissent.</>
                ) : locale === 'zh-CN' ? (
                  <>加入世界上最浪漫传统的数字复兴。在优质位置消失之前，确保您在历史悠久的<strong>爱情锁桥</strong>上的位置。</>
                ) : (
                  <>Join the digital renaissance of the world's most romantic tradition. Secure your spot on the historic <strong>Pont des Arts Love Lock Bridge</strong> before premium locations are gone.</>
                )}
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-white">
                    {locale === 'fr' ? '29,99€' :
                     locale === 'zh-CN' ? '￥29.99' :
                     '$29.99'}
                  </div>
                  <div className="text-sm text-slate-300">
                    {locale === 'fr' ? 'Paiement unique' :
                     locale === 'zh-CN' ? '一次性付款' :
                     'One-time payment'}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-emerald-300">∞</div>
                  <div className="text-sm text-slate-300">
                    {locale === 'fr' ? 'Accès à vie' :
                     locale === 'zh-CN' ? '终身访问' :
                     'Lifetime access'}
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center">
                  <div className="text-3xl font-bold text-rose-300">4.9★</div>
                  <div className="text-sm text-slate-300">
                    {locale === 'fr' ? 'Note' :
                     locale === 'zh-CN' ? '评分' :
                     'Rating'}
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-10">
                <div className="flex items-center gap-4">
                  <TrendingUp className="h-8 w-8 text-amber-400" />
                  <div className="text-left">
                    <div className="font-bold text-white text-lg">
                      {locale === 'fr' ? '72% des places avec vue Tour Eiffel déjà prises' :
                       locale === 'zh-CN' ? '72%的埃菲尔铁塔景观位置已被占据' :
                       '72% of Eiffel View spots already taken'}
                    </div>
                    <div className="text-slate-300 text-sm">
                      {locale === 'fr' ? 'Les emplacements premium partent vite' :
                       locale === 'zh-CN' ? '优质位置销售迅速' :
                       'Premium locations selling fast'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/purchase" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-bold px-14 py-8 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                  <Lock className="mr-3 h-6 w-6" />
                  {locale === 'fr' ? 'Sécuriser Mon Cadenas • 29,99€' :
                   locale === 'zh-CN' ? '购买数字锁 • ￥29.99' :
                   'Secure My Digital Lock • $29.99'}
                </Button>
              </Link>
              <Link href="/bridge" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-3 border-white/40 bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-8 text-xl rounded-full">
                  <Globe className="mr-3" />
                  {locale === 'fr' ? 'Voir les Places Disponibles' :
                   locale === 'zh-CN' ? '查看可用位置' :
                   'View Available Spots'}
                </Button>
              </Link>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-700">
              <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400">
                <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-400" />
                  {locale === 'fr' ? 'Pas de frais cachés' :
                   locale === 'zh-CN' ? '无隐藏费用' :
                   'No hidden fees'}
                </span>
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-blue-400" />
                  {locale === 'fr' ? 'Cryptage 256-bit' :
                   locale === 'zh-CN' ? '256位加密' :
                   '256-bit encryption'}
                </span>
                <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-purple-400" />
                  {locale === 'fr' ? 'Livraison instantanée' :
                   locale === 'zh-CN' ? '即时交付' :
                   'Instant delivery'}
                </span>
                <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-rose-400" />
                  {locale === 'fr' ? 'Garantie 30 jours' :
                   locale === 'zh-CN' ? '30天保证' :
                   '30-day guarantee'}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PurchaseNotifications />

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="h-8 w-8 text-[#e11d48] fill-[#e11d48]" />
                  <span className="text-2xl font-serif font-bold text-slate-900">LoveLock<span className="text-[#e11d48]">Paris</span></span>
                </div>
                <p className="text-sm text-slate-600">
                  {locale === 'fr' ? 'Le registre numérique officiel du Pont des Cadenas d\'Amour. Préservant le romantisme, protégeant le patrimoine depuis 2026.' :
                   locale === 'zh-CN' ? '艺术桥爱情锁的官方数字注册处。自2026年起，保护浪漫，守护遗产。' :
                   'The official digital registry of the Pont des Arts Love Lock Bridge. Preserving romance, protecting heritage since 2026.'}
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">
                  {locale === 'fr' ? 'Informations Pont des Arts' :
                   locale === 'zh-CN' ? '艺术桥信息' :
                   'Love Lock Bridge Info'}
                </h4>
                <div className="space-y-2 text-sm">
                  <a href="/location" className="block text-slate-600 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Carte du Pont' :
                     locale === 'zh-CN' ? '桥梁位置地图' :
                     'Bridge Location Map'}
                  </a>
                  <a href="/history" className="block text-slate-600 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Histoire du Pont des Arts' :
                     locale === 'zh-CN' ? '艺术桥历史' :
                     'History of Pont des Arts'}
                  </a>
                  <a href="/tradition" className="block text-slate-600 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Tradition des Cadenas' :
                     locale === 'zh-CN' ? '爱情锁传统' :
                     'Love Lock Tradition'}
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">
                  {locale === 'fr' ? 'Cadenas Numériques' :
                   locale === 'zh-CN' ? '数字锁' :
                   'Digital Locks'}
                </h4>
                <div className="space-y-2 text-sm">
                  <a href="/purchase" className="block text-slate-600 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Acheter un Cadenas' :
                     locale === 'zh-CN' ? '购买数字锁' :
                     'Buy Digital Lock'}
                  </a>
                  <a href="/design" className="block text-slate-600 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Designs de Cadenas' :
                     locale === 'zh-CN' ? '锁具设计' :
                     'Lock Designs'}
                  </a>
                  <a href="/ar-guide" className="block text-slate-600 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Guide de Visualisation RA' :
                     locale === 'zh-CN' ? '增强现实查看指南' :
                     'AR Viewing Guide'}
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">
                  {locale === 'fr' ? 'Entreprise' :
                   locale === 'zh-CN' ? '公司' :
                   'Company'}
                </h4>
                <div className="space-y-2 text-sm">
                  <a href="/about" className="block text-slate-600 hover:text-[#e11d48]">About Us</a>
                  <a href="/contact" className="block text-slate-600 hover:text-[#e11d48]">Contact</a>
                  <a href="/press" className="block text-slate-600 hover:text-[#e11d48]">Press & Media</a>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 text-center">
              <div className="mb-6">
                <p className="text-sm text-slate-600">
                  {locale === 'fr' ? 'Pont des Cadenas d\'Amour Paris • Pont des Arts • 75006 Paris, France • GPS : 48.858370, 2.337480' :
                   locale === 'zh-CN' ? '巴黎爱情锁桥 • 艺术桥 • 75006 巴黎, 法国 • GPS: 48.858370, 2.337480' :
                   'Love Lock Bridge Paris • Pont des Arts • 75006 Paris, France • GPS: 48.858370, 2.337480'}
                </p>
              </div>
              
              <div className="text-xs text-slate-500 space-y-2">
                <p>© 2026 PANORAMA GRUP. All rights reserved. LoveLockParis™ is a registered trademark.</p>
                <div className="flex justify-center gap-6 mt-4 text-xs">
                  <a href="/legal" className="text-slate-500 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Mentions Légales' :
                     locale === 'zh-CN' ? '法律声明' :
                     'Legal Notice'}
                  </a>
                  <a href="/terms" className="text-slate-500 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Conditions d\'Utilisation' :
                     locale === 'zh-CN' ? '服务条款' :
                     'Terms of Service'}
                  </a>
                  <a href="/privacy" className="text-slate-500 hover:text-[#e11d48]">
                    {locale === 'fr' ? 'Politique de Confidentialité' :
                     locale === 'zh-CN' ? '隐私政策' :
                     'Privacy Policy'}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
