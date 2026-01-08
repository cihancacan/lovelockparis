import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';
import { Lock, Heart, Globe, Smartphone, Coins, Users, MapPin, TrendingUp, CheckCircle, Award, Clock, InfinityIcon, Sparkles, ShieldCheck, Crown, Zap, ArrowRight, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Header } from '@/components/home/header';
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
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
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
        {/* HERO SECTION - Design startup moderne */}
        <section className="relative min-h-[90vh] flex flex-col justify-center items-center text-center px-4 overflow-hidden">
          
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/concept-value.jpg" 
              alt="Concept and value of digital love locks on Pont des Arts bridge Paris" 
              fill 
              className="object-cover object-center" 
              priority
              sizes="100vw"
            />
            {/* Overlay moderne */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-900/90"></div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto w-full space-y-8 pt-4 md:pt-20">
            
            {/* Badge startup */}
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold tracking-wider">
                  {locale === 'fr' ? 'LE REGISTRE OFFICIEL' : 
                   locale === 'zh-CN' ? '官方注册处' :
                   'THE OFFICIAL REGISTRY'}
                </span>
              </div>
            </div>

            {/* H1 Principal - Typographie moderne */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] text-white">
                {locale === 'fr' ? (
                  <>
                    Le Véritable<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Pont des Cadenas</span>
                  </>
                ) : locale === 'zh-CN' ? (
                  <>
                    真正的<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">巴黎爱情锁桥</span>
                  </>
                ) : (
                  <>
                    The Original<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Lock of Love Bridge</span>
                  </>
                )}
              </h1>
              <p className="text-xl text-slate-300 font-medium">
                Paris • Pont des Arts
              </p>
            </div>

            {/* Sous-titre */}
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-slate-200 leading-relaxed font-light">
                {locale === 'fr' ? (
                  <>Recherchez le Pont des Cadenas d'Amour Paris France ? Les cadenas physiques sont interdits depuis 2015. Rejoignez le registre officiel Love Lock Paris. Votre amour, immortalisé sur le Pont des Arts.</>
                ) : locale === 'zh-CN' ? (
                  <>寻找巴黎爱情锁桥法国？实体锁自2015年起已被禁止。加入官方巴黎爱情锁数字注册处。通过增强现实将您的爱情永远铭刻在艺术桥上。</>
                ) : (
                  <>Looking for the Love Lock Bridge Paris France? Physical locks are illegal since 2015. Join the official Love Lock Paris digital registry. Your love, immortalized on the historic Pont des Arts via augmented reality.</>
                )}
              </p>
            </div>

            {/* CTA Principale - Design startup */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 w-full max-w-xl mx-auto sm:max-w-none">
              <Link href="/purchase" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <Lock className="mr-3 h-5 w-5" />
                  {locale === 'fr' ? 'Sécuriser Mon Cadenas • 29,99€' :
                   locale === 'zh-CN' ? '购买数字锁 • ￥29.99' :
                   'Secure My Digital Lock • $29.99'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/bridge" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 py-6 bg-white/5 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/10 font-semibold rounded-lg">
                  <Globe className="mr-3 h-5 w-5" />
                  {locale === 'fr' ? 'Explorer le Pont 3D' :
                   locale === 'zh-CN' ? '探索3D桥梁' :
                   'Explore 3D Bridge First'}
                </Button>
              </Link>
            </div>
            
            {/* Trust badges - Design moderne */}
            <div className="pt-8">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg">
                  <CheckCircle className="h-4 w-4 text-emerald-400" />
                  <span className="text-slate-300">
                    {locale === 'fr' ? 'Légal & Autorisé' :
                     locale === 'zh-CN' ? '合法授权' :
                     'Legal & Authorized'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg">
                  <Award className="h-4 w-4 text-amber-400" />
                  <span className="text-slate-300">
                    {locale === 'fr' ? 'Note 4.9/5' :
                     locale === 'zh-CN' ? '评分4.9/5' :
                     '4.9/5 Rating'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg">
                  <Clock className="h-4 w-4 text-blue-400" />
                  <span className="text-slate-300">
                    {locale === 'fr' ? 'Livraison Instantanée' :
                     locale === 'zh-CN' ? '即时交付' :
                     'Instant Delivery'}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-white/5 backdrop-blur-sm rounded-lg">
                  <InfinityIcon className="h-4 w-4 text-purple-400" />
                  <span className="text-slate-300">
                    {locale === 'fr' ? 'Accès à Vie' :
                     locale === 'zh-CN' ? '终身访问' :
                     'Lifetime Access'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* STATISTICS BAR - Design moderne */}
        <section className="py-12 bg-gradient-to-r from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-slate-900 mb-2">347.293+</div>
                <div className="text-sm text-slate-600">
                  {locale === 'fr' ? 'Cadenas Numériques' :
                   locale === 'zh-CN' ? '数字锁已放置' :
                   'Digital Locks Placed'}
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-emerald-600 mb-2">4.9/5</div>
                <div className="text-sm text-slate-600">
                  {locale === 'fr' ? 'Note Clients' :
                   locale === 'zh-CN' ? '客户评分' :
                   'Customer Rating'}
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-blue-600 mb-2">142</div>
                <div className="text-sm text-slate-600">
                  {locale === 'fr' ? 'Pays' :
                   locale === 'zh-CN' ? '国家/地区' :
                   'Countries'}
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white shadow-sm border border-slate-200">
                <div className="text-3xl font-bold text-cyan-600 mb-2">24/7</div>
                <div className="text-sm text-slate-600">
                  {locale === 'fr' ? 'Support' :
                   locale === 'zh-CN' ? '支持服务' :
                   'Support'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM/SOLUTION SECTION - Design startup */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold mb-6 border border-blue-200">
                    {locale === 'fr' ? 'INFORMATION IMPORTANTE' :
                     locale === 'zh-CN' ? '重要通知' :
                     'IMPORTANT NOTICE'}
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    {locale === 'fr' ? (
                      <>Le <span className="text-blue-600">Pont des Cadenas d'Amour</span> a Changé Pour Toujours</>
                    ) : locale === 'zh-CN' ? (
                      <>巴黎<span className="text-blue-600">爱情锁桥</span>已永久改变</>
                    ) : (
                      <>The <span className="text-blue-600">Love Lock Bridge Paris</span> Has Changed Forever</>
                    )}
                  </h2>
                  <p className="text-lg text-slate-700 mb-8 leading-relaxed font-light">
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
                  <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                      <div className="text-xl font-bold">✗</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg mb-3">
                        {locale === 'fr' ? 'Cadenas Physiques (Interdits)' :
                         locale === 'zh-CN' ? '实体锁（禁止）' :
                         'Physical Locks (Banned)'}
                      </h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                          {locale === 'fr' ? 'Illegaux (500€ d\'amende)' : locale === 'zh-CN' ? '违法（罚款500欧元）' : 'Illegal with €500 fines'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                          {locale === 'fr' ? 'Retirés tous les 6 mois' : locale === 'zh-CN' ? '每6个月清除一次' : 'Removed every 6 months'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                          {locale === 'fr' ? 'Dégâts environnementaux' : locale === 'zh-CN' ? '环境破坏' : 'Environmental damage'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-3"></div>
                          {locale === 'fr' ? 'Risque structurel' : locale === 'zh-CN' ? '桥梁结构风险' : 'Bridge structural risk'}
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-6 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <div className="text-xl font-bold">✓</div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-lg mb-3">
                        {locale === 'fr' ? 'Cadenas Numériques (Officiel)' :
                         locale === 'zh-CN' ? '数字锁（官方）' :
                         'Digital Locks (Official)'}
                      </h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></div>
                          {locale === 'fr' ? '100% légal et autorisé' : locale === 'zh-CN' ? '100%合法授权' : '100% legal & authorized'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></div>
                          {locale === 'fr' ? 'Permanent sur blockchain' : locale === 'zh-CN' ? '区块链永久存储' : 'Permanent on blockchain'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></div>
                          {locale === 'fr' ? 'Zéro impact environnemental' : locale === 'zh-CN' ? '零环境影响' : 'Zero environmental impact'}
                        </li>
                        <li className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3"></div>
                          {locale === 'fr' ? 'Visible de partout' : locale === 'zh-CN' ? '随时随地可查看' : 'View from anywhere'}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="bg-slate-900 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-8">
                    {locale === 'fr' ? 'Pourquoi Choisir LoveLockParis ?' :
                     locale === 'zh-CN' ? '为什么选择巴黎爱情锁？' :
                     'Why Choose LoveLockParis?'}
                  </h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-2">
                          {locale === 'fr' ? 'Emplacement Authentique' :
                           locale === 'zh-CN' ? '真实地理位置' :
                           'Authentic Location'}
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {locale === 'fr' ? 'Positionnement GPS précis sur le véritable Pont des Arts' :
                           locale === 'zh-CN' ? '在真实的艺术桥上进行GPS精确定位' :
                           'GPS-precise positioning on the actual Pont des Arts Love Lock Bridge'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Crown className="h-6 w-6 text-amber-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-2">
                          {locale === 'fr' ? 'Registre Officiel' :
                           locale === 'zh-CN' ? '官方注册处' :
                           'Official Registry'}
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {locale === 'fr' ? 'Reconnu comme le successeur légitime de la tradition physique' :
                           locale === 'zh-CN' ? '被公认为实体传统的合法继承者' :
                           'Recognized as the legitimate successor to the physical tradition'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Sparkles className="h-6 w-6 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-2">
                          {locale === 'fr' ? 'Réalité Augmentée' :
                           locale === 'zh-CN' ? '增强现实' :
                           'Augmented Reality'}
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {locale === 'fr' ? 'Voyez votre cadenas apparaître sur le vrai pont via votre smartphone' :
                           locale === 'zh-CN' ? '通过智能手机在真实桥梁上查看您的锁' :
                           'See your lock appear on the actual bridge through your smartphone'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-lg mb-2">
                          {locale === 'fr' ? 'Garantie à Vie' :
                           locale === 'zh-CN' ? '终身保证' :
                           'Lifetime Guarantee'}
                        </h4>
                        <p className="text-slate-300 text-sm">
                          {locale === 'fr' ? 'Votre cadenas est stocké de manière permanente sur des serveurs décentralisés' :
                           locale === 'zh-CN' ? '您的锁永久存储在去中心化服务器上' :
                           'Your lock is permanently stored on decentralized servers'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-700">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">9,847+</div>
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

        {/* HOW IT WORKS - Design moderne */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {locale === 'fr' ? (
                  <>Comment Placer Votre Cadenas sur le<br/><span className="text-blue-600">Pont des Cadenas d'Amour Paris</span></>
                ) : locale === 'zh-CN' ? (
                  <>如何在<span className="text-blue-600">巴黎爱情锁桥</span><br/>上放置您的锁</>
                ) : (
                  <>How to Place Your Lock on the<br/><span className="text-blue-600">Love Lock Bridge Paris France</span></>
                )}
              </h2>
              <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                {locale === 'fr' ? 'Trois étapes simples pour immortaliser votre amour sur le Pont des Arts' :
                 locale === 'zh-CN' ? '三个简单步骤，将您的爱情永远铭刻在艺术桥上' :
                 'Three simple steps to immortalize your love on the historic Pont des Arts'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
              
              <div className="relative">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">1</div>
                <Card className="h-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow pt-10">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 mx-auto">
                      <MapPin className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                      {locale === 'fr' ? 'Choisissez Votre Emplacement' :
                       locale === 'zh-CN' ? '选择您的位置' :
                       'Choose Your Spot'}
                    </h3>
                    <p className="text-slate-700 text-center text-sm mb-6">
                      {locale === 'fr' ? 'Sélectionnez l\'emplacement parfait sur notre carte 3D interactive du Pont des Arts. Choisissez entre vue sur la Tour Eiffel, centre du pont, ou emplacements alignés sur le lever du soleil.' :
                       locale === 'zh-CN' ? '在我们艺术桥的交互式3D地图上选择完美位置。选择埃菲尔铁塔景观、桥中心或日出对齐位置。' :
                       'Select the perfect location on our interactive 3D map of the Pont des Arts bridge. Choose between Eiffel Tower view, bridge center, or sunrise alignment spots.'}
                    </p>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">
                        {locale === 'fr' ? 'Le Plus Populaire : Vue Tour Eiffel' :
                         locale === 'zh-CN' ? '最受欢迎：埃菲尔铁塔景观' :
                         'Most Popular: Eiffel View'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">2</div>
                <Card className="h-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow pt-10">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-6 mx-auto">
                      <Heart className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                      {locale === 'fr' ? 'Personnalisez Votre Cadenas' :
                       locale === 'zh-CN' ? '个性化您的锁' :
                       'Personalize Your Lock'}
                    </h3>
                    <p className="text-slate-700 text-center text-sm mb-6">
                      {locale === 'fr' ? 'Gravez vos noms, date et un message personnel. Choisissez parmi des designs de cadenas or, argent ou diamant. Téléchargez une photo ou vidéo secrète.' :
                       locale === 'zh-CN' ? '刻上您的姓名、日期和个人信息。选择金、银或钻石锁设计。上传秘密照片或视频信息。' :
                       'Engrave your names, date, and a personal message. Choose from gold, silver, or diamond lock designs. Upload a secret photo or video message.'}
                    </p>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-rose-50 text-rose-700 rounded text-xs font-semibold">
                        {locale === 'fr' ? 'Personnalisation Illimitée' :
                         locale === 'zh-CN' ? '无限定制' :
                         'Unlimited Customization'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="relative">
                <div className="absolute -top-3 -left-3 w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">3</div>
                <Card className="h-full border border-slate-200 shadow-sm hover:shadow-md transition-shadow pt-10">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6 mx-auto">
                      <Globe className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-4 text-center">
                      {locale === 'fr' ? 'Expérience en RA' :
                       locale === 'zh-CN' ? '增强现实体验' :
                       'Experience in AR'}
                    </h3>
                    <p className="text-slate-700 text-center text-sm mb-6">
                      {locale === 'fr' ? 'Votre cadenas est ajouté de manière permanente au registre Love Lock Paris. Visualisez-le en réalité augmentée lorsque vous visitez le pont ou en 3D depuis n\'importe où dans le monde.' :
                       locale === 'zh-CN' ? '您的锁被永久添加到巴黎爱情锁注册处。访问桥梁时通过增强现实查看，或从世界任何地方通过3D查看。' :
                       'Your lock is permanently added to the Love Lock Paris registry. View it in augmented reality when visiting the bridge or in 3D from anywhere in the world.'}
                    </p>
                    <div className="text-center">
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">
                        {locale === 'fr' ? 'Accès à Vie' :
                         locale === 'zh-CN' ? '终身访问' :
                         'Lifetime Access'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

            </div>

            {/* Section AR preview */}
            <div className="bg-white rounded-2xl p-6 md:p-10 max-w-5xl mx-auto border border-slate-200 shadow-sm">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="lg:w-1/2">
                  <h3 className="text-2xl font-bold text-slate-900 mb-6">
                    {locale === 'fr' ? 'Visualisez Votre Cadenas en Réalité Augmentée' :
                     locale === 'zh-CN' ? '在增强现实中查看您的锁' :
                     'View Your Lock in Augmented Reality'}
                  </h3>
                  <p className="text-slate-700 mb-6">
                    {locale === 'fr' ? 'Notre technologie de réalité augmentée vous permet de voir votre cadenas numérique apparaître exactement à l\'emplacement choisi sur le véritable Pont des Arts. Pointez simplement votre smartphone vers le pont pour vivre une expérience magique.' :
                     locale === 'zh-CN' ? '我们的增强现实技术让您可以在艺术桥的真实位置上看到您的数字锁。只需将智能手机对准桥梁即可体验神奇的时刻。' :
                     'Our augmented reality technology allows you to see your digital lock appear exactly at your chosen location on the actual Pont des Arts. Simply point your smartphone at the bridge for a magical experience.'}
                  </p>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-700 text-sm">
                        {locale === 'fr' ? 'Prévisualisation en temps réel' :
                         locale === 'zh-CN' ? '实时预览' :
                         'Real-time preview'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-700 text-sm">
                        {locale === 'fr' ? 'Compatible iOS et Android' :
                         locale === 'zh-CN' ? '兼容iOS和Android' :
                         'iOS & Android compatible'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-slate-700 text-sm">
                        {locale === 'fr' ? 'Pas d\'application à télécharger' :
                         locale === 'zh-CN' ? '无需下载应用' :
                         'No app download required'}
                      </span>
                    </div>
                  </div>
                  <Link href="/ar-view">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Smartphone className="mr-2 h-4 w-4" />
                      {locale === 'fr' ? 'Essayer la Prévisualisation AR' :
                       locale === 'zh-CN' ? '尝试AR预览' :
                       'Try AR Preview Now'}
                    </Button>
                  </Link>
                </div>
                <div className="lg:w-1/2">
                  <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden">
                    <Image
                      src="/images/ar-preview.png"
                      alt="Augmented reality preview showing digital love lock on Pont des Arts bridge"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MARKETPLACE SECTION */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold mb-6 border border-emerald-200">
                <TrendingUp className="h-4 w-4" />
                {locale === 'fr' ? 'OPPORTUNITÉ D\'INVESTISSEMENT' :
                 locale === 'zh-CN' ? '投资机会' :
                 'INVESTMENT OPPORTUNITY'}
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                {locale === 'fr' ? (
                  <>Achetez & Revendez Vos<br/><span className="text-emerald-600">Cadenas Numériques avec Profit</span></>
                ) : locale === 'zh-CN' ? (
                  <>购买并转售您的<br/><span className="text-emerald-600">数字锁以获取利润</span></>
                ) : (
                  <>Buy & Resell Your<br/><span className="text-emerald-600">Digital Locks for Profit</span></>
                )}
              </h2>
              
              <p className="text-slate-700 text-lg max-w-3xl mx-auto">
                {locale === 'fr' ? 'Rejoignez notre marketplace exclusive : achetez des cadenas numériques sur le Pont des Arts et revendez-les à des collectionneurs pour des profits significatifs.' :
                 locale === 'zh-CN' ? '加入我们的专属市场：购买艺术桥上的数字锁，并转售给收藏家以获取可观的利润。' :
                 'Join our exclusive marketplace: purchase digital locks on Pont des Arts and resell them to collectors for significant profits.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-4">+450%</div>
                <h4 className="font-semibold text-slate-900 text-lg mb-3">
                  {locale === 'fr' ? 'Profit Maximal' :
                   locale === 'zh-CN' ? '最高利润' :
                   'Maximum Profit'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {locale === 'fr' ? 'Certains numéros spéciaux ont augmenté de valeur jusqu\'à 450%' :
                   locale === 'zh-CN' ? '某些特殊编号价值增长高达450%' :
                   'Some special numbers have increased in value up to 450%'}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                <div className="text-4xl font-bold text-amber-600 mb-4">$12.5K</div>
                <h4 className="font-semibold text-slate-900 text-lg mb-3">
                  {locale === 'fr' ? 'Record de Vente' :
                   locale === 'zh-CN' ? '最高销售额' :
                   'Sales Record'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {locale === 'fr' ? 'Cadenas #777 vendu pour 12,500 USD' :
                   locale === 'zh-CN' ? '锁具#777以12,500美元售出' :
                   'Lock #777 sold for 12,500 USD'}
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-center">
                <div className="text-4xl font-bold text-blue-600 mb-4">72h</div>
                <h4 className="font-semibold text-slate-900 text-lg mb-3">
                  {locale === 'fr' ? 'Vente Rapide' :
                   locale === 'zh-CN' ? '快速销售' :
                   'Quick Sale'}
                </h4>
                <p className="text-slate-600 text-sm">
                  {locale === 'fr' ? 'Temps moyen de vente pour les numéros premium' :
                   locale === 'zh-CN' ? '优质编号的平均销售时间' :
                   'Average sale time for premium numbers'}
                </p>
              </div>
            </div>

            <div className="mb-16">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                {locale === 'fr' ? 'Exemples Réels de Profits' :
                 locale === 'zh-CN' ? '真实利润示例' :
                 'Real Profit Examples'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border border-slate-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-lg font-bold text-emerald-700 mx-auto mb-4">#777</div>
                    <div className="space-y-2">
                      <div><div className="text-xs text-slate-500">{locale === 'fr' ? 'Prix d\'achat' : 'Purchase Price'}</div><div className="text-lg font-bold text-slate-900">$149</div></div>
                      <div><div className="text-xs text-slate-500">{locale === 'fr' ? 'Prix de vente' : 'Sale Price'}</div><div className="text-xl font-bold text-emerald-600">$12,500</div></div>
                      <div className="pt-2"><div className="inline-block px-2 py-1 bg-emerald-50 text-emerald-700 rounded text-xs font-semibold">+8,288%</div></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-slate-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-lg font-bold text-amber-700 mx-auto mb-4">#1313</div>
                    <div className="space-y-2">
                      <div><div className="text-xs text-slate-500">{locale === 'fr' ? 'Prix d\'achat' : 'Purchase Price'}</div><div className="text-lg font-bold text-slate-900">$79</div></div>
                      <div><div className="text-xs text-slate-500">{locale === 'fr' ? 'Prix de vente' : 'Sale Price'}</div><div className="text-xl font-bold text-amber-600">$2,499</div></div>
                      <div className="pt-2"><div className="inline-block px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-semibold">+3,063%</div></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-slate-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-lg font-bold text-blue-700 mx-auto mb-4">#2024</div>
                    <div className="space-y-2">
                      <div><div className="text-xs text-slate-500">{locale === 'fr' ? 'Prix d\'achat' : 'Purchase Price'}</div><div className="text-lg font-bold text-slate-900">$49</div></div>
                      <div><div className="text-xs text-slate-500">{locale === 'fr' ? 'Prix de vente' : 'Sale Price'}</div><div className="text-xl font-bold text-blue-600">$1,850</div></div>
                      <div className="pt-2"><div className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">+3,676%</div></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-slate-200">
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-lg font-bold text-purple-700 mx-auto mb-4">#888</div>
                    <div className="space-y-2">
                      <div><div className="text-xs text-slate-500">{locale === 'fr' ? 'Prix d\'achat' : 'Purchase Price'}</div><div className="text-lg font-bold text-slate-900">$49</div></div>
                      <div><div className="text-xs text-slate-500">{locale === 'fr' ? 'Prix de vente' : 'Sale Price'}</div><div className="text-xl font-bold text-purple-600">$999</div></div>
                      <div className="pt-2"><div className="inline-block px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-semibold">+3,345%</div></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-center">
              <h3 className="text-3xl font-bold text-white mb-6">
                {locale === 'fr' ? (
                  <>Prêt à <span className="text-cyan-400">Transformer $49.99 en $12,500</span> ?</>
                ) : locale === 'zh-CN' ? (
                  <>准备好将<span className="text-cyan-400">$49.99变成$12,500</span>吗？</>
                ) : (
                  <>Ready to <span className="text-cyan-400">Turn $49.99 into $12,500</span> ?</>
                )}
              </h3>
              
              <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                {locale === 'fr' ? 'Rejoignez notre marketplace exclusive de cadenas numériques. Achetez des numéros spéciaux, personnalisez-les et revendez-les à des collectionneurs du monde entier.' :
                 locale === 'zh-CN' ? '加入我们的数字锁专属市场。购买特殊编号，个性化定制，然后转售给全球收藏家。' :
                 'Join our exclusive digital lock marketplace. Purchase special numbers, customize them, and resell to collectors worldwide.'}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/marketplace" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-6 rounded-lg">
                    <TrendingUp className="mr-3 h-5 w-5" />
                    {locale === 'fr' ? 'Explorer la Marketplace' :
                     locale === 'zh-CN' ? '探索市场' :
                     'Explore Marketplace'}
                  </Button>
                </Link>
                <Link href="/purchase?investment=true" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-6 rounded-lg">
                    <Coins className="mr-3" />
                    {locale === 'fr' ? 'Acheter à $29.99' :
                     locale === 'zh-CN' ? '以$29.99购买' :
                     'Buy Starting at $29.99'}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* LIMITED TIME OFFER SECTION */}
        <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 rounded-lg text-sm font-semibold mb-8">
              <Zap className="h-4 w-4" />
              {locale === 'fr' ? 'Offre à Durée Limitée' :
               locale === 'zh-CN' ? '限时优惠' :
               'Limited Time Offer'}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              {locale === 'fr' ? (
                <>Votre Histoire d'Amour Mérite<br/><span className="text-amber-300">L'Héritage Parisien</span></>
              ) : locale === 'zh-CN' ? (
                <>您的爱情故事值得<br/><span className="text-amber-300">巴黎遗产</span></>
              ) : (
                <>Your Love Story Deserves<br/><span className="text-amber-300">The Parisian Legacy</span></>
              )}
            </h2>
            
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-slate-300 mb-8">
                {locale === 'fr' ? (
                  <>Rejoignez la renaissance numérique de la tradition la plus romantique au monde. Sécurisez votre place sur l'historique Pont des Cadenas d'Amour avant que les emplacements premium ne disparaissent.</>
                ) : locale === 'zh-CN' ? (
                  <>加入世界上最浪漫传统的数字复兴。在优质位置消失之前，确保您在历史悠久的爱情锁桥上的位置。</>
                ) : (
                  <>Join the digital renaissance of the world's most romantic tradition. Secure your spot on the historic Pont des Arts Love Lock Bridge before premium locations are gone.</>
                )}
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-white">
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
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-300">∞</div>
                  <div className="text-sm text-slate-300">
                    {locale === 'fr' ? 'Accès à vie' :
                     locale === 'zh-CN' ? '终身访问' :
                     'Lifetime access'}
                  </div>
                </div>
                <div className="bg-white/10 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-rose-300">4.9★</div>
                  <div className="text-sm text-slate-300">
                    {locale === 'fr' ? 'Note' :
                     locale === 'zh-CN' ? '评分' :
                     'Rating'}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-8">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-amber-400" />
                  <div className="text-left">
                    <div className="font-semibold text-white">
                      {locale === 'fr' ? '72% des places avec vue Tour Eiffel déjà prises' :
                       locale === 'zh-CN' ? '72%的埃菲尔铁塔景观位置已被占据' :
                       '72% of Eiffel View spots already taken'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/purchase" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8 py-6 rounded-lg">
                  <Lock className="mr-3 h-5 w-5" />
                  {locale === 'fr' ? 'Sécuriser Mon Cadenas • 29,99€' :
                   locale === 'zh-CN' ? '购买数字锁 • ￥29.99' :
                   'Secure My Digital Lock • $29.99'}
                </Button>
              </Link>
              <Link href="/bridge" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-6 py-6 rounded-lg">
                  <Globe className="mr-3" />
                  {locale === 'fr' ? 'Voir les Places Disponibles' :
                   locale === 'zh-CN' ? '查看可用位置' :
                   'View Available Spots'}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                {locale === 'fr' ? (
                  <>Tout sur le<br/><span className="text-blue-600">Pont des Cadenas d'Amour Paris</span></>
                ) : locale === 'zh-CN' ? (
                  <>关于<span className="text-blue-600">巴黎爱情锁桥</span><br/>的一切</>
                ) : (
                  <>Everything About the<br/><span className="text-blue-600">Love Lock Bridge Paris</span></>
                )}
              </h2>
              <p className="text-slate-600">
                {locale === 'fr' ? 'Réponses aux questions les plus recherchées sur le Pont des Arts et les cadenas d\'amour' :
                 locale === 'zh-CN' ? '关于艺术桥和爱情锁最常搜索问题的答案' :
                 'Answers to the most searched questions about Pont des Arts and love locks'}
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4">
              
              <AccordionItem value="item-1" className="bg-white border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-900 py-6">
                  <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                  {locale === 'fr' ? 'Où se trouve exactement le Pont des Cadenas d\'Amour à Paris ?' :
                   locale === 'zh-CN' ? '巴黎爱情锁桥的具体位置在哪里？' :
                   'Where exactly is the Love Lock Bridge in Paris?'}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-6">
                  {locale === 'fr' ? (
                    <>Le fameux Pont des Cadenas d'Amour Paris s'appelle officiellement Pont des Arts. Il est situé dans le 6ᵉ arrondissement de Paris (75006), reliant le Musée du Louvre à l'Institut de France. Coordonnées GPS : 48.858370° N, 2.337480° E. Ce pont piétonnier offre une vue iconique sur la Seine et a été le berceau historique des cadenas d'amour depuis le début de la tradition.</>
                  ) : locale === 'zh-CN' ? (
                    <>著名的巴黎爱情锁桥正式名称为艺术桥。它位于巴黎第6区（75006），连接卢浮宫博物馆和法兰西学院。GPS坐标：48.858370° N, 2.337480° E。这座人行桥提供了塞纳河的标志性景观，自传统开始以来一直是爱情锁的历史发源地。</>
                  ) : (
                    <>The famous Love Lock Bridge Paris is officially called Pont des Arts. It's located in the 6th arrondissement of Paris (75006), connecting the Louvre Museum to the Institut de France. GPS coordinates: 48.858370° N, 2.337480° E. This pedestrian bridge offers iconic views of the Seine River and has been the historic home of love locks since the tradition began.</>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-900 py-6">
                  <ShieldCheck className="h-5 w-5 text-amber-600 mr-3" />
                  {locale === 'fr' ? 'Puis-je encore mettre un cadenas physique sur le Pont des Arts ?' :
                   locale === 'zh-CN' ? '我还能在艺术桥上放置实体锁吗？' :
                   'Can I still put a physical lock on Pont des Arts?'}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-6">
                  {locale === 'fr' ? (
                    <>Non, c'est strictement interdit et illégal. Depuis juin 2015, la Ville de Paris a interdit d'attacher tout objet aux ponts. Les contrevenants risquent des amendes allant jusqu'à 500€. Les grilles d'origine ont été remplacées par des panneaux en verre spécialement conçus pour empêcher l'attachement des cadenas. LoveLockParis.com est le seul moyen autorisé et légal de perpétuer cette tradition romantique.</>
                  ) : locale === 'zh-CN' ? (
                    <>不，这是严格禁止且违法的。自2015年6月起，巴黎市已禁止在桥上附着任何物品。违者将面临高达500欧元的罚款。原桥栏杆已更换为专门设计用于防止锁具附着的玻璃板。LoveLockParis.com是延续这一浪漫传统的唯一授权合法方式。</>
                  ) : (
                    <>No, it is strictly prohibited and illegal. Since June 2015, the City of Paris has banned attaching any objects to bridges. Violators face fines up to €500. The original railings were replaced with glass panels specifically designed to prevent lock attachment. LoveLockParis.com is the only authorized and legal way to continue this romantic tradition.</>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white border border-slate-200 rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold text-slate-900 py-6">
                  <Globe className="h-5 w-5 text-blue-600 mr-3" />
                  {locale === 'fr' ? 'Comment le cadenas d\'amour numérique apparaît-il sur le vrai pont ?' :
                   locale === 'zh-CN' ? '数字爱情锁如何出现在真实桥梁上？' :
                   'How does the digital love lock appear on the actual bridge?'}
                </AccordionTrigger>
                <AccordionContent className="text-slate-700 pb-6">
                  {locale === 'fr' ? (
                    <>Grâce à notre technologie de réalité augmentée avancée. Lorsque vous visitez le Pont des Arts à Paris, ouvrez simplement l'application LoveLockParis sur votre smartphone et pointez votre caméra vers le pont. Votre cadenas numérique personnalisé apparaîtra exactement aux coordonnées GPS choisies, visible uniquement à travers votre appareil. Vous pouvez également le visualiser en 3D depuis n'importe où dans le monde via notre site web.</>
                  ) : locale === 'zh-CN' ? (
                    <>通过我们先进的增强现实技术。当您参观巴黎艺术桥时，只需在智能手机上打开LoveLockParis应用程序并将摄像头对准桥梁。您个性化的数字锁将精确出现在您选择的GPS坐标位置，仅通过您的设备可见。您还可以通过我们的网站在世界任何地方进行3D查看。</>
                  ) : (
                    <>Through our advanced augmented reality technology. When you visit the Pont des Arts in Paris, simply open the LoveLockParis app on your smartphone and point your camera at the bridge. Your personalized digital lock will appear exactly at your chosen GPS coordinates, visible only through your device. You can also view it in 3D from anywhere in the world via our website.</>
                  )}
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            <div className="mt-16 text-center">
              <Link href="/purchase">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-6 rounded-lg">
                  <Heart className="mr-3 h-5 w-5" />
                  {locale === 'fr' ? 'Créer Votre Cadenas d\'Amour' :
                   locale === 'zh-CN' ? '立即创建您的爱情锁' :
                   'Create Your Love Lock Now'}
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <PurchaseNotifications />

      {/* FOOTER - Design moderne */}
      <footer className="border-t border-slate-200 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">LoveLockParis</div>
                    <div className="text-xs text-slate-500">Official Registry</div>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  {locale === 'fr' ? 'Le registre numérique officiel du Pont des Cadenas d\'Amour. Préservant le romantisme, protégeant le patrimoine depuis 2026.' :
                   locale === 'zh-CN' ? '艺术桥爱情锁的官方数字注册处。自2026年起，保护浪漫，守护遗产。' :
                   'The official digital registry of the Pont des Arts Love Lock Bridge. Preserving romance, protecting heritage since 2026.'}
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Navigation</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/ar-view" className="block text-slate-600 hover:text-blue-600">
                    AR View
                  </Link>
                  <Link href="/bridge" className="block text-slate-600 hover:text-blue-600">
                    3D Bridge
                  </Link>
                  <Link href="/marketplace" className="block text-slate-600 hover:text-blue-600">
                    Marketplace
                  </Link>
                  <Link href="/concept" className="block text-slate-600 hover:text-blue-600">
                    Concept & Value
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">About</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/about" className="block text-slate-600 hover:text-blue-600">
                    History & About Us
                  </Link>
                  <Link href="/contact" className="block text-slate-600 hover:text-blue-600">
                    Contact
                  </Link>
                  <Link href="/press" className="block text-slate-600 hover:text-blue-600">
                    Press & Media
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/legal" className="block text-slate-600 hover:text-blue-600">
                    Legal Notice
                  </Link>
                  <Link href="/terms" className="block text-slate-600 hover:text-blue-600">
                    Terms of Service
                  </Link>
                  <Link href="/privacy" className="block text-slate-600 hover:text-blue-600">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-200 text-center">
              <div className="mb-6">
                <p className="text-sm text-slate-600">
                  {locale === 'fr' ? 'Pont des Cadenas d\'Amour Paris • Pont des Arts • 75006 Paris, France • GPS : 48.858370, 2.337480' :
                   locale === 'zh-CN' ? '巴黎爱情锁桥 • 艺术桥 • 75006 巴黎, 法国 • GPS: 48.858370, 2.337480' :
                   'Love Lock Bridge Paris • Pont des Arts • 75006 Paris, France • GPS: 48.858370, 2.337480'}
                </p>
              </div>
              
              <div className="text-xs text-slate-500">
                <p>© 2026 PANORAMA GRUP. All rights reserved. LoveLockParis™ is a registered trademark.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
