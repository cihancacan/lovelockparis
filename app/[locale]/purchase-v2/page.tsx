'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Lock, ArrowLeft, Check, Loader2, Sparkles, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Zone, Skin, calculateLockPrice } from '@/lib/pricing';

const zones: { id: Zone; title: string; desc: string }[] = [
  { id: 'Standard', title: 'Pont des Arts Center', desc: 'Classic digital spot on the bridge.' },
  { id: 'Premium_Eiffel', title: 'Eiffel Tower View', desc: 'Premium memory with Eiffel Tower feeling.' },
  { id: 'Sky_Balloon', title: 'Paris Sky Balloon', desc: 'A poetic floating memory above Paris.' },
];

const skins: { id: Skin; title: string; desc: string }[] = [
  { id: 'Iron', title: 'Classic', desc: 'Simple romantic lock.' },
  { id: 'Gold', title: 'Gold', desc: 'Warm premium finish.' },
  { id: 'Diamond', title: 'Diamond', desc: 'Luxury bright finish.' },
  { id: 'Ruby', title: 'Ruby', desc: 'Red romantic finish.' },
];

function PurchaseV2Content({ locale }: { locale: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const isFr = locale === 'fr';
  const [showAuth, setShowAuth] = useState(false);
  const [zone, setZone] = useState<Zone>('Standard');
  const [skin, setSkin] = useState<Skin>('Iron');
  const [names, setNames] = useState('');
  const [message, setMessage] = useState('');
  const [terms, setTerms] = useState(false);
  const [processing, setProcessing] = useState(false);

  const price = useMemo(() => calculateLockPrice(zone, skin, 'none', false, true), [zone, skin]);
  const displayNames = names.trim() || (isFr ? 'Julie & Thomas' : 'Julie & Thomas');
  const displayMessage = message.trim() || (isFr ? 'Pour toujours à Paris' : 'Forever in Paris');

  async function handlePay() {
    if (!names.trim()) return toast.error(isFr ? 'Ajoutez vos prénoms.' : 'Please add your names.');
    if (!message.trim()) return toast.error(isFr ? 'Ajoutez un message.' : 'Please add a message.');
    if (!terms) return toast.error(isFr ? 'Veuillez accepter les conditions.' : 'Please accept the terms.');
    if (!user) {
      setShowAuth(true);
      toast.message(isFr ? 'Votre cadenas est prêt. Connectez-vous pour le sauvegarder et payer.' : 'Your lock is ready. Sign in to save it and pay.');
      return;
    }

    setProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          zone,
          skin,
          contentText: message,
          authorName: names,
          mediaType: 'none',
          totalPrice: price,
          customNumber: false,
          selectedNumber: null,
          goldenAssetPrice: null,
          isPrivate: true,
          userId: user.id,
          userEmail: user.email,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else {
        toast.error(data.error || 'Payment error');
        setProcessing(false);
      }
    } catch (e) {
      toast.error(isFr ? 'Erreur de connexion.' : 'Connection error.');
      setProcessing(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="mr-2 h-4 w-4" /> {isFr ? 'Retour' : 'Back'}</Button>
          <div className="font-serif text-xl font-bold">LoveLock<span className="text-[#e11d48]">Paris</span></div>
          <div className="text-xs text-slate-500">{user ? user.email : isFr ? 'Aperçu libre' : 'Free preview'}</div>
        </div>
      </header>

      <main className="container mx-auto grid gap-8 px-4 py-8 lg:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
            <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-[#e11d48]">
              <Sparkles className="h-4 w-4" /> {isFr ? 'Créez d’abord, connectez-vous après' : 'Design first, sign in after'}
            </div>
            <h1 className="mt-4 text-3xl sm:text-5xl font-serif font-bold text-slate-950">
              {isFr ? 'Personnalisez votre cadenas d’amour' : 'Personalize your love lock'}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              {isFr ? 'Le visiteur peut maintenant créer son cadenas et voir l’aperçu avant la connexion. La connexion arrive seulement au moment de sauvegarder et payer.' : 'Visitors can now create the lock and see the preview before login. Sign-in only appears when saving and paying.'}
            </p>
          </div>

          <Card>
            <CardHeader><CardTitle>1. {isFr ? 'Choisissez l’emplacement' : 'Choose location'}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-3">
              {zones.map((z) => (
                <button key={z.id} onClick={() => setZone(z.id)} className={`rounded-2xl border p-4 text-left transition ${zone === z.id ? 'border-[#e11d48] bg-rose-50 ring-2 ring-rose-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between"><b>{z.title}</b>{zone === z.id && <Check className="h-4 w-4 text-[#e11d48]" />}</div>
                  <p className="mt-2 text-sm text-slate-500">{z.desc}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>2. {isFr ? 'Choisissez le style' : 'Choose style'}</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {skins.map((s) => (
                <button key={s.id} onClick={() => setSkin(s.id)} className={`rounded-2xl border p-4 text-left transition ${skin === s.id ? 'border-[#e11d48] bg-rose-50 ring-2 ring-rose-100' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-center justify-between"><b>{s.title}</b>{skin === s.id && <Check className="h-4 w-4 text-[#e11d48]" />}</div>
                  <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>3. {isFr ? 'Ajoutez vos prénoms et message' : 'Add names and message'}</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-bold text-slate-700">{isFr ? 'Prénoms ou initiales' : 'Names or initials'}</label>
                <Input value={names} onChange={(e) => setNames(e.target.value)} placeholder="Julie & Thomas" maxLength={50} className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-bold text-slate-700">{isFr ? 'Message' : 'Message'}</label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={isFr ? 'Pour toujours à Paris...' : 'Forever in Paris...'} maxLength={180} rows={3} className="mt-2" />
              </div>
              <label className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                <Checkbox checked={terms} onCheckedChange={(v) => setTerms(Boolean(v))} />
                <span>{isFr ? 'J’accepte les conditions et je comprends qu’il s’agit d’un souvenir digital.' : 'I accept the terms and understand this is a digital memory.'}</span>
              </label>
            </CardContent>
          </Card>
        </section>

        <aside className="lg:sticky lg:top-24 h-fit space-y-4">
          <Card className="overflow-hidden shadow-xl">
            <CardHeader className="bg-slate-950 text-white"><CardTitle>{isFr ? 'Aperçu de votre cadenas' : 'Your lock preview'}</CardTitle></CardHeader>
            <CardContent className="p-5">
              <div className="rounded-[1.75rem] border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-slate-50 p-6 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#e11d48] text-white shadow-xl rotate-[-6deg]"><Heart className="h-10 w-10 fill-white" /></div>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.3em] text-slate-400">Pont des Arts • Paris</p>
                <h2 className="mt-3 break-words font-serif text-3xl font-bold text-slate-950">{displayNames}</h2>
                <p className="mt-3 break-words rounded-2xl bg-white px-4 py-3 text-sm italic text-slate-600 shadow-sm">{displayMessage}</p>
                <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500"><span className="rounded-full bg-white px-3 py-2">{zone.replace('_', ' ')}</span><span className="rounded-full bg-white px-3 py-2">{skin}</span></div>
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-slate-200 pt-5">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-3xl font-bold text-[#e11d48]">${price.toFixed(2)}</span>
              </div>
              <Button onClick={handlePay} disabled={processing} className="mt-5 w-full rounded-full bg-[#e11d48] py-6 text-lg font-bold text-white hover:bg-[#be123c]">
                {processing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</> : <><CreditCard className="mr-2 h-5 w-5" /> {user ? (isFr ? 'Payer maintenant' : 'Pay now') : (isFr ? 'Sauvegarder et payer' : 'Save and pay')}</>}
              </Button>
              {!user && <p className="mt-3 text-center text-xs text-slate-500">{isFr ? 'Connexion uniquement après l’aperçu.' : 'Sign-in only after preview.'}</p>}
            </CardContent>
          </Card>
        </aside>
      </main>
      <AuthDialog open={showAuth} onOpenChange={setShowAuth} />
    </div>
  );
}

export default function PurchaseV2({ params }: { params: { locale: string } }) {
  return <AuthProvider><PurchaseV2Content locale={params.locale || 'en'} /></AuthProvider>;
}
