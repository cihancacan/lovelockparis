'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Trophy, Target, Clock, CheckCircle, Loader2, ArrowLeft, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type BoostPackage = {
  id: 'basic' | 'premium' | 'vip';
  title: string;
  price: number;
  duration: string;
  features: string[];
  color: string;
  borderColor: string;
  icon: any;
  badge: string;
};

const boostPackages: BoostPackage[] = [
  { 
    id: 'basic', 
    title: 'Basic Boost', 
    price: 19.99, 
    duration: '7 days', 
    features: ['Top 50 rotation', 'Basic badge', '2x Views'], 
    color: 'bg-blue-500',
    borderColor: 'border-blue-200',
    icon: Sparkles,
    badge: 'BOOSTED'
  },
  { 
    id: 'premium', 
    title: 'Premium Boost', 
    price: 49.99, 
    duration: '14 days', 
    features: ['Top 10 Fixed', 'Premium badge', 'Email highlight', '5x Views'], 
    color: 'bg-amber-500',
    borderColor: 'border-amber-200',
    icon: Crown,
    badge: 'PREMIUM'
  },
  { 
    id: 'vip', 
    title: 'VIP Featured', 
    price: 99.99, 
    duration: '30 days', 
    features: ['Homepage Feature', 'VIP Trophy badge', 'Social media blast', '10x Views'], 
    color: 'bg-purple-600',
    borderColor: 'border-purple-200',
    icon: Trophy,
    badge: 'VIP'
  }
];

const getSkinImage = (skin: string) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

function BoostPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'premium' | 'vip'>('basic');
  const [userLocks, setUserLocks] = useState<any[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pré-sélection depuis l'URL
    const paramLockId = searchParams.get('lock_id');
    if (paramLockId) setSelectedLockId(parseInt(paramLockId));
    
    if (user) loadUserLocks();
    else {
      // Si pas connecté, on redirige vers l'inscription avec l'intention de revenir
      router.push('/purchase');
    }
  }, [user, searchParams]);

  const loadUserLocks = async () => {
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .eq('owner_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserLocks(data || []);
      
      // Auto-select si pas déjà fait
      if (!selectedLockId && data && data.length > 0 && !searchParams.get('lock_id')) {
        setSelectedLockId(data[0].id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBoostPurchase = async () => {
    if (!user) return router.push('/purchase');
    if (!selectedLockId) return toast.error('Please select a lock to boost');

    const pkg = boostPackages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    // Redirection vers Checkout
    router.push(`/checkout?type=boost&lock_id=${selectedLockId}&package=${selectedPackage}&price=${pkg.price}`);
  };

  if(loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline"/></div>;

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Header */}
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-20">
        <div className="container mx-auto max-w-6xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg flex items-center gap-2"><Zap className="text-amber-500 fill-amber-500 h-4 w-4"/> Boost Visibility</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* COLONNE GAUCHE : CHOIX DU PACK (8 colonnes) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Choose a Package</h2>
              <p className="text-slate-500">Sell up to 5x faster with premium placement.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {boostPackages.map((pkg) => {
                const Icon = pkg.icon;
                const isSelected = selectedPackage === pkg.id;
                
                return (
                  <div 
                    key={pkg.id} 
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`
                      relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-200
                      ${isSelected ? `${pkg.borderColor} bg-white ring-2 ring-offset-2 ring-slate-900 shadow-xl transform -translate-y-2` : 'border-slate-100 bg-white hover:border-slate-300'}
                    `}
                  >
                    {isSelected && <div className="absolute top-3 right-3 text-emerald-500"><CheckCircle size={20}/></div>}
                    
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${pkg.color}`}>
                      <Icon size={24} />
                    </div>
                    
                    <h3 className="font-bold text-lg text-slate-900">{pkg.title}</h3>
                    <div className="text-3xl font-black text-slate-900 my-2">${pkg.price}</div>
                    <div className="text-sm font-medium text-slate-500 mb-4 bg-slate-50 inline-block px-2 py-1 rounded">{pkg.duration}</div>
                    
                    <ul className="space-y-2">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <CheckCircle size={12} className="text-emerald-500 mt-0.5 shrink-0"/> {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLONNE DROITE : SÉLECTION LOCK + PAYER (4 colonnes) */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24 border-0 shadow-2xl bg-slate-900 text-white">
              <CardContent className="p-6 space-y-6">
                
                <div>
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    Select Asset
                  </h3>
                  {userLocks.length === 0 ? (
                    <div className="text-center py-4 bg-white/5 rounded-lg text-sm text-slate-400">No locks found.</div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                      {userLocks.map(l => (
                        <div 
                          key={l.id} 
                          onClick={() => setSelectedLockId(l.id)}
                          className={`
                            relative cursor-pointer rounded-lg border p-1 transition-all
                            ${selectedLockId === l.id ? 'border-emerald-400 bg-emerald-500/20' : 'border-white/10 bg-white/5 hover:bg-white/10'}
                          `}
                        >
                          <div className="aspect-square relative mb-1">
                            <Image src={getSkinImage(l.skin)} alt="lock" fill className="object-contain"/>
                          </div>
                          <div className="text-[10px] text-center font-mono">#{l.id}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Package</span>
                    <span className="font-bold">{boostPackages.find(p => p.id === selectedPackage)?.title}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-emerald-400">${boostPackages.find(p => p.id === selectedPackage)?.price}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleBoostPurchase} 
                  className="w-full h-12 text-lg font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                >
                  Confirm & Pay
                </Button>
                
                <p className="text-center text-[10px] text-slate-500">
                   Secure payment via Stripe. Instant activation.
                </p>

              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function BoostPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>}>
      <BoostPageContent />
    </Suspense>
  );
}
