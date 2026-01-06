'use client';

// Force le rendu dynamique pour éviter les erreurs de build Vercel sur les searchParams
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { calculateLockPrice, ZONE_PRICES, SKIN_PRICES, MEDIA_PRICES, CUSTOM_NUMBER_PRICE, PRIVATE_LOCK_PRICE } from '@/lib/pricing';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
    // 1. Vérifier si l'utilisateur est connecté (sinon redirection)
    const timer = setTimeout(() => {
      if (!user) router.push('/purchase');
    }, 1000);

    // 2. Détecter le mode d'achat (URL vs Session)
    const lockIdParam = searchParams.get('lock_id');
    const priceParam = searchParams.get('price');
    const typeParam = searchParams.get('type'); // 'marketplace' | 'boost'
    const packageParam = searchParams.get('package');

    if (lockIdParam && priceParam) {
      // --- CAS A : ACHAT DIRECT (Marketplace ou Boost) ---
      setCheckoutData({
        type: typeParam || 'marketplace',
        lockId: parseInt(lockIdParam),
        price: parseFloat(priceParam),
        packageName: packageParam,
        // Valeurs par défaut pour l'affichage (récupérées idéalement depuis la DB, mais on simplifie pour l'UI)
        zone: 'Standard', 
        skin: 'Gold',
        contentText: typeParam === 'boost' ? `Boost Visibility (${packageParam})` : `Marketplace Purchase #${lockIdParam}`
      });
    } else {
      // --- CAS B : ACHAT CLASSIQUE (Depuis /purchase) ---
      const data = sessionStorage.getItem('checkoutData');
      if (data) {
        try {
          setCheckoutData(JSON.parse(data));
        } catch (e) {
          console.error("Erreur parsing data");
        }
      }
    }

    return () => clearTimeout(timer);
  }, [user, router, searchParams]);

  const handleCheckout = async () => {
    if (!acceptTerms) {
      toast.error('You must accept the Terms of Service');
      return;
    }
    if (!checkoutData) return;

    setIsProcessing(true);

    try {
      // Récupérer la session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired. Please log in again.');
        setIsProcessing(false);
        return;
      }

      // Calcul du prix final
      // Si c'est un boost/marketplace, le prix est fixe. Sinon on le recalcule.
      let finalPrice = checkoutData.price;
      
      if (!checkoutData.type || checkoutData.type === 'standard') {
         finalPrice = calculateLockPrice(
          checkoutData.zone,
          checkoutData.skin,
          checkoutData.mediaType,
          checkoutData.customNumber,
          isPrivate
        );
      }
      
      // Ajout du prix de l'option privée si coché
      if (isPrivate && checkoutData.type !== 'boost') {
         finalPrice += PRIVATE_LOCK_PRICE;
      }

      // APPEL API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ...checkoutData,
          isPrivate,
          totalPrice: finalPrice, // Prix final envoyé à Stripe
          userId: user?.id, // ID forcé pour sécurité
          userEmail: user?.email
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Payment initialization failed');
      }

      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("No payment URL received");
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'Payment Error');
      setIsProcessing(false);
    }
  };

  if (!checkoutData) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-[#e11d48]" /></div>;

  // Calcul du total pour l'affichage
  let displayPrice = checkoutData.price;
  if (!checkoutData.type) {
     displayPrice = calculateLockPrice(checkoutData.zone, checkoutData.skin, checkoutData.mediaType, checkoutData.customNumber, isPrivate);
  } else if (isPrivate && checkoutData.type !== 'boost') {
     displayPrice += PRIVATE_LOCK_PRICE;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex gap-4 items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft size={20}/></Button>
          <h1 className="font-bold text-xl">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-4xl grid md:grid-cols-2 gap-8">
        
        {/* RECAPITULATIF */}
        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            
            {/* Affichage conditionnel selon le type d'achat */}
            {checkoutData.type === 'boost' ? (
               <div className="flex items-center gap-3 bg-amber-50 p-3 rounded-lg border border-amber-100">
                  <Zap className="text-amber-500 h-8 w-8"/>
                  <div>
                    <div className="font-bold text-amber-900">Boost Visibility</div>
                    <div className="text-xs text-amber-700 uppercase">{checkoutData.packageName} Package</div>
                  </div>
               </div>
            ) : checkoutData.type === 'marketplace' ? (
               <div className="flex items-center gap-3 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                  <ShoppingCart className="text-emerald-500 h-8 w-8"/>
                  <div>
                    <div className="font-bold text-emerald-900">Marketplace Asset</div>
                    <div className="text-xs text-emerald-700">Buying from User</div>
                  </div>
               </div>
            ) : (
               <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <Lock className="text-slate-500 h-8 w-8"/>
                  <div>
                    <div className="font-bold text-slate-900">New Digital Lock</div>
                    <div className="text-xs text-slate-500">{checkoutData.zone} • {checkoutData.skin}</div>
                  </div>
               </div>
            )}

            <Separator />
            
            {checkoutData.lockId && (
                <div className="flex justify-between text-sm">
                    <span>Lock ID</span>
                    <span className="font-mono font-bold">#{checkoutData.lockId}</span>
                </div>
            )}

            <div className="flex justify-between items-center text-xl font-bold mt-4 pt-4 border-t">
              <span>Total Due</span>
              <span className="text-[#e11d48]">${displayPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* PAIEMENT */}
        <Card>
          <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            
            {/* Option Privée (Seulement pour les cadenas, pas les boosts) */}
            {checkoutData.type !== 'boost' && (
                <div 
                className={`border-2 p-4 rounded-xl cursor-pointer transition-all ${isPrivate ? 'border-slate-800 bg-slate-100' : 'border-slate-100 hover:border-slate-300'}`}
                onClick={() => setIsPrivate(!isPrivate)}
                >
                <div className="flex gap-2 font-bold text-sm items-center"><ShieldCheck size={18}/> Private Lock (+${PRIVATE_LOCK_PRICE})</div>
                <p className="text-xs text-slate-500 ml-7">Hidden from public view.</p>
                </div>
            )}

            <div className="flex gap-2 items-start">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(c) => setAcceptTerms(c as boolean)} className="mt-1"/>
              <label htmlFor="terms" className="text-xs cursor-pointer text-slate-500 leading-tight">
                I agree to the Terms of Service. I understand this is a digital item (NFT/Database entry) and sales are final.
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
