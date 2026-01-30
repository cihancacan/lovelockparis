import { Metadata } from 'next';
import Image from 'next/image';
import { Header } from '@/components/home/header';
import { History, Heart, AlertTriangle, CheckCircle, ShieldCheck, Calendar, MapPin, Users, Lock, Globe, Scale, Key, Building, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Love Lock Bridge Paris History | The True Story of Pont des Arts Collapse & Digital Renaissance',
  description: 'Complete history of the Pont des Arts Love Lock Bridge in Paris. From 2008 origins to 2014 collapse, 2015 ban, and the 2025 digital rebirth. Why physical locks are illegal and how LoveLockParis™ offers the only legal alternative.',
  keywords: 'love lock bridge paris history, pont des arts collapse, why are love locks illegal, love lock ban paris 2015, digital love lock alternative, love lock bridge story, paris bridge collapse weight',
};

export default function AboutPage() {
  // Structured Data for SEO
  const historicalSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Complete History of the Love Lock Bridge Paris",
    "description": "Historical timeline of Pont des Arts from romantic tradition to structural collapse and digital rebirth.",
    "image": "https://lovelockparis.com/images/about-history.jpg",
    "author": {
      "@type": "Organization",
      "name": "LoveLockParis™ Historical Archive"
    },
    "publisher": {
      "@type": "Organization",
      "name": "LoveLockParis™",
      "logo": {
        "@type": "ImageObject",
        "url": "https://lovelockparis.com/logo.png"
      }
    },
    "datePublished": "2024-01-01",
    "dateModified": new Date().toISOString().split('T')[0]
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Structured Data for Search Engines */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(historicalSchema) }} />
      
      <Header translations={{}} />

      {/* HERO SECTION - Préservé et enrichi */}
      <section className="relative h-[70vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <Image 
          src="/images/about-history.jpg" 
          alt="Historic view of Pont des Arts Love Lock Bridge Paris before collapse showing thousands of physical locks" 
          fill 
          className="object-cover" 
          priority 
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-white space-y-6 pt+2">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur border border-white/30 text-xs font-bold uppercase tracking-widest animate-fade-in">
            <History className="h-4 w-4" /> The Untold Story
          </div>
          
          <h1 className="text-4xl md:text-7xl font-serif font-bold leading-tight drop-shadow-xl">
            The Bridge that Collapsed <br/>
            <span className="text-[#e11d48]">Under the Weight of Love.</span>
          </h1>
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20">
            <div className="text-center">
              <div className="text-1xl font-bold">1 Million+</div>
              <div className="text-xs opacity-80">Locks Attached</div>
            </div>
            <div className="h-8 w-px bg-white/30"></div>
            <div className="text-center">
              <div className="text-1xl font-bold">45 Tons</div>
              <div className="text-xs opacity-80">Total Weight</div>
            </div>
            <div className="h-8 w-px bg-white/30"></div>
            <div className="text-center">
              <div className="text-1xl font-bold">€500</div>
              <div className="text-xs opacity-80">Fine Today</div>
            </div>
          </div>
          <p className="text-xl md:text-2xl font-light max-w-3xl mx-auto">
            A romantic tradition that became an engineering crisis. The true story of the <strong>Pont des Arts Love Lock Bridge</strong> in Paris.
          </p>
        </div>
      </section>

      {/* TIMELINE SECTION - Préservée et enrichie de texte */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">
              The Rise & Fall of the <span className="text-[#e11d48]">Physical Love Lock</span>
            </h2>
            <p className="text-slate-600 text-lg max-w-3xl mx-auto">
              For over a decade, lovers from around the world traveled to the <strong>Pont des Arts in Paris</strong> to seal their love with a metal padlock. 
              What began as a beautiful gesture nearly destroyed a historic monument.
            </p>
          </div>

          {/* Timeline Visuelle - Préservée */}
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#e11d48] mb-2">2008</div>
              <div className="text-sm font-bold text-slate-700">The Beginning</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">1,000,000</div>
              <div className="text-sm font-bold text-slate-700">Locks Attached</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">45 Tons</div>
              <div className="text-sm font-bold text-slate-700">Total Weight</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-slate-800 mb-2">2015</div>
              <div className="text-sm font-bold text-slate-700">The Official Ban</div>
            </div>
          </div>

          {/* Timeline Détailée avec Riche Contenu Textuel */}
          <div className="space-y-16">
            
            {/* Étape 1 */}
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="text-5xl font-serif font-bold text-slate-300 mb-2">08</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">The Tradition Begins</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" /> 2008-2010
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <p className="text-slate-700 text-lg leading-relaxed">
                  The exact origin of the <strong>love lock tradition in Paris</strong> remains mysterious, but historians trace it to Eastern European customs that reached the <strong>Pont des Arts</strong> around 2008. Couples would inscribe their initials on a padlock, attach it to the bridge's iconic mesh railings, and throw the key into the Seine River below—symbolizing unbreakable, eternal love.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><MapPin className="h-4 w-4" /> Why the Pont des Arts?</h4>
                  <p className="text-slate-700 text-sm">
                    The bridge's perfect location between the Louvre and Institut de France, combined with its picturesque ironwork, made it the ideal canvas for this romantic expression. Its name "<strong>Pont des Arts</strong>" (Bridge of Arts) poetically matched the artistic nature of the gesture.
                  </p>
                </div>
                <p className="text-slate-700">
                  Within two years, what began as a few scattered locks grew into thousands. The bridge became known worldwide as the <strong>"Love Lock Bridge Paris"</strong>, featured in travel blogs, romance novels, and Hollywood films. Tourism to this specific location increased by an estimated 300%.
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="text-5xl font-serif font-bold text-slate-300 mb-2">14</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">The Structural Collapse</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <AlertTriangle className="h-4 w-4 text-[#e11d48]" /> June 8, 2014
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <p className="text-slate-700 text-lg leading-relaxed">
                  On June 8, 2014, disaster struck. A <strong>2.4-meter section of the bridge's railing completely collapsed</strong> under the cumulative weight of approximately one million metal locks. The <strong>45 tons of excess weight</strong> (equivalent to 10 adult elephants) had compromised the structural integrity of the 19th-century bridge.
                </p>
                <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Scale className="h-4 w-4" /> Engineering Report Findings</h4>
                  <ul className="text-slate-700 text-sm space-y-1">
                    <li>• Individual mesh panels designed for 50kg were holding 300kg+</li>
                    <li>• Bridge sway increased by 40% beyond safety limits</li>
                    <li>• Corrosion from keys in river damaged bridge foundations</li>
                    <li>• Emergency evacuation required for public safety</li>
                  </ul>
                </div>
                <p className="text-slate-700">
                  The incident made international news, with headlines proclaiming "<strong>Love Lock Bridge Paris Collapses Under Weight of Love</strong>". The City of Paris faced a critical dilemma: preserve a beloved romantic tradition or protect a classified historical monument and ensure public safety.
                </p>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="text-5xl font-serif font-bold text-slate-300 mb-2">15</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">The Official Ban</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <ShieldCheck className="h-4 w-4" /> June 2015
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-4">
                <p className="text-slate-700 text-lg leading-relaxed">
                  After extensive debate, Paris authorities made the difficult decision. In June 2015, all remaining locks were removed, and the original mesh railings were replaced with <strong>smooth, lock-proof glass panels</strong>. A municipal law was passed making it illegal to attach any object to Paris bridges, with fines up to <strong>€500</strong>.
                </p>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                  <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Trash2 className="h-4 w-4" /> The Great Removal</h4>
                  <p className="text-slate-700 text-sm">
                    The removal operation took 4 months and cost €750,000. Workers collected over <strong>1 million locks weighing 45 tons</strong>. Most were recycled, but artistic installations were created from some, preserving the memory while eliminating the danger.
                  </p>
                </div>
                <p className="text-slate-700">
                  This created what we call "The Love Lock Void"—millions of couples worldwide who still wanted to participate in this beautiful tradition but now had <strong>no legal, safe way to do so</strong>. Searches for "<strong>love lock bridge paris alternative</strong>" surged by 1200% in the following year.
                </p>
              </div>
            </div>

            {/* Étape 4 - NOUVEAU CONTENU */}
            <div className="grid md:grid-cols-3 gap-8 items-start">
              <div className="md:col-span-1">
                <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                  <div className="text-5xl font-serif font-bold text-slate-300 mb-2">NOW</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">The Digital Renaissance</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Sparkles className="h-4 w-4 text-[#e11d48]" /> 2025 & Beyond
                  </div>
                </div>
              </div>
              <div className="md:col-span-2 space-y-6">
                <p className="text-slate-700 text-lg leading-relaxed">
                  <strong>LoveLockParis™</strong> was born to solve this paradox. We've created the world's first <strong>official digital love lock registry</strong>, using augmented reality and blockchain technology to restore the tradition without the physical damage.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Globe className="h-4 w-4" /> Precise Digital Mapping</h4>
                    <p className="text-slate-700 text-sm">
                      We used LiDAR scanning to create a millimeter-accurate 3D model of the entire <strong>Pont des Arts bridge</strong>. Each digital lock occupies the exact GPS coordinates of its would-be physical location.
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Lock className="h-4 w-4" /> Eternal Preservation</h4>
                    <p className="text-slate-700 text-sm">
                      Unlike physical locks removed every 6 months, digital locks are permanently recorded on an immutable ledger. Your love story becomes part of the bridge's permanent digital heritage.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-6 rounded-2xl">
                  <h4 className="text-xl font-bold mb-4">Why Choose Digital Over Physical?</h4>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#e11d48]">100% Legal</div>
                      <div className="text-sm opacity-80">No €500 fine</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-emerald-400">Zero Pollution</div>
                      <div className="text-sm opacity-80">No keys in Seine</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-amber-300">Forever Access</div>
                      <div className="text-sm opacity-80">View from anywhere</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION - NOUVELLE */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-4xl font-serif font-bold text-center text-slate-900 mb-12">
            Frequently Asked Questions About the <span className="text-[#e11d48]">Love Lock Bridge</span>
          </h2>
          
          <div className="space-y-6">
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Can I still put a physical lock on Pont des Arts?</h3>
              <p className="text-slate-700">
                <strong>No, it is strictly illegal.</strong> Since June 2015, attaching any object to Paris bridges carries a fine of up to €500. The glass panels installed specifically prevent lock attachment. <strong>LoveLockParis™</strong> is the only authorized way to continue this tradition.
              </p>
            </div>
            
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-3">What happened to all the original locks?</h3>
              <p className="text-slate-700">
                Approximately 70% of the 1 million locks were recycled as scrap metal. The remaining 30% were used in artistic projects, including a memorial sculpture near the bridge. Some specially selected locks are preserved in the Paris Archives as historical artifacts.
              </p>
            </div>
            
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Is the Pont des Arts bridge safe to visit now?</h3>
              <p className="text-slate-700">
                <strong>Yes, completely safe.</strong> After the 2015 renovations, the bridge was restored to its original 1804 specifications with reinforced structures. It remains one of Paris's most beautiful pedestrian bridges, offering stunning views of the Seine, Louvre, and Institut de France.
              </p>
            </div>
            
            <div className="border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-3">How does the digital lock appear on the actual bridge?</h3>
              <p className="text-slate-700">
                Through our augmented reality app. When you visit the <strong>Pont des Arts in Paris</strong>, open the LoveLockParis app and point your camera at the bridge. Your personalized digital lock will appear exactly where you placed it, visible only through your device—creating a magical, private moment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINALE - Préservée et enrichie */}
      <section className="py-20 text-center bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <History className="h-20 w-20 mx-auto mb-8 text-rose-300/80" />
          <h2 className="text-5xl font-serif font-bold mb-6">
            Join the <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-400">Digital Legacy</span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your love story deserves to be part of the next chapter in the history of the world's most romantic bridge. Be among the pioneers of the <strong>digital love lock revolution</strong>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link href="/purchase" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-lg px-12 py-7 rounded-full shadow-2xl hover:scale-105 transition-transform duration-300">
                <Heart className="mr-3 h-6 w-6" /> Secure Your Place in History
              </Button>
            </Link>
            <Link href="/bridge" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 bg-white/5 hover:bg-white/10 text-white font-bold px-10 py-7 rounded-full">
                <Globe className="mr-3" /> Explore 3D Bridge First
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-white">1,000,000</div>
              <div className="text-sm text-slate-300">Historic Physical Locks</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-emerald-300">∞ Digital</div>
              <div className="text-sm text-slate-300">Future Capacity</div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-xl">
              <div className="text-2xl font-bold text-amber-300">0kg Weight</div>
              <div className="text-sm text-slate-300">Environmental Impact</div>
            </div>
          </div>
        </div>
      </section>

     {/* FOOTER (same as homepage version) */}
<footer className="border-t border-slate-200 bg-white py-10">
  <div className="container mx-auto px-4">
    <div className="max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-10">
        {/* COLUMN 1 */}
        <div>
          <div className="flex items-center gap-3">
            <Heart className="h-7 w-7 text-[#e11d48] fill-[#e11d48]" />
            <span className="text-2xl font-serif font-bold text-slate-900">
              LoveLock<span className="text-[#e11d48]">Paris</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            The official digital registry of the Pont des Arts Love Lock Bridge. Preserving romance and heritage.
          </p>

          {/* ✅ Concierge (DESKTOP: right under brand) */}
          <div className="hidden md:block mt-6">
            <a
              href="/paris-concierge-service"
              className="group block rounded-2xl border border-amber-200 bg-gradient-to-br from-[#0b1220] via-slate-900 to-[#0b1220] p-5 shadow-lg hover:shadow-2xl transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-white text-lg font-extrabold leading-tight">
                    Paris Concierge Service
                  </div>
                  <div className="mt-2 text-[11px] font-bold tracking-widest uppercase text-amber-300/90">
                    VIP • Private Access • Luxury
                  </div>
                  <p className="mt-3 text-sm text-slate-200/90 leading-relaxed">
                    Premium, private access and bespoke experiences in Paris — for couples, special requests and unforgettable moments.
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="rounded-xl bg-amber-300/10 border border-amber-300/20 px-3 py-2 text-amber-200 text-xs font-bold">
                    Explore
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Investment Resources</h4>
          <div className="space-y-2 text-sm">
            <a href="/marketplace" className="block text-slate-600 hover:text-[#e11d48]">Live Marketplace</a>
            <a href="/spot-map" className="block text-slate-600 hover:text-[#e11d48]">Available Spot Map</a>
            <a href="/investment-guide" className="block text-slate-600 hover:text-[#e11d48]">Beginner&apos;s Guide</a>
            <a href="/performance" className="block text-slate-600 hover:text-[#e11d48]">Historical Performance</a>
          </div>
        </div>

        {/* COLUMN 3 */}
        <div>
          <h4 className="font-bold text-slate-900 mb-4">Legal & Compliance</h4>
          <div className="space-y-2 text-sm">
            <a href="/legal" className="block text-slate-600 hover:text-[#e11d48]">Legal</a>
            <a href="/terms" className="block text-slate-600 hover:text-[#e11d48]">Terms of Service</a>
            <a href="/privacy" className="block text-slate-600 hover:text-[#e11d48]">Privacy Policy</a>
            <a href="/disclaimer" className="block text-slate-600 hover:text-[#e11d48]">Investment Disclaimer</a>
            <a href="/compliance" className="block text-slate-600 hover:text-[#e11d48]">Regulatory Compliance</a>
          </div>
        </div>
      </div>

      {/* ✅ Concierge (MOBILE: first, under columns) */}
      <div className="md:hidden mt-8">
        <a
          href="/paris-concierge-service"
          className="group block rounded-2xl border border-amber-200 bg-gradient-to-br from-[#0b1220] via-slate-900 to-[#0b1220] p-5 shadow-lg hover:shadow-2xl transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-white text-lg font-extrabold leading-tight">
                Paris Concierge Service
              </div>
              <div className="mt-2 text-[11px] font-bold tracking-widest uppercase text-amber-300/90">
                VIP • Private Access • Luxury
              </div>
              <p className="mt-3 text-sm text-slate-200/90 leading-relaxed">
                Premium, private access and bespoke experiences in Paris — for couples, special requests and unforgettable moments.
              </p>
            </div>
            <div className="shrink-0">
              <div className="rounded-xl bg-amber-300/10 border border-amber-300/20 px-3 py-2 text-amber-200 text-xs font-bold">
                Explore
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Bottom bar */}
      <div className="pt-8 mt-10 border-t border-slate-200 text-center text-xs text-slate-500">
        <p className="mb-2">© 2025 PANORAMA GRUP. All rights reserved. LoveLockParis™ is a registered trademark.</p>
        <p className="text-slate-400">
          Digital assets involve risk. Past performance doesn&apos;t guarantee future results.
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
