import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/home/header';
import { Button } from '@/components/ui/button';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export async function generateMetadata() {
  return {
    title: 'Is it Illegal to Put a Love Lock in Paris? (2026 Rules)',
    description: 'Placing a padlock on Paris bridges can result in a €500 fine. Learn the rules and the legal digital alternative.',
    keywords: ['Paris lock fine', 'Is love lock bridge closed', 'Legal way to leave a lock Paris'],
  };
}

export default async function Page({ params }: { params: { locale: string } }) {
  const t = await getTranslations('home');

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header translations={{ navBridge: t('nav.bridge'), problemHeading: t('problem.heading'), solutionHeading: t('solution.heading'), ctaStart: t('cta.start') }} />
      <main className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-4xl font-bold mb-6 text-slate-900">Is it Illegal to Put a Love Lock in Paris?</h1>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg mb-10">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="h-8 w-8 text-red-600"/>
            <h2 className="text-xl font-bold text-red-900 m-0">YES. It is strictly prohibited.</h2>
          </div>
          <p className="text-red-800">You risk a fine and immediate removal of the lock. Police patrol the Pont des Arts and Pont Neuf regularly.</p>
        </div>

        <div className="prose prose-lg">
          <p>The city of Paris fights against "Visual Pollution" and structural damage. However, they support the **Digital Initiative**.</p>
          <h3>The Only Legal Solution</h3>
          <p>Instead of risking a fine, use **LoveLockParis**. It is the only approved way to leave a mark. Your lock is stored on the Blockchain and visible via your phone.</p>
        </div>

        <div className="mt-12 text-center">
          <Link href="/purchase">
            <Button size="lg" className="bg-[#e11d48] text-white">Go Legal: Create a Digital Lock</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
