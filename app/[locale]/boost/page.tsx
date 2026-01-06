'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Crown, Trophy, Clock, CheckCircle, Loader2, ArrowLeft, Zap, Lock, LogIn } from 'lucide-react';
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
  { id: 'basic', title: 'Basic', price: 19.99, duration: '7 days', color: 'bg-blue-500', borderColor: 'border-blue-200', icon: Sparkles, badge: 'BOOSTED', features: ['Top 50 rotation', 'Basic badge', '2x Views'] },
  { id: 'premium', title: 'Premium', price: 49.99, duration: '14 days', color: 'bg-amber-500', borderColor: 'border-amber-200', icon: Crown, badge: 'PREMIUM', features: ['Top 10 Fixed', 'Premium badge', '5x Views'] },
  { id: 'vip', title: 'VIP', price: 99.99, duration: '30 days', color: 'bg-purple-600', borderColor: 'border-purple-200', icon: Trophy, badge: 'VIP', features: ['Homepage Feature', 'VIP Trophy', '10x Views'] }
];

const getSkinImage = (skin: string | null) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

function BoostPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [selectedPackage, setSelectedPackage] = useState<any>('basic');
  const [userLocks, setUserLocks] = useState<any[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const paramLockId = searchParams.get('lock_id');
    if (paramLockId) setSelectedLockId(parseInt(paramLockId));
    
    if (user) {
        setLoading(true);
        supabase.from('locks').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
            .then(({ data }) => {
                setUserLocks(data || []);
                if (!selectedLockId && data && data.length > 0 && !paramLockId) setSelectedLockId(data[0].id);
                setLoading(false);
            });
    }
  }, [user, searchParams]);

  const handleBoostPurchase = async () => {
    if (!user) {
        router.push('/purchase');
        return;
    }
    if (!selectedLockId) return toast.error('Select a lock to boost');

    const pkg = boostPackages.find(p => p.id === selectedPackage);
    router.push(`/checkout?type=boost&lock_id=${selectedLockId}&package=${selectedPackage}&price=${pkg?.price}`);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      <div className="bg-white border-b px-4 py-4 sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto max-w-6xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5"/></Button>
          <h1 className="font-bold text-lg flex items-center gap-2"><Zap className="text-amber-500 fill-amber-500 h-4 w-4"/> Boost Visibility</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. Packages (Toujours visible) */}
            <div>
                <h2 className="font-bold text-xl mb-4">1. Choose Package</h2>
                <div className="grid gap-4">
                {boostPackages.map((pkg) => {
                    const Icon = pkg.icon;
                    return (
                    <div key={pkg.id} onClick={() => setSelectedPackage(pkg.id)} className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedPackage === pkg.id ? `${pkg.borderColor} bg-white shadow-lg ring-1` : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                        {selectedPackage === pkg.id && <div className="absolute top-3 right-3 text-emerald-500"><CheckCircle size={20}/></div>}
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${pkg.color}`}><Icon size={24} /></div>
                            <div><h3 className="font-bold text-lg">{pkg.title}</h3><div className="text-sm text-slate-500">{pkg.duration} visibility</div></div>
                            <div className="ml-auto text-2xl font-bold">${pkg.price}</div>
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>

            {/* 2. Select Lock (Conditionnel) */}
            <div>
                <h2 className="font-bold text-xl mb-4">2. Select Lock</h2>
                
                {!user ? (
                    // --- NON CONNECTÉ ---
                    <div className="p-8 bg-white border-2 border-dashed border-slate-200 rounded-xl text-center">
                        <Lock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 mb-4 font-medium">You must be logged in to select a lock.</p>
                        <Button onClick={() => router.push('/purchase')} className="bg-slate-900 text-white">
                           <LogIn className="mr-2 h-4 w-4"/> Login / Register
                        </Button>
                    </div>
                ) : userLocks.length === 0 ? (
                    // --- PAS DE CADENAS ---
                    <div className="text-center p-8 bg-slate-100 rounded-xl">No locks found. <br/><Button variant="link" onClick={() => router.push('/purchase')}>Buy one first</Button></div>
                ) : (
                    // --- CONNECTÉ AVEC CADENAS ---
                    <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2">
                    {userLocks.map(l => (
                        <div key={l.id} onClick={() => setSelectedLockId(l.id)} className={`relative border-2 rounded-xl p-2 text-center cursor-pointer transition-all ${selectedLockId === l.id ? 'border-amber-500 bg-amber-50 ring-1 ring-amber-200' : 'border-slate-100 bg-white hover:border-slate-300'}`}>
                        {selectedLockId === l.id && <div className="absolute top-1 right-1 bg-amber-500 text-white rounded-full p-0.5"><CheckCircle size={10}/></div>}
                        <div className="relative w-full aspect-square mb-1"><Image src={getSkinImage(l.skin)} alt="lock" fill className="object-contain"/></div>
                        <div className="font-bold text-xs">#{l.id}</div>
                        </div>
                    ))}
                    </div>
                )}
            </div>
          </div>

          {/* Résumé */}
          <div>
            <Card className="sticky top-24 shadow-xl border-amber-100">
              <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">Summary</h3>
                <div className="flex justify-between text-sm"><span>Package</span><span className="font-bold capitalize">{selectedPackage}</span></div>
                <div className="flex justify-between text-sm"><span>Lock</span><span className="font-mono">{selectedLockId ? `#${selectedLockId}` : '-'}</span></div>
                <div className="flex justify-between pt-4 border-t text-xl font-bold"><span>Total</span><span className="text-emerald-600">${boostPackages.find(p => p.id === selectedPackage)?.price}</span></div>
                
                <Button onClick={handleBoostPurchase} className="w-full bg-emerald-600 hover:bg-emerald-700 h-12 text-lg font-bold">
                   {user ? 'Pay & Boost 🚀' : 'Login to Boost'}
                </Button>
              </CardContent>
            </Card>
          </div>
      </div>
    </div>
  );
}

export default function BoostPage() { return <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>}><BoostPageContent /></Suspense>; }
