'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { calculateLockPrice, ZONE_PRICES, SKIN_PRICES, MEDIA_PRICES, CUSTOM_NUMBER_PRICE, PRIVATE_LOCK_PRICE } from '@/lib/pricing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Lock, ShieldCheck, CreditCard, Zap, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => { if (!user) router.push('/purchase'); }, 1000);

    const lockIdParam = searchParams.get('lock_id');
    const priceParam = searchParams.get('price');
    const typeParam = searchParams.get('type');
    const packageParam = searchParams.get('package');

    if (lockIdParam && priceParam) {
      // --- MODE DIRECT (Boost / Marketplace) ---
      setCheckoutData({
        type: typeParam || 'marketplace',
        lockId: parseInt(lockIdParam),
        price: parseFloat(priceParam),
        packageName: packageParam,
        zone: searchParams.get('zone') || 'Standard',
        skin: searchParams.get('skin') || 'Gold',
        contentText: typeParam === 'boost' ? `Boost Visibility` : `Purchase Lock #${lockIdParam}`
      });
      setIsPrivate(false);
    } else {
      // --- MODE STANDARD ---
      const data = sessionStorage.getItem('checkoutData');
      if (data) {
        try {
            const parsed = JSON.parse(data);
            setCheckoutData(parsed);
            // On récupère l'état initial, mais on laisse l'utilisateur le changer ici
            if (parsed.isPrivate) setIsPrivate(true);
        } catch (e) { console.error("Erreur data"); }
      }
    }
    return () => clearTimeout(timer);
  }, [searchParams, user, router]);

  // --- CALCUL DU PRIX CORRIGÉ ---
  const getFinalPrice = () => {
    if (!checkoutData) return 0;

    // 1. Boost ou Marketplace : Prix fixe, on ne touche à rien
    if (checkoutData.type === 'boost' || checkoutData.type === 'marketplace') {
      return checkoutData.price;
    }

    // 2. Nouveau Cadenas : On recalcule
    // calculateLockPrice inclut DEJA le prix de l'option privée (+5$) si isPrivate est true
    // Donc on ne rajoute RIEN manuellement.
    return calculateLockPrice(
      checkoutData.zone,
      checkoutData.skin,
      checkoutData.mediaType,
      checkoutData.customNumber,
      isPrivate
    );
  };

  const handleCheckout = async () => {
    if (!acceptTerms) return toast.error('Please accept terms');
    if (!user) return toast.error('Please login');
    
    setIsProcessing(true);
    const finalTotal = getFinalPrice();

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          ...checkoutData,
          isPrivate, // On envoie l'état final de la case cochée
          totalPrice: finalTotal,
          userId: user.id,
          userEmail: user.email
        }),
      });

      const result = await response.json();
      if (result.url) window.location.href = result.url;
      else throw new Error(result.error || "Payment Error");

    } catch (error: any) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  if (!checkoutData) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#e11d48]" /></div>;

  const displayPrice = getFinalPrice();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex gap-4 items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft size={20}/></Button>
          <h1 className="font-bold text-xl">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-4xl grid md:grid-cols-2 gap-8">
        
        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Item</span>
              <span className="font-bold uppercase text-emerald-600">
                {checkoutData.type === 'boost' ? '🚀 Boost' : checkoutData.type === 'marketplace' ? '💎 Asset' : '🔒 New Lock'}
              </span>
            </div>
            
            {/* Détail Prix Nouveau Cadenas */}
            {(!checkoutData.type || checkoutData.type === 'new_lock') && (
              <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded space-y-1">
                 <div className="flex justify-between"><span>Base ({checkoutData.zone})</span> <span>${ZONE_PRICES[checkoutData.zone as Zone]}</span></div>
                 {SKIN_PRICES[checkoutData.skin as Skin] > 0 && <div className="flex justify-between"><span>Skin ({checkoutData.skin})</span> <span>+${SKIN_PRICES[checkoutData.skin as Skin]}</span></div>}
                 
                 {/* Affichage conditionnel de l'option privée dans le résumé */}
                 {isPrivate && <div className="flex justify-between text-blue-600 font-bold"><span>Private Option</span> <span>+${PRIVATE_LOCK_PRICE}</span></div>}
              </div>
            )}

            <Separator />
            <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t">
              <span>Total Due</span>
              <span className="text-[#e11d48]">${displayPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            
            {/* Option Privée (Uniquement pour les nouveaux achats) */}
            {(!checkoutData.type || checkoutData.type === 'new_lock') && (
                <div 
                  className={`border-2 p-4 rounded-xl cursor-pointer transition-all ${isPrivate ? 'border-slate-800 bg-slate-100' : 'border-slate-100 hover:border-slate-300'}`}
                  onClick={() => setIsPrivate(!isPrivate)}
                >
                  <div className="flex gap-2 font-bold text-sm items-center"><ShieldCheck size={18}/> Private Lock (+${PRIVATE_LOCK_PRICE.toFixed(2)})</div>
                  <p className="text-xs text-slate-500 ml-7">Hidden from public view.</p>
                </div>
            )}

            <div className="flex gap-2 items-start">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(c) => setAcceptTerms(c as boolean)} className="mt-1"/>
              <label htmlFor="terms" className="text-xs cursor-pointer text-slate-500 leading-tight">
                I agree to the Terms. Digital item, no refund.
              </label>
            </div>

            <Button onClick={handleCheckout} disabled={!acceptTerms || isProcessing} className="w-full bg-[#e11d48] hover:bg-[#be123c] h-14 text-lg font-bold shadow-lg">
              {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <CreditCard className="mr-2"/>}
              Pay Securely
            </Button>
            
            <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest flex justify-center items-center gap-2">
                <Lock size={10}/> 256-Bit SSL Encrypted
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-600"/></div>}>
        <CheckoutContent />
      </Suspense>
    </AuthProvider>
  );
}
