import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { Header } from '@/components/home/header';
import { Button } from '@/components/ui/button';

const copy: Record<string, any> = {
  en:{
    nav:'3D Bridge',cta:'Create our Love Lock',eyebrow:'The story behind the tradition',title:'From physical padlocks to a digital memory.',
    sub:'The Pont des Arts became famous around the world for love locks. The tradition changed the bridge — and eventually Paris changed the railings. LoveLockParis keeps the romantic gesture digital.',
    t1:'Late 2000s',h1:'Love locks become part of the Paris image',d1:'Couples began attaching padlocks to bridges as a symbol of their relationship. The Pont des Arts became one of the best-known locations associated with the tradition.',
    t2:'2014',h2:'The weight became a real problem',d2:'A section of railing on the Pont des Arts gave way under the accumulated weight of padlocks, highlighting the structural and maintenance problems created by the tradition.',
    t3:'2015',h3:'Paris removes the locks',d3:'The city removed the remaining padlocks from the Pont des Arts and replaced the lock-covered railings with panels that could not be used in the same way.',
    t4:'Today',h4:'The romantic gesture can be digital',d4:'LoveLockParis is an independent digital experience inspired by that tradition. You can personalize a digital Love Lock, keep a unique number and revisit it online.',
    independent:'Independent experience',independentText:'LoveLockParis is operated independently by PANORAMA GRUP. It is not a City of Paris service and does not claim municipal authorization or affiliation.',
    final:'Keep the meaning, without the metal.',finalSub:'Create a personalized digital Love Lock in less than a minute.'
  },
  fr:{
    nav:'Pont 3D',cta:'Créer notre cadenas',eyebrow:'L’histoire derrière la tradition',title:'Des cadenas physiques à un souvenir numérique.',
    sub:'Le Pont des Arts est devenu célèbre dans le monde entier pour ses cadenas d’amour. La tradition a transformé le pont, puis Paris a transformé ses rambardes. LoveLockParis conserve le geste romantique sous forme numérique.',
    t1:'Fin des années 2000',h1:'Les cadenas deviennent une image de Paris',d1:'Des couples commencent à accrocher des cadenas aux ponts pour symboliser leur relation. Le Pont des Arts devient l’un des lieux les plus associés à cette tradition.',
    t2:'2014',h2:'Le poids devient un vrai problème',d2:'Une partie de rambarde du Pont des Arts cède sous le poids accumulé des cadenas, mettant en évidence les problèmes de structure et d’entretien.',
    t3:'2015',h3:'Paris retire les cadenas',d3:'La ville retire les cadenas restants du Pont des Arts et remplace les rambardes par des panneaux qui ne permettent plus le même usage.',
    t4:'Aujourd’hui',h4:'Le geste romantique peut devenir numérique',d4:'LoveLockParis est une expérience numérique indépendante inspirée de cette tradition. Vous personnalisez un cadenas, obtenez un numéro unique et pouvez le retrouver en ligne.',
    independent:'Expérience indépendante',independentText:'LoveLockParis est exploité indépendamment par PANORAMA GRUP. Ce n’est pas un service de la Ville de Paris et nous ne revendiquons aucune affiliation municipale.',
    final:'Gardez le symbole, sans le métal.',finalSub:'Créez votre cadenas d’amour numérique personnalisé en moins d’une minute.'
  },
};

export default function AboutPage({ params }: { params: { locale: string } }) {
  const locale=params.locale;
  const t=copy[locale]||copy.en;
  const prefix=locale==='en'?'':`/${locale}`;

  const timeline=[
    [t.t1,t.h1,t.d1],
    [t.t2,t.h2,t.d2],
    [t.t3,t.h3,t.d3],
    [t.t4,t.h4,t.d4],
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header translations={{navBridge:t.nav,problemHeading:'',solutionHeading:'',ctaStart:t.cta}} />
      <main>
        <section className="relative flex min-h-[58vh] items-center overflow-hidden">
          <Image src="/images/about-history.jpg" alt="Pont des Arts Paris history" fill priority className="object-cover" sizes="100vw"/>
          <div className="absolute inset-0 bg-slate-950/70"/>
          <div className="relative mx-auto w-full max-w-6xl px-4 py-16 text-white">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-widest backdrop-blur"><Calendar className="h-4 w-4"/>{t.eyebrow}</p>
              <h1 className="mt-5 font-serif text-4xl font-bold leading-tight sm:text-6xl">{t.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-200">{t.sub}</p>
            </div>
          </div>
        </section>

        <section className="bg-[#fffdfc] py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <div className="space-y-5">
              {timeline.map(([date,title,desc],i)=>(
                <div key={date} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[150px_1fr] sm:p-8">
                  <div>
                    <span className="inline-flex rounded-full bg-rose-50 px-3 py-1 text-sm font-black text-[#e11d48]">{date}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
                    <p className="mt-3 leading-7 text-slate-600">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl border border-blue-100 bg-blue-50 p-6 sm:p-8">
              <div className="flex gap-4">
                <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-blue-600"/>
                <div><h2 className="text-xl font-bold text-blue-950">{t.independent}</h2><p className="mt-2 leading-7 text-blue-900/70">{t.independentText}</p></div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl rounded-[2.5rem] bg-slate-950 px-6 py-14 text-center text-white sm:px-12">
            <Heart className="mx-auto h-9 w-9 fill-rose-500 text-rose-500"/>
            <h2 className="mt-5 font-serif text-3xl font-bold sm:text-5xl">{t.final}</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-300">{t.finalSub}</p>
            <Link href={`${prefix}/purchase`} className="mt-7 inline-block">
              <Button className="h-14 rounded-full bg-[#e11d48] px-7 font-black text-white hover:bg-[#be123c]"><Sparkles className="mr-2 h-5 w-5"/>{t.cta}</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
