'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
// Assure-toi que ces imports pointent vers ton fichier pricing existant
import { Zone, Skin, MediaType, calculateLockPrice, ZONE_PRICES, SKIN_PRICES, MEDIA_PRICES, CUSTOM_NUMBER_PRICE, PRIVATE_LOCK_PRICE } from '@/lib/pricing';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Loader2, CreditCard, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutData {
  zone: Zone;
  skin: Skin;
  contentText: string;
  authorName: string;
  mediaUrl: string | null;
  mediaType: MediaType;
  customNumber: boolean;
  selectedNumber: number | null;
}

function CheckoutPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 1. Charger les données
  useEffect(() => {
    // Petit délai pour laisser AuthContext charger
    const timer = setTimeout(() => {
      if (!user) router.push('/purchase');
    }, 1000);

    const data = sessionStorage.getItem('checkoutData');
    if (data) {
      try {
        setCheckoutData(JSON.parse(data));
      } catch (e) {
        console.error("Erreur parsing data");
      }
    }
    return () => clearTimeout(timer);
  }, [user, router]);

  // 2. Gestion du clic Payer
  const handleCheckout = async () => {
    if (!acceptTerms) {
      toast.error('You must accept the Terms of Service');
      return;
    }
    if (!checkoutData) return;

    setIsProcessing(true);

    try {
      const totalPrice = calculateLockPrice(
        checkoutData.zone,
        checkoutData.skin,
        checkoutData.mediaType,
        checkoutData.customNumber,
        isPrivate
      );

      // Récupérer la session pour le token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired. Please log in again.');
        setIsProcessing(false);
        return;
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
          totalPrice,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Erreur serveur');
      }

      if (result.url) {
        window.location.href = result.url;
      } else {
        throw new Error("Pas d'URL reçue de Stripe");
      }

    } catch (error: any) {
      console.error('Erreur Paiement:', error);
      toast.error(error.message || 'Payment Failed');
      setIsProcessing(false);
    }
  };

  if (!checkoutData) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  const totalPrice = calculateLockPrice(
    checkoutData.zone, checkoutData.skin, checkoutData.mediaType, checkoutData.customNumber, isPrivate
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="container mx-auto flex gap-4 items-center">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft size={20}/></Button>
          <h1 className="font-bold text-xl">Checkout</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 py-8 max-w-4xl grid md:grid-cols-2 gap-8">
        {/* RECAP */}
        <Card>
          <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between"><span>Zone</span><span className="font-bold">{checkoutData.zone}</span></div>
            <div className="flex justify-between"><span>Skin</span><span className="font-bold">{checkoutData.skin}</span></div>
            <Separator />
            <div className="bg-slate-100 p-3 rounded italic text-sm text-slate-600">"{checkoutData.contentText}"</div>
            <div className="flex justify-between items-center text-xl font-bold mt-4">
              <span>Total</span>
              <span className="text-[#e11d48]">${totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        {/* PAIEMENT */}
        <Card>
          <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div 
              className={`border-2 p-4 rounded-xl cursor-pointer ${isPrivate ? 'border-slate-800 bg-slate-100' : 'border-slate-100'}`}
              onClick={() => setIsPrivate(!isPrivate)}
            >
              <div className="flex gap-2 font-bold"><ShieldCheck size={20}/> Private Lock (+${PRIVATE_LOCK_PRICE})</div>
              <p className="text-xs text-slate-500 ml-7">Only visible to you.</p>
            </div>

            <div className="flex gap-2 items-start">
              <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(c) => setAcceptTerms(c as boolean)} />
              <label htmlFor="terms" className="text-xs cursor-pointer">I agree to the Terms. I understand this is a digital item.</label>
            </div>

            <Button onClick={handleCheckout} disabled={!acceptTerms || isProcessing} className="w-full bg-[#e11d48] hover:bg-[#be123c] h-14 text-lg font-bold">
              {isProcessing ? <Loader2 className="animate-spin mr-2"/> : <CreditCard className="mr-2"/>}
              Pay Securely
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <AuthProvider>
      <CheckoutPageContent />
    </AuthProvider>
  );
}