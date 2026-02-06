'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { calculateLockPrice, ZONE_PRICES, SKIN_PRICES } from '@/lib/pricing';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, Lock, CreditCard, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ NEW: email invité (si pas connecté)
  const [guestEmail, setGuestEmail] = useState('');

  useEffect(() => {
    // ❌ SUPPRIMÉ: redirect automatique vers /purchase si pas connecté
    // (on veut permettre le checkout en invité)

    const lockIdParam = searchParams.get('lock_id');
    const priceParam = searchParams.get('price');
    const typeParam = searchParams.get('type');
    const packageParam = searchParams.get('package');

    if (lockIdParam && priceParam) {
      setCheckoutData({
        type: typeParam || 'marketplace',
        lockId: parseInt(lockIdParam),
        price: parseFloat(priceParam),
        packageName: packageParam,
        zone: searchParams.get('zone') || 'Standard',
        skin: searchParams.get('skin') || 'Gold',
        contentText: typeParam === 'boost' ? `Boost Visibility` : `Purchase Lock #${lockIdParam}`,
      });
      setIsPrivate(false);
    } else {
      const data = sessionStorage.getItem('checkoutData');
      if (data) {
        try {
          const parsed = JSON.parse(data);
          setCheckoutData(parsed);
          setIsPrivate(parsed.isPrivate || false);
        } catch (e) {
          console.error('Erreur data');
        }
      }
    }
  }, [searchParams]);

  // --- CALCUL DU PRIX CORRIGÉ (SANS OPTION PRIVÉE PAYANTE) ---
  const getFinalPrice = () => {
    if (!checkoutData) return 0;

    // 1. Boost ou Marketplace : Prix FIXE
    if (checkoutData.type === 'boost' || checkoutData.type === 'marketplace') {
      return checkoutData.price;
    }

    // 2. Nouveau Cadenas : On recalcule
    return calculateLockPrice(
      checkoutData.zone,
      checkoutData.skin,
      checkoutData.mediaType,
      checkoutData.customNumber,
      false // toujours false, option privée gratuite
    );
  };

  const handleCheckout = async () => {
    if (!acceptTerms) {
      toast.error('Please accept terms');
      return;
    }

    // ✅ NEW: si pas connecté, on exige juste l’email invité
    const emailToUse = user?.email || guestEmail?.trim();
    if (!emailToUse) {
      toast.error('Please enter your email');
      return;
    }

    setIsProcessing(true);
    const finalTotal = getFinalPrice();

    try {
      // Si connecté, on récupère access_token. Sinon on n’envoie pas Authorization.
      const { data: { session } } = await supabase.auth.getSession();

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...checkoutData,
          isPrivate, // on cache le media, gratuit
          totalPrice: finalTotal,
          userId: user?.id || null,        // ✅ invité => null
          userEmail: emailToUse,           // ✅ invité => guestEmail
        }),
      });

      const result = await response.json();
      if (result.url) window.location.href = result.url;
      else throw new Error(result.error || 'Payment Error');
    } catch (error: any) {
      toast.error(error.message);
      setIsProcessing(false);
    }
  };

  if (!checkoutData)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#e11d48]" />
      </div>
    );

  const displayPrice = getFinalPrice();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex gap-4 items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="font-bold text-xl">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-4xl grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Item</span>
              <span className="font-bold uppercase text-emerald-600">
                {checkoutData.type === 'boost'
                  ? '🚀 Boost'
                  : checkoutData.type === 'marketplace'
                  ? '💎 Asset'
                  : '🔒 New Lock'}
              </span>
            </div>

            {checkoutData.lockId && (
              <div className="flex justify-between text-sm text-slate-600">
                <span>Lock ID</span>
                <span className="font-mono font-bold">#{checkoutData.lockId}</span>
              </div>
            )}

            {(!checkoutData.type || checkoutData.type === 'new_lock') && (
              <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded space-y-1">
                <div className="flex justify-between">
                  <span>Base ({checkoutData.zone})</span>
                  <span>${ZONE_PRICES[checkoutData.zone as any]}</span>
                </div>

                {SKIN_PRICES[checkoutData.skin as any] > 0 && (
                  <div className="flex justify-between">
                    <span>Skin ({checkoutData.skin})</span>
                    <span>+${SKIN_PRICES[checkoutData.skin as any]}</span>
                  </div>
                )}

                {isPrivate && (
                  <div className="flex justify-between text-slate-600 font-bold">
                    <span>Private Media</span>
                    <span>Included</span>
                  </div>
                )}
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
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* ✅ NEW: Email invité si pas connecté */}
            {!user && (
              <div className="space-y-2">
                <div className="text-sm font-bold">Email</div>
                <input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full border rounded-lg px-3 py-3 text-sm"
                />
                <p className="text-[11px] text-slate-500">
                  On t’enverra le reçu + l’accès à ton cadenas.
                </p>
              </div>
            )}

            {/* Option Privée (Gratuite maintenant) */}
            {(!checkoutData.type || checkoutData.type === 'new_lock') && (
              <div
                className={`border-2 p-4 rounded-xl cursor-pointer transition-all ${
                  isPrivate ? 'border-slate-800 bg-slate-100' : 'border-slate-100 hover:border-slate-300'
                }`}
                onClick={() => setIsPrivate(!isPrivate)}
              >
                <div className="flex gap-2 font-bold text-sm items-center">
                  <EyeOff size={18} />
                  Hide Media Content (Free)
                </div>
                <p className="text-xs text-slate-500 ml-7 mt-1">
                  Your photo/video will be private. The lock stays visible on the bridge.
                </p>
              </div>
            )}

            <div className="flex gap-2 items-start">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(c) => setAcceptTerms(c as boolean)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-xs cursor-pointer text-slate-500 leading-tight">
                I agree to the Terms. Digital item, no refund.
              </label>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={!acceptTerms || isProcessing}
              className="w-full bg-[#e11d48] hover:bg-[#be123c] h-14 text-lg font-bold shadow-lg"
            >
              {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <CreditCard className="mr-2" />}
              Pay Securely
            </Button>

            <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest flex justify-center items-center gap-2">
              <Lock size={10} /> 256-Bit SSL Encrypted
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
      <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-rose-600" /></div>}>
        <CheckoutContent />
      </Suspense>
    </AuthProvider>
  );
}
