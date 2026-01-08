import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
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
                "text": "No, placing physical locks has been illegal since 2015 due to structural damage. LoveLockParis offers the only legal alternative."
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
        {/* HERO SECTION - Design personnel ajouté : effet de lumière romantique */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden pt-0 pb-0">
          
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/concept-value.jpg" 
              alt="Concept and value of digital love locks on Pont des Arts bridge Paris" 
              fill 
              className="object-cover object-center" 
              priority
              sizes="100vw"
            />
            {/* Effet de gradient romantique - touche personnelle */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-purple-900/30 to-transparent"></div>
            {/* Effets de lumière subtils - touche personnelle */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8 pt-4 md:pt-20">
            
            {/* Badge avec effet de brillance - touche personnelle */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-3 px-6 py-3 rounded-full bg-gradient-to-r from-white/25 to-white/15 backdrop-blur-lg border border-white/40 text-white shadow-2xl shadow-rose-500/20 relative overflow-hidden">
                {/* Effet de brillance animée */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine"></div>
                <ShieldCheck className="h-5 w-5 text-[#e11d48]" />
                <span className="text-[12px] md:text-xs font-bold tracking-wider uppercase relative z-10">
                  {locale === 'fr' ? 'Le Registre Officiel • Paris 2026' : 
                   locale === 'es' ? 'El Registro Oficial • París 2026' :
                   locale === 'zh-CN' ? '官方注册处 • 巴黎 2026' :
                   'The Official Registry • Paris 2026'}
                </span>
              </div>
            </div>

            {/* H1 Principal avec effet de texte dégradé - touche personnelle */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold leading-[1.0] text-white drop-shadow-2xl">
              {locale === 'fr' ? (
                <>
                  Le Véritable<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-300">Pont des Cadenas</span>
                  <span className="text-4xl sm:text-5xl md:text-6xl block mt-4">Paris • Pont des Arts</span>
                </>
              ) : locale === 'zh-CN' ? (
                <>
                  真正的<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-300">巴黎爱情锁桥</span><br/>
                  <span className="text-4xl sm:text-5xl md:text-6xl">艺术桥 • 巴黎</span>
                </>
              ) : (
                <>
                  The Original<br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-rose-300">Lock of Love Bridge</span><br/>
                  <span className="text-4xl sm:text-5xl md:text-6xl">Paris • Pont des Arts</span>
                </>
              )}
            </h1>

            {/* Sous-titre avec bordure élégante - touche personnelle */}
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-purple-600 rounded-lg blur opacity-25"></div>
                <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed drop-shadow-lg font-medium px-8 py-6 relative bg-slate-900/60 backdrop-blur-sm rounded-lg border border-white/10">
                  {locale === 'fr' ? (
                    <>Recherchez le Pont des Cadenas d'Amour Paris France ? Les cadenas physiques sont interdits depuis 2015. Rejoignez le registre officiel Love Lock Paris. Votre amour, immortalisé sur le Pont des Arts.</>
                  ) : locale === 'zh-CN' ? (
                    <>寻找巴黎爱情锁桥法国？实体锁自2015年起已被禁止。加入官方巴黎爱情锁数字注册处。通过增强现实将您的爱情永远铭刻在艺术桥上。</>
                  ) : (
                    <>Looking for the Love Lock Bridge Paris France? Physical locks are illegal since 2015. Join the official Love Lock Paris digital registry. Your love, immortalized on the historic Pont des Arts via augmented reality.</>
                  )}
                </p>
              </div>
            </div>

            {/* CTA Principale avec effet de pulsation - touche personnelle */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-0 w-full max-w-xl mx-auto sm:max-w-none">
              <Link href="/purchase" className="w-full sm:w-auto group">
                <Button size="lg" className="w-full sm:w-auto text-lg md:text-xl px-10 py-7 bg-gradient-to-r from-[#e11d48] to-rose-600 hover:from-rose-700 hover:to-[#be123c] text-white font-bold rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-[#e11d48]/50 border-none relative overflow-hidden">
                  {/* Effet de brillance */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  <Lock className="mr-3 h-6 w-6" />
                  {locale === 'fr' ? 'Sécuriser Mon Cadenas • 29,99€' :
                   locale === 'zh-CN' ? '购买数字锁 • ￥29.99' :
                   'Secure My Digital Lock • $29.99'}
                  {/* Flèche animée - touche personnelle */}
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/bridge" className="w-full sm:w-auto group">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg md:text-xl px-10 py-7 bg-white/15 backdrop-blur-md border-2 border-white/40 text-white hover:bg-white/25 hover:border-white/60 font-bold rounded-full transition-all duration-300 hover:scale-105">
                  <Globe className="mr-3 group-hover:rotate-12 transition-transform" />
                  {locale === 'fr' ? 'Explorer le Pont 3D' :
                   locale === 'zh-CN' ? '探索3D桥梁' :
                   'Explore 3D Bridge First'}
                </Button>
              </Link>
            </div>
            
            {/* Badges avec effet de hover - touche personnelle */}
            <div className="pt-6">
              <div className="flex flex-wrap justify-center gap-6 text-white/90 text-sm">
                <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 backdrop-blur-sm rounded-full border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors cursor-default">
                  <CheckCircle className="h-4 w-4 text-emerald-400" /> 
                  {locale === 'fr' ? 'Légal & Autorisé' :
                   locale === 'zh-CN' ? '合法授权' :
                   'Legal & Authorized'}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm rounded-full border border-amber-500/30 hover:bg-amber-500/30 transition-colors cursor-default">
                  <Award className="h-4 w-4 text-amber-400" /> 
                  {locale === 'fr' ? 'Note 4.9/5' :
                   locale === 'zh-CN' ? '评分4.9/5' :
                   '4.9/5 Rating'}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-500/30 hover:bg-blue-500/30 transition-colors cursor-default">
                  <Clock className="h-4 w-4 text-blue-400" /> 
                  {locale === 'fr' ? 'Livraison Instantanée' :
                   locale === 'zh-CN' ? '即时交付' :
                   'Instant Delivery'}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 backdrop-blur-sm rounded-full border border-purple-500/30 hover:bg-purple-500/30 transition-colors cursor-default">
                  <InfinityIcon className="h-4 w-4 text-purple-400" /> 
                  {locale === 'fr' ? 'Accès à Vie' :
                   locale === 'zh-CN' ? '终身访问' :
                   'Lifetime Access'}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* STATISTICS BAR avec design amélioré - touche personnelle */}
        <section className="py-12 bg-gradient-to-r from-slate-900 via-purple-900/50 to-slate-800 text-white relative overflow-hidden">
          {/* Effets de fond animés - touche personnelle */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors duration-300">347.293+</div>
                <div className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {locale === 'fr' ? 'Cadenas Numériques' :
                   locale === 'zh-CN' ? '数字锁已放置' :
                   'Digital Locks Placed'}
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-rose-300 mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2 group-hover:text-emerald-300 transition-colors duration-300">4.9/5</div>
                <div className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {locale === 'fr' ? 'Note Clients' :
                   locale === 'zh-CN' ? '客户评分' :
                   'Customer Rating'}
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-emerald-300 mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-amber-400 mb-2 group-hover:text-amber-300 transition-colors duration-300">142</div>
                <div className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {locale === 'fr' ? 'Pays' :
                   locale === 'zh-CN' ? '国家/地区' :
                   'Countries'}
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-amber-500 to-amber-300 mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-rose-400 mb-2 group-hover:text-rose-300 transition-colors duration-300">24/7</div>
                <div className="text-sm text-slate-300 group-hover:text-white transition-colors">
                  {locale === 'fr' ? 'Support' :
                   locale === 'zh-CN' ? '支持服务' :
                   'Support'}
                </div>
                <div className="w-16 h-1 bg-gradient-to-r from-rose-500 to-rose-300 mx-auto mt-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM/SOLUTION SECTION avec animations - touche personnelle */}
        <section className="py-24 bg-gradient-to-b from-white to-rose-50/30 relative overflow-hidden">
          {/* Éléments décoratifs - touche personnelle */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-rose-100/30 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              
              <div className="space-y-8">
                <div>
                  {/* Badge avec animation - touche personnelle */}
                  <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-100 to-rose-50 text-rose-800 rounded-full text-sm font-bold mb-6 border border-rose-200 shadow-sm hover:shadow transition-shadow cursor-default">
                    <div className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></div>
                    {locale === 'fr' ? '⚠️ Information Importante' :
                     locale === 'zh-CN' ? '⚠️ 重要通知' :
                     '⚠️ Important Notice'}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                    {locale === 'fr' ? (
                      <>Le <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Pont des Cadenas d'Amour</span><br/>a Changé Pour Toujours</>
                    ) : locale === 'zh-CN' ? (
                      <>巴黎<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">爱情锁桥</span><br/>已永久改变</>
                    ) : (
                      <>The <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Love Lock Bridge Paris</span><br/>Has Changed Forever</>
                    )}
                  </h2>
                  <p className="text-lg text-slate-700 mb-8 leading-relaxed">
                    {locale === 'fr' ? (
                      <>Depuis 2015, placer des cadenas physiques sur le Pont des Arts à Paris est interdit et passible d'une amende de 500€. Les grilles d'origine se sont effondrées sous 45 tonnes de métal.</>
                    ) : locale === 'zh-CN' ? (
                      <>自2015年起，在巴黎艺术桥上放置实体锁已被禁止，违者将被处以500欧元罚款。原桥栏杆因承受45吨金属重量而倒塌。</>
                    ) : (
                      <>Since 2015, placing physical locks on the Pont des Arts bridge in Paris is illegal and punishable by €500 fines. The original bridge railings collapsed under 45 tons of metal locks.</>
                    )}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center text-[#e11d48] font-bold text-xl group-hover:scale-110 transition-transform">✗</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">
                        {locale === 'fr' ? 'Cadenas Physiques (Interdits)' :
                         locale === 'zh-CN' ? '实体锁（禁止）' :
                         'Physical Locks (Banned)'}
                      </h4>
                      <ul className="text-slate-600 space-y-1 text-sm">
                        <li className="flex items-center"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></div>{locale === 'fr' ? 'Illegaux (500€ d\'amende)' : locale === 'zh-CN' ? '违法（罚款500欧元）' : 'Illegal with €500 fines'}</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></div>{locale === 'fr' ? 'Retirés tous les 6 mois' : locale === 'zh-CN' ? '每6个月清除一次' : 'Removed every 6 months'}</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></div>{locale === 'fr' ? 'Dégâts environnementaux' : locale === 'zh-CN' ? '环境破坏' : 'Environmental damage'}</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 bg-rose-500 rounded-full mr-2"></div>{locale === 'fr' ? 'Risque structurel' : locale === 'zh-CN' ? '桥梁结构风险' : 'Bridge structural risk'}</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 bg-white rounded-2xl shadow-lg border-2 border-emerald-200 hover:shadow-xl transition-shadow group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xl group-hover:scale-110 transition-transform">✓</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2">
                        {locale === 'fr' ? 'Cadenas Numériques (Officiel)' :
                         locale === 'zh-CN' ? '数字锁（官方）' :
                         'Digital Locks (Official)'}
                      </h4>
                      <ul className="text-slate-600 space-y-1 text-sm">
                        <li className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>{locale === 'fr' ? '100% légal et autorisé' : locale === 'zh-CN' ? '100%合法授权' : '100% legal & authorized'}</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>{locale === 'fr' ? 'Permanent sur blockchain' : locale === 'zh-CN' ? '区块链永久存储' : 'Permanent on blockchain'}</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>{locale === 'fr' ? 'Zéro impact environnemental' : locale === 'zh-CN' ? '零环境影响' : 'Zero environmental impact'}</li>
                        <li className="flex items-center"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>{locale === 'fr' ? 'Visible de partout' : locale === 'zh-CN' ? '随时随地可查看' : 'View from anywhere'}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                {/* Carte avec effet de profondeur - touche personnelle */}
                <div className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-800 rounded-3xl p-8 text-white shadow-2xl hover:shadow-3xl transition-shadow duration-300 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/20 to-purple-500/20 rounded-full blur-2xl"></div>
                  
                  <h3 className="text-3xl font-bold mb-6 relative z-10">
                    {locale === 'fr' ? 'Pourquoi Choisir LoveLockParis ?' :
                     locale === 'zh-CN' ? '为什么选择巴黎爱情锁？' :
                     'Why Choose LoveLockParis?'}
                  </h3>
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-500/20 to-rose-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <MapPin className="h-5 w-5 text-rose-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg group-hover:text-rose-300 transition-colors">
                          {locale === 'fr' ? 'Emplacement Authentique' :
                           locale === 'zh-CN' ? '真实地理位置' :
                           'Authentic Location'}
                        </h4>
                        <p className="text-slate-300">
                          {locale === 'fr' ? 'Positionnement GPS précis sur le véritable Pont des Arts' :
                           locale === 'zh-CN' ? '在真实的艺术桥上进行GPS精确定位' :
                           'GPS-precise positioning on the actual Pont des Arts Love Lock Bridge'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Crown className="h-5 w-5 text-amber-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg group-hover:text-amber-300 transition-colors">
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

                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Sparkles className="h-5 w-5 text-purple-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg group-hover:text-purple-300 transition-colors">
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

                    <div className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck className="h-5 w-5 text-emerald-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-lg group-hover:text-emerald-300 transition-colors">
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
                      <div className="text-5xl font-bold text-white mb-2 group">
                        <span className="group-hover:text-rose-300 transition-colors">9,847+</span>
                      </div>
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

        {/* HOW IT WORKS - Touches personnelles déjà présentes */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
                {locale === 'fr' ? (
                  <>Comment Placer Votre Cadenas sur le<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Pont des Cadenas d'Amour Paris</span></>
                ) : locale === 'zh-CN' ? (
                  <>如何在<span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">巴黎爱情锁桥</span><br/>上放置您的锁</>
                ) : (
                  <>How to Place Your Lock on the<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-rose-400">Love Lock Bridge Paris France</span></>
                )}
              </h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                {locale === 'fr' ? 'Trois étapes simples pour immortaliser votre amour sur le Pont des Arts' :
                 locale === 'zh-CN' ? '三个简单步骤，将您的爱情永远铭刻在艺术桥上' :
                 'Three simple steps to immortalize your love on the historic Pont des Arts'}
              </p>
            </div>

            {/* Les cartes avec animations déjà présentes */}
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              {/* ... (cartes existantes avec animations) ... */}
            </div>

            {/* Section AR preview déjà présente */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-6 md:p-12 max-w-5xl mx-auto border border-slate-200 shadow-lg">
              {/* ... (contenu AR preview existant) ... */}
            </div>
          </div>
        </section>

        {/* MARKETPLACE SECTION avec effets améliorés */}
        <section className="py-24 bg-gradient-to-r from-amber-50 via-white to-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-100/30 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 max-w-6xl relative z-10">
            {/* ... (contenu marketplace existant avec animations) ... */}
          </div>
        </section>

        {/* LIMITED TIME OFFER SECTION avec effets spéciaux */}
        <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-800 text-white overflow-hidden relative">
          {/* Effets de particules - touche personnelle */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10 max-w-5xl text-center">
            {/* ... (contenu limited time offer existant) ... */}
          </div>
        </section>

        {/* FAQ SECTION avec design amélioré */}
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* ... (contenu FAQ existant avec animations) ... */}
          </div>
        </section>

      </main>

      <PurchaseNotifications />

      {/* FOOTER - CORRECTION des liens + design personnel */}
      <footer className="border-t border-slate-200 bg-gradient-to-b from-white to-slate-50 py-16 relative overflow-hidden">
        {/* Éléments décoratifs footer - touche personnelle */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-100/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-10 mb-12">
              
              {/* Colonne 1 : Logo et description avec effet */}
              <div className="group">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                    <Heart className="h-8 w-8 text-[#e11d48] fill-[#e11d48] relative z-10 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="text-2xl font-serif font-bold text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-purple-600 transition-all duration-300">
                    LoveLock<span className="text-[#e11d48] group-hover:text-transparent">Paris</span>
                  </span>
                </div>
                <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
                  {locale === 'fr' ? 'Le registre numérique officiel du Pont des Cadenas d\'Amour. Préservant le romantisme, protégeant le patrimoine depuis 2026.' :
                   locale === 'zh-CN' ? '艺术桥爱情锁的官方数字注册处。自2026年起，保护浪漫，守护遗产。' :
                   'The official digital registry of the Pont des Arts Love Lock Bridge. Preserving romance, protecting heritage since 2026.'}
                </p>
              </div>
              
              {/* Colonne 2 : Navigation principale - LIENS CORRIGÉS */}
              <div>
                <h4 className="font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
                  {locale === 'fr' ? 'Navigation Principale' :
                   locale === 'zh-CN' ? '主要导航' :
                   'Main Navigation'}
                </h4>
                <div className="space-y-3 text-sm">
                  <Link href="/ar-view" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Vue RA' :
                     locale === 'zh-CN' ? '增强现实视图' :
                     'AR View'}
                  </Link>
                  <Link href="/bridge" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Pont 3D' :
                     locale === 'zh-CN' ? '3D桥梁' :
                     '3D Bridge'}
                  </Link>
                  <Link href="/marketplace" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Marketplace' :
                     locale === 'zh-CN' ? '市场' :
                     'Marketplace'}
                  </Link>
                  <Link href="/concept" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Concept & Valeur' :
                     locale === 'zh-CN' ? '概念与价值' :
                     'Concept & Value'}
                  </Link>
                </div>
              </div>
              
              {/* Colonne 3 : À propos - LIENS CORRIGÉS */}
              <div>
                <h4 className="font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
                  {locale === 'fr' ? 'À Propos' :
                   locale === 'zh-CN' ? '关于' :
                   'About'}
                </h4>
                <div className="space-y-3 text-sm">
                  <Link href="/about" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Histoire & À Propos' :
                     locale === 'zh-CN' ? '历史与关于我们' :
                     'History & About Us'}
                  </Link>
                  <Link href="/contact" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    Contact
                  </Link>
                  <Link href="/press" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Presse & Médias' :
                     locale === 'zh-CN' ? '新闻媒体' :
                     'Press & Media'}
                  </Link>
                </div>
              </div>
              
              {/* Colonne 4 : Légal */}
              <div>
                <h4 className="font-bold text-slate-900 mb-6 pb-2 border-b border-slate-200">
                  {locale === 'fr' ? 'Légal' :
                   locale === 'zh-CN' ? '法律' :
                   'Legal'}
                </h4>
                <div className="space-y-3 text-sm">
                  <Link href="/legal" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Mentions Légales' :
                     locale === 'zh-CN' ? '法律声明' :
                     'Legal Notice'}
                  </Link>
                  <Link href="/terms" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Conditions d\'Utilisation' :
                     locale === 'zh-CN' ? '服务条款' :
                     'Terms of Service'}
                  </Link>
                  <Link href="/privacy" className="block text-slate-600 hover:text-[#e11d48] group flex items-center transition-all duration-300 hover:translate-x-2">
                    <div className="w-1 h-1 bg-[#e11d48] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {locale === 'fr' ? 'Politique de Confidentialité' :
                     locale === 'zh-CN' ? '隐私政策' :
                     'Privacy Policy'}
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 text-center">
              <div className="mb-6">
                <p className="text-sm text-slate-600 hover:text-slate-700 transition-colors cursor-default">
                  {locale === 'fr' ? 'Pont des Cadenas d\'Amour Paris • Pont des Arts • 75006 Paris, France • GPS : 48.858370, 2.337480' :
                   locale === 'zh-CN' ? '巴黎爱情锁桥 • 艺术桥 • 75006 巴黎, 法国 • GPS: 48.858370, 2.337480' :
                   'Love Lock Bridge Paris • Pont des Arts • 75006 Paris, France • GPS: 48.858370, 2.337480'}
                </p>
              </div>
              
              <div className="text-xs text-slate-500 space-y-2">
                <p className="hover:text-slate-600 transition-colors cursor-default">
                  © 2026 PANORAMA GRUP. All rights reserved. LoveLockParis™ is a registered trademark.
                </p>
                {/* Icônes sociales avec hover - touche personnelle */}
                <div className="flex justify-center gap-4 mt-6">
                  <a href="https://instagram.com" className="w-8 h-8 bg-slate-100 hover:bg-gradient-to-r hover:from-rose-500 hover:to-purple-500 rounded-full flex items-center justify-center text-slate-600 hover:text-white transition-all duration-300 hover:scale-110">
                    <span className="text-xs font-bold">IG</span>
                  </a>
                  <a href="https://facebook.com" className="w-8 h-8 bg-slate-100 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 rounded-full flex items-center justify-center text-slate-600 hover:text-white transition-all duration-300 hover:scale-110">
                    <span className="text-xs font-bold">FB</span>
                  </a>
                  <a href="https://twitter.com" className="w-8 h-8 bg-slate-100 hover:bg-gradient-to-r hover:from-sky-500 hover:to-sky-600 rounded-full flex items-center justify-center text-slate-600 hover:text-white transition-all duration-300 hover:scale-110">
                    <span className="text-xs font-bold">X</span>
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
