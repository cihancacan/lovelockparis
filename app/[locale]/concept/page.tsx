import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, CheckCircle, Heart, Lock, Map, ShieldCheck, Sparkles } from 'lucide-react';
import { Header } from '@/components/home/header';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'How LoveLockParis Works | Digital Love Lock Experience',
  description: 'See how to personalize, purchase and revisit your digital Love Lock inspired by the Pont des Arts in Paris.',
};

const copy: Record<string, any> = {
  en:{
    nav:'3D Bridge',cta:'Create our Love Lock',eyebrow:'How it works',title:'A romantic gesture, made digital.',sub:'LoveLockParis turns the love-lock tradition into a simple digital experience you can personalize, revisit and share.',
    s1:'Personalize your lock',d1:'Add your names, a short message and choose a finish.',s2:'Get a unique number',d2:'Every new lock receives its own number. A special number is optional when available.',
    s3:'Pay securely',d3:'Checkout is handled by Stripe. You do not need to create an account before paying.',s4:'Revisit your lock',d4:'After purchase, create an account if you want to keep the lock in your dashboard and explore the 3D bridge.',
    preview:'What your experience includes',p1:'Personalized names and message',p2:'Classic, Gold or Diamond finishes',p3:'Unique Love Lock number',p4:'3D bridge experience',p5:'Optional digital memory',p6:'Customer support through Crisp',
    ar:'Augmented-reality experience',arText:'The project also includes an AR view for compatible experiences. Availability can depend on your device and browser.',
    simple:'No crypto knowledge. No wallet required. No investment pitch.',simpleText:'The main LoveLockParis experience is a digital romantic product. Marketplace and other account features are secondary and never required to create your first lock.',
    final:'Create the memory first. Everything else can come later.'
  },
  fr:{
    nav:'Pont 3D',cta:'Créer notre cadenas',eyebrow:'Comment ça marche',title:'Un geste romantique, en version numérique.',sub:'LoveLockParis transforme la tradition du cadenas d’amour en une expérience numérique simple à personnaliser, retrouver et partager.',
    s1:'Personnalisez votre cadenas',d1:'Ajoutez vos prénoms, un petit message et choisissez une finition.',s2:'Recevez un numéro unique',d2:'Chaque nouveau cadenas reçoit son propre numéro. Un numéro spécial reste une option si disponible.',
    s3:'Payez en sécurité',d3:'Le paiement est géré par Stripe. Aucun compte n’est nécessaire avant de payer.',s4:'Retrouvez votre cadenas',d4:'Après l’achat, créez un compte si vous souhaitez conserver votre cadenas dans le tableau de bord et explorer le pont 3D.',
    preview:'Ce que comprend l’expérience',p1:'Prénoms et message personnalisés',p2:'Finitions Classique, Or ou Diamant',p3:'Numéro de cadenas unique',p4:'Expérience du pont 3D',p5:'Souvenir numérique en option',p6:'Support client via Crisp',
    ar:'Expérience en réalité augmentée',arText:'Le projet comprend également une vue AR pour les expériences compatibles. La disponibilité peut dépendre de votre appareil et de votre navigateur.',
    simple:'Pas de crypto à comprendre. Aucun wallet requis. Aucun discours d’investissement.',simpleText:'L’expérience principale LoveLockParis est un produit romantique numérique. La marketplace et les fonctions de compte sont secondaires et ne sont jamais nécessaires pour créer votre premier cadenas.',
    final:'Créez d’abord le souvenir. Le reste peut venir après.'
  }
};

export default function ConceptPage({params}:{params:{locale:string}}){
  const locale=params.locale;
  const t=copy[locale]||copy.en;
  const prefix=locale==='en'?'':`/${locale}`;
  const steps=[
    [Heart,t.s1,t.d1],
    [Lock,t.s2,t.d2],
    [ShieldCheck,t.s3,t.d3],
    [Map,t.s4,t.d4],
  ];
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header translations={{navBridge:t.nav,problemHeading:'',solutionHeading:'',ctaStart:t.cta}} />
      <main>
        <section className="bg-[#fffdfc] px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-xs font-black uppercase tracking-[.2em] text-[#e11d48]">{t.eyebrow}</p>
            <h1 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-6xl">{t.title}</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{t.sub}</p>
            <Link href={`${prefix}/purchase`} className="mt-7 inline-block"><Button className="h-14 rounded-full bg-[#e11d48] px-7 font-black text-white hover:bg-[#be123c]"><Heart className="mr-2 h-5 w-5 fill-current"/>{t.cta}</Button></Link>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid gap-4 md:grid-cols-2">
              {steps.map(([Icon,title,desc]:any,i)=>(
                <div key={title} className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                  <div className="flex items-center gap-3"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 font-black text-[#e11d48]">{i+1}</span><Icon className="h-5 w-5 text-slate-400"/></div>
                  <h2 className="mt-5 text-2xl font-bold">{title}</h2>
                  <p className="mt-3 leading-7 text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-950 py-16 text-white sm:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
            <div className="relative min-h-[420px] overflow-hidden rounded-[2rem] bg-white/5">
              <Image src="/images/skin-gold.png" alt="LoveLockParis Gold Love Lock" fill className="object-contain p-8" />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold sm:text-4xl">{t.preview}</h2>
              <div className="mt-7 space-y-3">
                {[t.p1,t.p2,t.p3,t.p4,t.p5,t.p6].map((item:string)=><div key={item} className="flex items-center gap-3 text-slate-200"><CheckCircle className="h-5 w-5 shrink-0 text-emerald-400"/>{item}</div>)}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-24">
          <div className="mx-auto grid max-w-6xl gap-6 px-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-[#fffdfc] p-8">
              <Camera className="h-7 w-7 text-[#e11d48]"/>
              <h2 className="mt-4 text-2xl font-bold">{t.ar}</h2>
              <p className="mt-3 leading-7 text-slate-600">{t.arText}</p>
            </div>
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8">
              <Sparkles className="h-7 w-7 text-emerald-600"/>
              <h2 className="mt-4 text-2xl font-bold text-emerald-950">{t.simple}</h2>
              <p className="mt-3 leading-7 text-emerald-900/70">{t.simpleText}</p>
            </div>
          </div>
        </section>

        <section className="px-4 pb-20">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-gradient-to-br from-rose-600 to-[#9f1239] px-6 py-14 text-center text-white">
            <h2 className="font-serif text-3xl font-bold sm:text-5xl">{t.final}</h2>
            <Link href={`${prefix}/purchase`} className="mt-7 inline-block"><Button className="h-14 rounded-full bg-white px-7 font-black text-[#be123c] hover:bg-rose-50">{t.cta}</Button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
