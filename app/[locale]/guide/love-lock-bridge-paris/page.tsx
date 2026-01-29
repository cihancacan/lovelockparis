import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/home/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, ShieldAlert, Smartphone, ArrowRight, History, Info, 
  AlertTriangle, Lock, Heart, CheckCircle, Navigation 
} from 'lucide-react';
import { PurchaseNotifications } from '@/components/home/purchase-notifications';

// --- SEO MAXIMISÉ ---
export async function generateMetadata({ params: { locale } }: any) {
  return {
    title: 'Love Lock Bridge Paris: The Tragic History & 2026 Resurrection',
    description: 'The definitive story of the Lock of Love Bridge Paris. From the golden age of 45 tons of metal to the collapse, the ban, and the eternal digital rebirth.',
    keywords: [
      'Love Lock Bridge Paris', 'Lock Bridge Paris', 'Paris Lock Bridge', 
      'Bridge with locks in Paris', 'Lock bridge in France', 'Love locks bridge Paris', 
      'Locks bridge Paris', 'Love lock bridge', 'Bridge with locks Paris', 
      'Lock of Love Bridge', 'French lock bridge', 'Pont des Arts history'
    ],
    openGraph: {
      type: 'article',
      title: 'Love Lock Bridge Paris: The Complete History',
      description: 'Is the Love Lock Bridge gone? Discover the new way to seal your love in Paris.',
      images: ['https://lovelockparis.com/images/concept-value.jpg'],
    },
  };
}

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('home');

  // --- DONNÉES STRUCTURÉES (POUR L'IA) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The History and Future of the Love Lock Bridge Paris",
    "datePublished": "2024-02-01",
    "dateModified": "2026-01-29",
    "author": { "@type": "Organization", "name": "LoveLockParis" },
    "image": "https://lovelockparis.com/images/concept-value.jpg",
    "articleBody": "The Pont des Arts, known as the Love Lock Bridge, collapsed under 45 tons of metal in 2014. It is now illegal to place locks. LoveLockParis offers the digital alternative.",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is the Love Lock Bridge Paris still there?",
        "acceptedAnswer": { "@type": "Answer", "text": "The bridge structure (Pont des Arts) remains, but the wire mesh panels covered in locks were removed in 2015 and replaced with glass panels." }
      },
      {
        "@type": "Question",
        "name": "Where is the bridge with locks in Paris?",
        "acceptedAnswer": { "@type": "Answer", "text": "The original bridge is the Pont des Arts, located in the 6th arrondissement of Paris, connecting the Institut de France to the Louvre." }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <Header translations={{ navBridge: t('nav.bridge'), problemHeading: t('problem.heading'), solutionHeading: t('solution.heading'), ctaStart: t('cta.start') }} />

      <main>
        {/* HERO IMMERSIF */}
        <section className="relative py-32 bg-slate-900 text-white overflow-hidden">
           <div className="absolute inset-0 opacity-40">
             <Image src="/images/concept-value.jpg" alt="Pont des Arts Love Lock Bridge Paris" fill className="object-cover" priority />
           </div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
           
           <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
             <div className="inline-flex items-center gap-2 bg-amber-500 text-black font-bold px-4 py-1 rounded-full text-xs uppercase tracking-widest mb-6">
                <History size={14}/> The Official Guide
             </div>
             <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 leading-tight">
               The Rise and Fall of the <br/><span className="text-emerald-400">Love Lock Bridge Paris</span>
             </h1>
             <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
               It started with a secret whisper among lovers. It ended with 45 tons of metal and a collapsing bridge. Discover the true story of the most romantic controversy in French history.
             </p>
             <Link href="/purchase">
                <Button size="lg" className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-full px-10 py-8 text-xl shadow-2xl transition-transform hover:scale-105">
                  Write Your Name in History <ArrowRight className="ml-2"/>
                </Button>
             </Link>
           </div>
        </section>

        <div className="container mx-auto px-4 py-16 grid lg:grid-cols-12 gap-12">
          
          {/* --- CORPS DE L'ARTICLE (ROMANCÉ & SEO) --- */}
          <article className="lg:col-span-8 prose prose-lg prose-slate max-w-none">
            
            <p className="lead text-2xl font-serif text-slate-800 italic border-l-4 border-[#e11d48] pl-6 py-2">
              "Paris is the city of love. But in 2014, the city discovered that love can be heavy. Too heavy."
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              The Golden Age: How the <span className="text-[#e11d48]">Lock Bridge Paris</span> Became a Legend
            </h2>
            <p>
              It began mysteriously around 2008. No one knows exactly who placed the first padlock on the <strong>Pont des Arts</strong>. Was it an Italian couple inspired by Federico Moccia’s novel? Was it a Parisian secret?
            </p>
            <p>
              Regardless of its origin, the ritual spread like wildfire. The <strong>bridge with locks in Paris</strong> became a pilgrimage site. Couples from Tokyo, New York, and Rio de Janeiro flocked to this wooden footbridge. The ritual was simple, poetic, and powerful:
            </p>
            <ul className="list-none bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <li className="flex items-center gap-3"><CheckCircle className="text-emerald-500" size={20}/> <strong>Step 1:</strong> Write your names on a padlock.</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-emerald-500" size={20}/> <strong>Step 2:</strong> Lock it to the wire mesh railing.</li>
              <li className="flex items-center gap-3"><CheckCircle className="text-emerald-500" size={20}/> <strong>Step 3:</strong> Throw the key into the Seine River, sealing your love forever.</li>
            </ul>
            <p>
              By 2013, the <strong>locks bridge Paris</strong> was no longer just a bridge; it was a monument of gold and brass. It shimmered in the sunlight. But beneath the romance, a disaster was brewing.
            </p>

            <h2 className="text-3xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              June 2014: When the <span className="text-amber-600">Lock of Love Bridge</span> Collapsed
            </h2>
            <p>
              Imagine 45 tons. That is the weight of 45 cars, or a herd of elephants. That is the weight the <strong>French lock bridge</strong> was carrying in metal padlocks.
            </p>
            <p>
              On a warm Sunday in June 2014, panic struck. A 2.4-meter section of the railing crumbled under the sheer weight of the love locks. The grille collapsed inward onto the walkway. Had it fallen outward, it would have crushed a tourist boat passing below on the Seine.
            </p>
            <div className="bg-amber-50 p-6 rounded-xl border-l-4 border-amber-500">
               <h4 className="flex items-center gap-2 text-amber-800 font-bold m-0 mb-2"><AlertTriangle/> The Turning Point</h4>
               <p className="m-0 text-amber-700">
                 The incident on the <strong>bridge with locks Paris</strong> was a wake-up call. The city realized that "Love" was literally destroying the heritage. The Pont des Arts, built under Napoleon, was at risk of sinking.
               </p>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mt-12 flex items-center gap-3">
              The Ban: Is the <span className="text-red-600">Love Locks Bridge Paris</span> Illegal?
            </h2>
            <p>
              In 2015, the City of Paris made a heartbreaking decision. In a massive operation, city workers cut down over <strong>700,000 locks</strong>. The iconic wire mesh was removed and replaced with plexiglass panels to prevent any new locks from being attached.
            </p>
            <p>
              <strong>Today, placing a physical lock is strictly illegal.</strong>
            </p>
            <p>
              Police patrol the area regularly. Tourists caught trying to attach a lock to a lamppost or a nearby fence face fines of up to <strong>€500</strong> for vandalism of a protected monument. The era of the physical <strong>lock bridge</strong> is over.
            </p>

            {/* LA SOLUTION (TA PARTIE) */}
            <div className="mt-16 relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl not-prose">
               <div className="absolute top-0 right-0 p-8 opacity-10"><Smartphone size={150} /></div>
               <div className="relative z-10 p-10">
                  <Badge className="bg-[#e11d48] text-white mb-4 px-3 py-1">2026 UPDATE</Badge>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Story Continues: The Digital Resurrection</h2>
                  <p className="text-lg text-slate-300 mb-6">
                    Love cannot be banned. It just needed to evolve.
                    <br/><br/>
                    In 2025, a French startup launched <strong>LoveLockParis</strong>, the official digital registry. By using <strong>Augmented Reality (AR)</strong> and <strong>Blockchain</strong> technology, we solved the weight problem while keeping the romance alive.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/10 p-4 rounded-xl">
                       <h4 className="font-bold text-emerald-400 mb-1">0 Grams</h4>
                       <p className="text-xs text-slate-400">No weight on the bridge. 100% Eco-friendly.</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                       <h4 className="font-bold text-amber-400 mb-1">Eternal</h4>
                       <p className="text-xs text-slate-400">Secured on Blockchain. Never rusts.</p>
                    </div>
                  </div>

                  <Link href="/purchase">
                    <Button className="w-full bg-gradient-to-r from-[#e11d48] to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold h-16 text-xl rounded-xl shadow-lg">
                       Secure Your Digital Lock <ArrowRight className="ml-2"/>
                    </Button>
                  </Link>
                  <p className="text-center text-xs text-slate-500 mt-4">Join 350,000+ couples in the new era.</p>
               </div>
            </div>

          </article>
          
          {/* SIDEBAR (Sticky) - Pour capter le trafic */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* CARTE D'ACTION */}
            <Card className="bg-white shadow-2xl border-slate-200 sticky top-24 overflow-hidden">
              <div className="h-2 bg-[#e11d48]"></div>
              <CardContent className="p-6 text-center">
                <Lock className="h-12 w-12 text-[#e11d48] mx-auto mb-4" />
                <h3 className="font-bold text-2xl text-slate-900 mb-2">Visiting Paris?</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Don't risk a fine. Leave a mark that lasts forever.
                </p>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Spots Remaining</div>
                  <div className="text-3xl font-black text-slate-900">642,912</div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                     <div className="bg-emerald-500 h-full w-[35%]"></div>
                  </div>
                </div>

                <Link href="/purchase">
                  <Button className="w-full bg-[#e11d48] hover:bg-[#be123c] font-bold h-12 text-lg shadow-md">
                    Create My Lock ($29.99)
                  </Button>
                </Link>
                <div className="mt-4 flex justify-center gap-4 text-xs text-slate-400">
                   <span className="flex items-center gap-1"><CheckCircle size={10}/> Instant</span>
                   <span className="flex items-center gap-1"><CheckCircle size={10}/> Legal</span>
                </div>
              </CardContent>
            </Card>

            {/* INFO PRATIQUE */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg">
               <h4 className="font-bold text-lg mb-4 flex items-center gap-2"><MapPin className="text-[#e11d48]"/> How to get there</h4>
               <ul className="space-y-4 text-sm text-slate-300">
                 <li className="flex gap-3">
                    <Navigation size={16} className="shrink-0 mt-1"/>
                    <div>
                       <strong className="text-white block">Pont des Arts</strong>
                       75006 Paris, France
                    </div>
                 </li>
                 <li className="flex gap-3">
                    <div className="font-bold text-yellow-400 shrink-0">M</div>
                    <div>
                       <strong className="text-white">Metro Line 1</strong>
                       Stop: Louvre-Rivoli
                    </div>
                 </li>
                 <li className="flex gap-3">
                    <div className="font-bold text-pink-400 shrink-0">M</div>
                    <div>
                       <strong className="text-white">Metro Line 7</strong>
                       Stop: Pont Neuf
                    </div>
                 </li>
               </ul>
            </div>

            {/* KEYWORDS CLOUD (Caché visuellement mais bon pour SEO) */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 opacity-60 hover:opacity-100 transition-opacity">
               <h4 className="font-bold text-slate-900 mb-2 text-xs uppercase">Related Topics</h4>
               <div className="flex flex-wrap gap-2">
                 {['lock bridge', 'love lock paris', 'pont des arts', 'paris romance', 'honeymoon paris', 'padlock bridge'].map(tag => (
                    <span key={tag} className="text-[10px] bg-white border border-slate-200 px-2 py-1 rounded text-slate-500">#{tag}</span>
                 ))}
               </div>
            </div>

          </aside>

        </div>
        
        <PurchaseNotifications />

      </main>
    </div>
  );
}
