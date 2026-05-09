import Link from 'next/link';
import Image from 'next/image';
import { Heart, Lock, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Header } from '@/components/home/header';
import { Button } from '@/components/ui/button';

export default function HomeV2({ params }: { params: { locale: string } }) {
  const locale = params.locale || 'en';
  const isFr = locale === 'fr';
  const purchaseHref = `/${locale}/purchase`;
  const conceptHref = `/${locale}/concept`;

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-x-hidden">
      <Header translations={{ navBridge: 'Bridge', problemHeading: 'Why', solutionHeading: 'How', ctaStart: isFr ? 'Créer notre cadenas' : 'Create our lock' }} />
      <main>
        <section className="relative min-h-[86vh] overflow-hidden bg-slate-950 text-white">
          <div className="absolute inset-0">
            <Image src="/images/pont-des-arts-paris.jpg" alt="Pont des Arts Paris" fill priority sizes="100vw" className="object-cover opacity-55" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/70 to-slate-950/20" />
          </div>
          <div className="container relative z-10 mx-auto px-4 py-20 md:py-28">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-wider ring-1 ring-white/20">
                  <Heart className="h-4 w-4 fill-[#e11d48] text-[#e11d48]" />
                  {isFr ? 'Souvenir digital • Pont des Arts' : 'Digital memory • Pont des Arts'}
                </div>
                <h1 className="mt-7 text-4xl sm:text-5xl md:text-7xl font-serif font-bold leading-[0.95]">
                  {isFr ? 'Créez votre cadenas' : 'Create your love lock'}<br />
                  <span className="text-[#fb7185]">{isFr ? 'd’amour à Paris' : 'in Paris'}</span>
                </h1>
                <p className="mt-7 max-w-2xl text-base sm:text-lg md:text-xl leading-relaxed text-slate-100">
                  {isFr
                    ? 'Ajoutez vos prénoms, votre message et gardez un souvenir digital inspiré de la tradition du Pont des Arts.'
                    : 'Add your names, your message, and keep a digital memory inspired by the Pont des Arts love lock tradition.'}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link href={purchaseHref}>
                    <Button size="lg" className="w-full sm:w-auto rounded-full bg-[#e11d48] px-8 py-7 text-base sm:text-lg font-bold text-white hover:bg-[#be123c]">
                      <Lock className="mr-2 h-5 w-5" /> {isFr ? 'Créer notre cadenas • dès 29,99 $' : 'Create our lock • from $29.99'}
                    </Button>
                  </Link>
                  <Link href={conceptHref}>
                    <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full border-white/50 bg-white/10 px-8 py-7 text-base sm:text-lg font-bold text-white hover:bg-white hover:text-slate-950">
                      {isFr ? 'Voir le concept' : 'See the concept'} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-100">
                  {[isFr ? 'Aperçu avant paiement' : 'Preview before payment', isFr ? 'Souvenir accessible à vie' : 'Lifetime access memory', '3D / AR'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 ring-1 ring-white/15"><CheckCircle className="h-4 w-4 text-emerald-300" /> {item}</span>
                  ))}
                </div>
              </div>
              <div className="mx-auto w-full max-w-md">
                <div className="rounded-[2rem] bg-white/95 p-5 text-slate-900 shadow-2xl">
                  <div className="rounded-[1.5rem] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-slate-50 p-6 text-center">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e11d48] text-white shadow-xl rotate-[-6deg]"><Heart className="h-10 w-10 fill-white" /></div>
                    <p className="mt-6 text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Pont des Arts • Paris</p>
                    <h2 className="mt-3 font-serif text-3xl font-bold text-slate-950">Julie & Thomas</h2>
                    <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm italic text-slate-600 shadow-sm">Forever in Paris — 14.02.2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-16 bg-white text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <Sparkles className="mx-auto h-10 w-10 text-[#e11d48]" />
            <h2 className="mt-5 text-3xl sm:text-5xl font-serif font-bold text-slate-950">{isFr ? 'Simple, émotionnel, rapide.' : 'Simple, emotional, fast.'}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-600">{isFr ? 'La page d’accueil se concentre maintenant sur le souvenir romantique. La marketplace, les numéros rares et la collection restent dans la page Concept.' : 'The homepage now focuses on the romantic memory. Marketplace, rare numbers and collecting stay on the Concept page.'}</p>
            <Link href={purchaseHref}><Button className="mt-8 rounded-full bg-[#e11d48] px-8 py-7 font-bold text-white hover:bg-[#be123c]">{isFr ? 'Créer notre cadenas' : 'Create our lock'}</Button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
