'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Trophy, Target, Clock, CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

type BoostPackage = {
  id: 'basic' | 'premium' | 'vip';
  title: string;
  price: number;
  duration: number;
  features: string[];
  color: string;
  badge: string;
};

const boostPackages: BoostPackage[] = [
  {
    id: 'basic',
    title: 'Basic Boost',
    price: 19.99,
    duration: 7,
    features: ['7 days featured', 'Top 50 rotation', 'Basic badge'],
    color: 'from-blue-500 to-cyan-500',
    badge: 'BOOSTED'
  },
  {
    id: 'premium',
    title: 'Premium Boost',
    price: 49.99,
    duration: 14,
    features: ['14 days featured', 'Top 10 Fixed', 'Premium badge', 'Email highlight'],
    color: 'from-amber-500 to-orange-500',
    badge: 'PREMIUM'
  },
  {
    id: 'vip',
    title: 'VIP Featured',
    price: 99.99,
    duration: 30,
    features: ['30 days VIP spot', 'Homepage Feature', 'VIP Trophy badge', 'Social media blast'],
    color: 'from-purple-600 to-pink-600',
    badge: 'VIP'
  }
];

function BoostPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [selectedPackage, setSelectedPackage] = useState<'basic' | 'premium' | 'vip'>('basic');
  const [userLocks, setUserLocks] = useState<any[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Si on vient de la page Sell, on pré-sélectionne le lock
    const paramLockId = searchParams.get('lock_id');
    if (paramLockId) setSelectedLockId(parseInt(paramLockId));
    
    if (user) loadUserLocks();
  }, [user, searchParams]);

  const loadUserLocks = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('id, content_text, resale_price, views_count, status')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserLocks(data || []);
      
      // Si aucun lock n'est sélectionné et qu'on a des locks, on prend le premier
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
    if (!user) { router.push('/purchase'); return; }
    if (!selectedLockId) { toast.error('Select a lock'); return; }

    const pkg = boostPackages.find(p => p.id === selectedPackage);
    if (!pkg) return;

    // Redirection vers Checkout en mode Boost
    // Le fichier checkout/page.tsx devra gérer le type "boost"
    router.push(`/checkout?type=boost&lock_id=${selectedLockId}&package=${selectedPackage}&price=${pkg.price}`);
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin inline"/> Loading...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2">Boost Your Lock</h1>
        <p className="text-center text-slate-500 mb-10">Get more views and sell faster.</p>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Gauche : Packages */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-bold text-xl">1. Choose a Package</h2>
            <div className="grid gap-4">
              {boostPackages.map((pkg) => (
                <div 
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage === pkg.id ? 'border-emerald-500 bg-white shadow-lg' : 'border-slate-200 bg-slate-50 hover:bg-white'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <Badge className={`bg-gradient-to-r ${pkg.color}`}>{pkg.badge}</Badge>
                      <span className="font-bold text-lg">{pkg.title}</span>
                    </div>
                    <span className="text-2xl font-bold">${pkg.price}</span>
                  </div>
                  <div className="flex gap-4 text-sm text-slate-500 mb-4">
                    <span className="flex items-center gap-1"><Clock size={14}/> {pkg.duration} days</span>
                    <span className="flex items-center gap-1"><Target size={14}/> {pkg.features[1]}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {pkg.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                        <CheckCircle size={14} className="text-emerald-500"/> {f}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h2 className="font-bold text-xl mt-8">2. Select Lock</h2>
            <div className="grid grid-cols-2 gap-4">
              {userLocks.map(lock => (
                <div 
                  key={lock.id} 
                  onClick={() => setSelectedLockId(lock.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${selectedLockId === lock.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white'}`}
                >
                  <div className="font-bold">Lock #{lock.id}</div>
                  <div className="text-xs text-slate-500">{lock.status === 'For_Sale' ? `On Sale: $${lock.resale_price}` : 'Not for sale'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Droite : Résumé */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-emerald-100">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">Summary</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Package</span>
                    <span className="font-bold capitalize">{selectedPackage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lock ID</span>
                    <span className="font-mono">{selectedLockId ? `#${selectedLockId}` : '-'}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t text-lg font-bold">
                    <span>Total</span>
                    <span>${boostPackages.find(p => p.id === selectedPackage)?.price}</span>
                  </div>
                  <Button onClick={handleBoostPurchase} className="w-full bg-emerald-600 hover:bg-emerald-700 mt-4 h-12 text-lg">
                    Pay & Boost 🚀
                  </Button>
                </div>
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
