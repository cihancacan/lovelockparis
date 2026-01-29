import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/home/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, ShieldAlert, Smartphone, ArrowRight, History, Info } from 'lucide-react';
import { PurchaseNotifications } from '@/components/home/purchase-notifications';

export async function generateMetadata({ params: { locale } }: any) {
  return {
    title: 'Love Lock Bridge Paris: The Official Guide (2026 Updated)',
    description: 'Everything about the Love Lock Bridge in Paris. History, the 2015 ban, location of Pont des Arts, and the new legal digital way to place a lock.',
    keywords: ['Love Lock Bridge Paris', 'Pont des Arts', 'Paris Love Locks', 'Lock Bridge History', 'Paris Romantic Spots'],
  };
}

export default async function Page({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('home');

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "The Ultimate Guide to Love Lock Bridge Paris",
    "image": "https://lovelockparis.com/images/concept-value.jpg",
    "author": { "@type": "Organization", "name": "LoveLockParis" }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Header translations={{ navBridge: t('nav.bridge'), problemHeading: t('problem.heading'), solutionHeading: t('solution.heading'), ctaStart: t('cta.start') }} />

      <main>
        <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
           <div className="absolute inset-0 opacity-40"><Image src="/images/concept-value.jpg" alt="Pont des Arts" fill className="object-cover" /></div>
           <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-transparent"></div>
           <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
             <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">The Love Lock Bridge Paris</h1>
             <p className="text-xl text-slate-300 mb-8">The complete history of the Pont des Arts tradition and its digital rebirth.</p>
             <Link href="/purchase"><Button size="lg" className="bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-full">Secure Your Digital Lock Now</Button></Link>
           </div>
        </section>

        <div className="container mx-auto px-4 py-16 grid lg:grid-cols-12 gap-12">
          <article className="lg:col-span-8 prose prose-lg prose-slate max-w-none">
            <h2>The History of the Love Lock Bridge</h2>
            <p>The **Pont des Arts** became known as the "Love Lock Bridge" around 2008. Lovers from around the world attached padlocks with their names to the railing and threw the key into the Seine River.</p>
            <p>By 2014, an estimated **700,000 locks** were attached, weighing over **45 tons**.</p>

            <h2>Why were the locks removed?</h2>
            <p>In June 2014, a parapet of the bridge collapsed under the weight. The City of Paris cited safety concerns and heritage preservation. In 2015, all locks were removed and replaced with glass panels.</p>

            <div className="p-6 bg-emerald-50 border-l-4 border-emerald-500 rounded-r-xl my-8">
              <h3 className="text-emerald-900 font-bold m-0 mb-2">The New Tradition (2026)</h3>
              <p className="text-emerald-800 m-0">LoveLockParis has launched the official **Digital Registry**. Using Augmented Reality, you can now place a virtual lock on the bridge legally and eternally. No rust, no weight, just love.</p>
            </div>
            
            <h3>Related Questions</h3>
            <ul>
                <li><Link href="/guide/is-it-illegal-paris-locks" className="text-blue-600 hover:underline">Is it illegal to put a lock in Paris?</Link></li>
                <li><Link href="/guide/where-is-pont-des-arts" className="text-blue-600 hover:underline">Where is the bridge located?</Link></li>
            </ul>
          </article>
          
          <aside className="lg:col-span-4 space-y-6">
            <Card className="bg-white shadow-xl sticky top-24">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-xl mb-2">Join the Registry</h3>
                <p className="text-slate-500 text-sm mb-4">350,000+ locks secured.</p>
                <Link href="/purchase"><Button className="w-full bg-[#e11d48]">Create Yours ($29.99)</Button></Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}
