import Link from 'next/link';
import { ArrowLeft, CheckCircle, Heart, Mail, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const copy: Record<string, any> = {
  en:{
    back:'Back',title:'Refund & purchase support',intro:'LoveLockParis is a personalized digital product. We want the purchase to be clear and the product to be delivered as expected.',
    heading:'When we will help with a refund',items:['You were charged twice for the same order.','A technical problem prevented us from delivering or activating the purchased service.','A payment was made without your authorization, subject to verification.','A refund is required under applicable consumer law.'],
    digital:'Personalized digital purchases',digitalText:'Because a Love Lock is personalized and created digitally after payment, change-of-mind refunds can be limited once delivery has started. This does not affect any mandatory rights you may have under applicable law.',
    contact:'Need help?',contactText:'Contact us with the payment email and, if available, your lock number. We will review the issue and reply as quickly as possible.',
    email:'Email support',note:'Before filing a payment dispute, contacting support first is usually the fastest way for us to investigate a technical or billing problem.'
  },
  fr:{
    back:'Retour',title:'Remboursements & assistance achat',intro:'LoveLockParis est un produit numérique personnalisé. Nous voulons que l’achat soit clair et que le produit soit délivré comme prévu.',
    heading:'Dans quels cas nous pouvons rembourser',items:['Vous avez été débité deux fois pour la même commande.','Un problème technique nous a empêchés de délivrer ou d’activer le service acheté.','Un paiement a été effectué sans votre autorisation, sous réserve de vérification.','Un remboursement est imposé par le droit de la consommation applicable.'],
    digital:'Achats numériques personnalisés',digitalText:'Comme un cadenas LoveLockParis est personnalisé et créé numériquement après le paiement, les remboursements pour simple changement d’avis peuvent être limités une fois la livraison commencée. Cela ne réduit pas les droits obligatoires dont vous pouvez bénéficier selon la loi applicable.',
    contact:'Besoin d’aide ?',contactText:'Contactez-nous avec l’adresse e-mail utilisée pour le paiement et, si possible, le numéro du cadenas. Nous examinerons le problème rapidement.',
    email:'Contacter le support',note:'Avant d’ouvrir un litige de paiement, contacter notre support est généralement le moyen le plus rapide pour résoudre un problème technique ou de facturation.'
  }
};

export default function RefundPage({params}:{params:{locale:string}}){
  const locale=params.locale;
  const t=copy[locale]||copy.en;
  const prefix=locale==='en'?'':'/'+locale;
  return (
    <div className="min-h-screen bg-[#fffdfc] px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link href={prefix||'/'}><Button variant="ghost" className="mb-6"><ArrowLeft className="mr-2 h-4 w-4"/>{t.back}</Button></Link>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50"><Heart className="h-6 w-6 fill-[#e11d48] text-[#e11d48]"/></div>
          <h1 className="mt-5 font-serif text-3xl font-bold sm:text-4xl">{t.title}</h1>
          <p className="mt-4 leading-7 text-slate-600">{t.intro}</p>

          <section className="mt-9">
            <h2 className="text-xl font-bold">{t.heading}</h2>
            <div className="mt-4 space-y-3">
              {t.items.map((item:string)=><div key={item} className="flex gap-3 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950"><CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"/>{item}</div>)}
            </div>
          </section>

          <section className="mt-9 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-slate-500"/><div><h2 className="font-bold">{t.digital}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{t.digitalText}</p></div></div>
          </section>

          <section className="mt-9">
            <h2 className="text-xl font-bold">{t.contact}</h2>
            <p className="mt-2 leading-7 text-slate-600">{t.contactText}</p>
            <a href="mailto:support@lovelockparis.com" className="mt-5 inline-flex h-12 items-center rounded-full bg-[#e11d48] px-5 font-bold text-white hover:bg-[#be123c]"><Mail className="mr-2 h-4 w-4"/>{t.email}</a>
            <p className="mt-5 text-xs leading-5 text-slate-400">{t.note}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
