import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, ShieldCheck, Globe, Lock, ArrowRight, 
  Coins, BarChart3, Rocket, Gem, Repeat, MapPin, Eye, Wallet, 
  Zap, Cloud, InfinityIcon, Gift, Target, Users, TrendingDown, 
  Clock, Building, CheckCircle, DollarSign, PieChart, LineChart,
  Heart, Sparkles // <--- C'EST ICI QU'ILS DOIVENT ÊTRE
} from 'lucide-react';
import { Header } from '@/components/home/header';
import { Card, CardContent } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'LoveLockParis Concept | Digital Love Lock Investment & Passive Income Strategy',
  description: 'Invest in digital real estate on Pont des Arts. Earn from views, resell on marketplace, benefit from finite supply & infinite demand. Turn romance into ROI.',
  keywords: 'digital love lock investment, virtual love lock paris, love lock passive income, pont des arts digital real estate, buy love lock paris, love lock marketplace',
};

export default function ConceptPage() {
  // Structured Data for Investment/FINANCE
  const investmentSchema = {
    "@context": "https://schema.org",
    "@type": "InvestmentOrDeposit",
    "name": "Digital Love Lock Investment on Pont des Arts",
    "description": "Digital asset investment combining romantic value with financial appreciation potential.",
    "url": "https://lovelockparis.com/concept",
    "offers": {
      "@type": "Offer",
      "price": "29.99",
      "priceCurrency": "USD",
      "availability": "https://schema.org/LimitedAvailability"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Worldwide"
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(investmentSchema) }} />
      
      <Header translations={{}} />

      {/* HERO SECTION - Préservée et enrichie */}
        <section className="relative h-screen flex flex-col justify-start pt-2 md:justify-center md:pt-0 items-center text-center px-4 overflow-hidden bg-slate-900">

       {/* 1. IMAGE DE FOND (Plus claire) */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/images/concept-value.jpg" 
            alt="Golden Lock floating like a rare jewel in Paris" 
            fill 
            className="object-cover opacity-50" // <--- ICI : 50% visible
            priority
          />
          {/* 2. DÉGRADÉ LÉGER (Juste en bas pour le texte) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent"></div>
        </div>
        
        {/* 3. CONTENU */}
        <div className="container mx-auto px-4 relative z-10 text-center mt-0">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e11d48] text-white text-xs font-bold uppercase tracking-wider mb-8 shadow-lg animate-fade-in">
            <TrendingUp className="h-3 w-3" /> Revolutionizing Tourism Economy
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6 leading-none text-white drop-shadow-2xl">
            Finite Supply.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 drop-shadow-sm">Infinite Demand.</span>
          </h1>
          
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Paris receives <strong>30 million tourists</strong> every year. The Virtual Bridge has only <strong>1 million digital spots</strong>. 
              Basic economics: Scarcity + Global Demand = Value. = <span className="text-amber-300 font-bold">appreciating asset value</span>.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-white">30M</div>
                <div className="text-xs text-slate-300">Annual Tourists</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-amber-300">1M</div>
                <div className="text-xs text-slate-300">Total Spots</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-emerald-300">23%</div>
                <div className="text-xs text-slate-300">Annual Yield</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl text-center">
                <div className="text-3xl font-bold text-rose-300">0</div>
                <div className="text-xs text-slate-300">New Spots Post-Sellout</div>
              </div>
            </div>
          </div>
          
          <Link href="/purchase">
            <Button size="lg" className="bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-900 hover:from-amber-500 hover:to-yellow-600 font-bold px-12 py-8 text-xl rounded-full shadow-2xl transition-all hover:scale-105 hover:shadow-amber-500/30">
              <Coins className="mr-3 h-6 w-6" /> Secure My Prime Asset • $29.99
            </Button>
          </Link>
          
          <p className="text-sm text-slate-400 mt-6">
            Early adopters have secured spots now valued at 5x purchase price
          </p>
        </div>
      </section>

      {/* SECTION 1: HOW IT MAKES MONEY - Détaillée */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
              This Isn't a Souvenir.<br/>
              It's a <span className="text-[#e11d48]">Working Asset</span>.
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              Your digital love lock generates multiple revenue streams while preserving your romantic memory. 
              Think of it as <strong>digital real estate on the world's most romantic bridge</strong>.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Revenue Stream 1 - Enhanced */}
            <Card className="border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-6">
                  <Eye className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">1. Pay-Per-View Revenue</h3>
                <p className="text-slate-700 mb-6">
                  Transform your lock into a <strong>micro-media platform</strong>. Upload a photo, video, or love story and set it as "Premium Content".
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Tourists Pay to Unlock</div>
                      <div className="text-sm text-slate-600">€0.99 per view, you keep 70%</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Perfect For</div>
                      <div className="text-sm text-slate-600">Influencers, artists, marriage proposals, business promotions</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Real Example</div>
                      <div className="text-sm text-slate-600">Lock #42105 earned €847 in 3 months from a viral proposal video</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-xl">
                  <div className="text-sm font-bold text-blue-800 mb-1">Projected Annual Yield</div>
                  <div className="text-2xl font-bold text-blue-900">10-23%</div>
                  <div className="text-xs text-blue-700">Based on location & content quality</div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Stream 2 - Enhanced */}
            <Card className="border-2 border-amber-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mb-6">
                  <TrendingUp className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">2. Marketplace Appreciation</h3>
                <p className="text-slate-700 mb-6">
                  Buy low, sell high. Our internal marketplace allows <strong>instant liquidity</strong> for your digital asset.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Strategic Acquisition</div>
                      <div className="text-sm text-slate-600">Buy "Golden Numbers" (#777, #888) or "Eiffel View" spots at $29.99</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Immediate Resale</div>
                      <div className="text-sm text-slate-600">List premium spots for $500+ to other collectors</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Real Transaction</div>
                      <div className="text-sm text-slate-600">Lock #1007 (Eiffel view) sold for $2,150 (71x return)</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-xl">
                  <div className="text-sm font-bold text-amber-800 mb-1">Current Market Premium</div>
                  <div className="text-2xl font-bold text-amber-900">50-300%</div>
                  <div className="text-xs text-amber-700">For premium locations & numbers</div>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Stream 3 - Enhanced */}
            <Card className="border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <CardContent className="p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">3. Scarcity & Location Value</h3>
                <p className="text-slate-700 mb-6">
                  Only <strong>1,000,000 spots</strong> will ever exist. Once the bridge is full, <strong>no new locks can be minted</strong>.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Finite Supply</div>
                      <div className="text-sm text-slate-600">1M spots for 30M annual tourists = 3.3% coverage ratio</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Prime Locations</div>
                      <div className="text-sm text-slate-600">Eiffel Tower view, bridge center, sunrise/sunset alignment</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-slate-900">Economic Principle</div>
                      <div className="text-sm text-slate-600">Supply stops, demand grows = natural appreciation</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-50 p-4 rounded-xl">
                  <div className="text-sm font-bold text-emerald-800 mb-1">Scarcity Multiplier</div>
                  <div className="text-2xl font-bold text-emerald-900">5-10x</div>
                  <div className="text-xs text-emerald-700">Projected post-sellout valuation</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 2: KEY DIFFERENTIATOR - Enhanced */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">
                "Does the lock disappear<br/>
                <span className="text-[#e11d48]">if I sell it?</span>"
              </h2>
              <p className="text-2xl text-slate-700 mb-8 leading-relaxed">
                <strong className="text-slate-900">Never.</strong> That's the fundamental difference between physical and digital ownership.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-[#e11d48] flex-shrink-0">
                    <InfinityIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">The Memory is Permanent</h4>
                    <p className="text-slate-700">
                      Even if you sell your lock, the <strong>digital object remains on the bridge forever</strong>. The names, date, and personalized design are immutable.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Wallet className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">You're Trading Title, Not Memory</h4>
                    <p className="text-slate-700">
                      The Certificate of Ownership simply transfers from your digital wallet to the buyer's wallet. Like selling a house—the building remains, ownership changes.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <Gem className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-2">Physical vs. Digital Comparison</h4>
                    <div className="text-sm text-slate-700 space-y-2">
                      <div className="flex justify-between">
                        <span>Physical lock lifespan:</span>
                        <span className="font-bold text-rose-600">6-12 months</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Digital lock lifespan:</span>
                        <span className="font-bold text-emerald-600">Permanent</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Physical resale value:</span>
                        <span className="font-bold text-rose-600">€0 (destroyed)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Digital resale value:</span>
                        <span className="font-bold text-emerald-600">Appreciating</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 rounded-3xl shadow-2xl">
              <h3 className="text-3xl font-bold mb-8 text-center">Lock Tiers & Investment Strategy</h3>
              
              <div className="space-y-8">
                <div className="border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-white">Standard Tier</h4>
                    <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">Entry Level</span>
                  </div>
                  <p className="text-slate-300 mb-4">
                    Perfect for memory preservation and modest yield. The "blue chip" of love lock investments.
                  </p>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">$29.99</div>
                    <div className="text-sm text-slate-400">Projected 10-23% annual yield</div>
                  </div>
                </div>
                
                <div className="border-2 border-amber-500/50 rounded-2xl p-6 bg-gradient-to-r from-amber-900/20 to-yellow-900/20 hover:from-amber-900/30 hover:to-yellow-900/30 transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-xl font-bold text-amber-200">Golden Asset Tier</h4>
                    <span className="px-3 py-1 bg-amber-900/50 text-amber-200 rounded-full text-sm">Premium</span>
                  </div>
                  <p className="text-amber-100 mb-4">
                    Rare ID numbers (#007, #777, #888) or premium Eiffel Tower views. Designed specifically for <strong>maximum resale value</strong>.
                  </p>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-300 mb-1">$49.99 - $199.99</div>
                    <div className="text-sm text-amber-200/80">Projected 20-40% annual appreciation</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-8 border-t border-slate-700">
                <div className="text-center">
                  <div className="text-sm text-slate-400 mb-2">Current Market Status</div>
                  <div className="text-2xl font-bold text-white">347,293 / 1,000,000</div>
                  <div className="text-sm text-slate-300">Spots already secured (34.73% sold)</div>
                  <div className="h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#e11d48] to-pink-600 rounded-full" style={{ width: '41.3%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ROADMAP - Enhanced with Details */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
              The Global Market <span className="text-[#e11d48]">Roadmap</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              We're building more than an app—we're creating a <strong>decentralized global monument</strong>. 
              Early holders aren't just users; they're the <strong>architects of a new digital economy</strong>.
            </p>
          </div>

          <div className="space-y-12">
            
            {/* Phase 1 */}
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-8 rounded-3xl shadow-xl">
                  <div className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2">Phase 1: Now</div>
                  <div className="text-4xl font-bold mb-2">0 → 500,000 Locks</div>
                  <div className="text-blue-100">Foundation & Early Adoption</div>
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">✓</div>
                    <div>
                      <div className="font-bold text-slate-900">Fixed Price Entry</div>
                      <div className="text-slate-700">All locks available at $29.99 (early adopter advantage)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">✓</div>
                    <div>
                      <div className="font-bold text-slate-900">Internal Marketplace Active</div>
                      <div className="text-slate-700">Buy/sell between users with instant settlement</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">✓</div>
                    <div>
                      <div className="font-bold text-slate-900">Fiat Gateway</div>
                      <div className="text-slate-700">Credit card, Apple Pay, Google Pay integration</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">🎯</div>
                    <div>
                      <div className="font-bold text-slate-900">Primary Goal</div>
                      <div className="text-slate-700">Secure all prime locations before global exposure</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-8 rounded-3xl shadow-xl">
                  <div className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2">Phase 2: Global Bridge</div>
                  <div className="text-4xl font-bold mb-2">At 500,000 Locks</div>
                  <div className="text-purple-100">International Market Integration</div>
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">🚀</div>
                    <div>
                      <div className="font-bold text-slate-900">Global Crypto Market Connection</div>
                      <div className="text-slate-700">Your locks become tradeable as NFTs on OpenSea, Blur, etc.</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">🌍</div>
                    <div>
                      <div className="font-bold text-slate-900">International Investor Entry</div>
                      <div className="text-slate-700">Crypto whales, investment funds, and global collectors enter</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">📈</div>
                    <div>
                      <div className="font-bold text-slate-900">Uncapped Valuation</div>
                      <div className="text-slate-700">Market value determined by global demand, not platform caps</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">💎</div>
                    <div>
                      <div className="font-bold text-slate-900">Early Holder Advantage</div>
                      <div className="text-slate-700">Phase 1 buyers enjoy massive unrealized gains at launch</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="grid md:grid-cols-5 gap-8 items-center">
              <div className="md:col-span-2">
                <div className="bg-gradient-to-r from-emerald-500 to-green-500 text-white p-8 rounded-3xl shadow-xl">
                  <div className="text-sm font-bold uppercase tracking-widest opacity-90 mb-2">Phase 3: Sold Out</div>
                  <div className="text-4xl font-bold mb-2">1,000,000 Locks</div>
                  <div className="text-emerald-100">Scarcity-Driven Economy</div>
                </div>
              </div>
              <div className="md:col-span-3">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">⛔</div>
                    <div>
                      <div className="font-bold text-slate-900">Minting Closed Forever</div>
                      <div className="text-slate-700">No new locks can be created. Total supply fixed at 1M</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">🏆</div>
                    <div>
                      <div className="font-bold text-slate-900">Secondary Market Only</div>
                      <div className="text-slate-700">The only way to get a spot is to buy from existing holders (YOU)</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">💰</div>
                    <div>
                      <div className="font-bold text-slate-900">Pure Scarcity Economics</div>
                      <div className="text-slate-700">30M annual tourists ÷ 1M spots = natural price appreciation</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">👑</div>
                    <div>
                      <div className="font-bold text-slate-900">Early Adopter Royalty</div>
                      <div className="text-slate-700">Phase 1 buyers become permanent rentiers of digital Paris real estate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA & WARNING */}
      <section className="py-20 text-center bg-gradient-to-br from-slate-900 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(225,29,72,0.4),transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-900 text-sm font-bold uppercase tracking-wider mb-6">
            <Clock className="h-4 w-4" /> Time-Sensitive Opportunity
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
            Smart Investors Don't Wait for<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400">The 500k Milestone</span>
          </h2>
          
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              The <strong>best locations (Eiffel Tower view, bridge center, golden numbers)</strong> are disappearing daily. 
              Once Phase 2 begins and global investors enter, early prices will be a distant memory.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold text-amber-300 mb-2">48%</div>
                <div className="text-sm text-slate-300">Prime spots already taken</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold text-rose-300 mb-2">17 days</div>
                <div className="text-sm text-slate-300">Avg. sellout time for Eiffel views</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10">
                <div className="text-3xl font-bold text-emerald-300 mb-2">343k/1M</div>
                <div className="text-sm text-slate-300">Total spots secured (34.3%)</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-6 mb-10">
              <div className="flex items-center gap-4 mb-4">
                <TrendingUp className="h-8 w-8 text-amber-400" />
                <div className="text-left">
                  <div className="font-bold text-white text-lg">Market Insight</div>
                  <div className="text-slate-300 text-sm">Early buyers of premium spots are already seeing 3-5x returns on internal marketplace</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/purchase" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-bold px-14 py-8 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform">
                <Gem className="mr-3 h-6 w-6" /> Acquire My Prime Asset • $29.99
              </Button>
            </Link>
            <Link href="/bridge" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-8 text-xl rounded-full">
                <Globe className="mr-3" /> Explore Available Spots First
              </Button>
            </Link>
          </div>
          
          <p className="text-sm text-slate-400 mt-8">
            <ShieldCheck className="inline h-4 w-4 mr-1" /> 7-day satisfaction guarantee • Instant delivery • No hidden fees
          </p>
        </div>
      </section>

      {/* FOOTER avec Structured Data */}
      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-10 mb-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-[#e11d48] fill-[#e11d48]" />
                  <span className="text-2xl font-serif font-bold text-slate-900">LoveLock<span className="text-[#e11d48]">Paris</span></span>
                </div>
                <p className="text-sm text-slate-600">
                  The world's first digital real estate platform on a UNESCO-adjacent monument. 
                  Combining romance, technology, and smart investment.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Investment Resources</h4>
                <div className="space-y-2 text-sm">
                  <a href="/marketplace" className="block text-slate-600 hover:text-[#e11d48]">Live Marketplace</a>
                  <a href="/spot-map" className="block text-slate-600 hover:text-[#e11d48]">Available Spot Map</a>
                  <a href="/investment-guide" className="block text-slate-600 hover:text-[#e11d48]">Beginner's Guide</a>
                  <a href="/performance" className="block text-slate-600 hover:text-[#e11d48]">Historical Performance</a>
                </div>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-900 mb-4">Legal & Compliance</h4>
                <div className="space-y-2 text-sm">
                  <a href="/terms" className="block text-slate-600 hover:text-[#e11d48]">Terms of Service</a>
                  <a href="/privacy" className="block text-slate-600 hover:text-[#e11d48]">Privacy Policy</a>
                  <a href="/disclaimer" className="block text-slate-600 hover:text-[#e11d48]">Investment Disclaimer</a>
                  <a href="/compliance" className="block text-slate-600 hover:text-[#e11d48]">Regulatory Compliance</a>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 text-center text-xs text-slate-500">
              <p className="mb-2">© 2025 PANORAMA GRUP. All rights reserved. LoveLockParis™ is a registered trademark.</p>
              <p className="text-slate-400">
                Digital assets involve risk. Past performance doesn't guarantee future results. 
                This is not financial advice. Consult a professional before investing.
              </p>
              <p className="mt-4 text-slate-400">
                Bridge Coordinates: 48.8583° N, 2.3375° E • Pont des Arts, 75006 Paris, France
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
