import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/home/header';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation } from 'lucide-react';

export async function generateMetadata() {
  return {
    title: 'Where is the Love Lock Bridge in Paris? Map & GPS',
    description: 'Exact location of the Pont des Arts, metro stations, and how to find the Love Lock spot in Paris.',
    keywords: ['Pont des Arts location', 'Love lock bridge map', 'Metro station love lock bridge'],
  };
}

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations('home');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header translations={{ navBridge: t('nav.bridge'), problemHeading: t('problem.heading'), solutionHeading: t('solution.heading'), ctaStart: t('cta.start') }} />
      <main className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-slate-900">Where is the Love Lock Bridge?</h1>
        
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 mb-10">
          <div className="flex items-center gap-3 mb-4">
             <MapPin className="h-6 w-6 text-blue-600"/>
             <span className="text-xl font-bold">Pont des Arts, 75006 Paris</span>
          </div>
          <p className="text-slate-600 mb-4">It connects the <strong>Institut de France</strong> (Left Bank) to the <strong>Louvre Museum</strong> (Right Bank).</p>
          <div className="grid grid-cols-2 gap-4 text-sm bg-slate-50 p-4 rounded-lg">
             <div><strong>Metro:</strong> Louvre-Rivoli (Line 1)</div>
             <div><strong>Metro:</strong> Pont Neuf (Line 7)</div>
          </div>
        </div>

        <div className="prose prose-lg">
          <h3>How to see the locks?</h3>
          <p>If you go there today, you will see glass panels. To see the locks, you need the **LoveLockParis App** (Web). It uses AR to show the virtual locks on the bridge.</p>
        </div>

        <div className="mt-12 text-center">
          <Link href="/bridge">
            <Button size="lg" variant="outline" className="mr-4">View 3D Map</Button>
          </Link>
          <Link href="/purchase">
            <Button size="lg" className="bg-[#e11d48] text-white">Place a Lock Here</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
