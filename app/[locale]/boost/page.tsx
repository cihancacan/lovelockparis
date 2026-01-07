'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// CORRECTION ICI : 'Rocket' est bien ajouté
import { Sparkles, Crown, Trophy, Clock, CheckCircle, Loader2, ArrowLeft, Zap, Lock, LogIn, Rocket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

// --- PACKAGES ---
const boostPackages = [
  { 
    id: 'basic', 
    title: 'Quick Spark', 
    price: 14.99, 
    duration: '5 Days', 
    views: '3x', 
    color: 'from-blue-500 to-cyan-400', 
    border: 'border-cyan-500', 
    icon: Zap, 
    features: ['Top 50 Rotation', 'Blue Badge'] 
  },
  { 
    id: 'premium', 
    title: 'Market Heat', 
    price: 29.99, 
    duration: '10 Days', 
    views: '10x', 
    color: 'from-orange-500 to-red-500', 
    border: 'border-orange-500', 
    icon: Sparkles, 
    popular: true, 
    features: ['Top 20 Fixed', 'Fire Badge', 'Emailing'] 
  },
  { 
    id: 'vip', 
    title: 'Diamond Domination', 
    price: 59.99, 
    duration: '15 Days', 
    views: '25x', 
    color: 'from-purple-600 to-pink-500', 
    border: 'border-purple-500', 
    icon: Trophy, 
    features: ['Homepage Cover', 'Golden Border', 'Top 3 Guarantee'] 
  }
];

const getSkinImage = (skin: string | null) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

function BoostPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  
  const [selectedPackage, setSelectedPackage] = useState<any>('premium');
  const [userLocks, setUserLocks] = useState<any[]>([]);
  const [selectedLockId, setSelectedLockId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paramLockId = searchParams.get('lock_id');
    if (paramLockId) setSelectedLockId(parseInt(paramLockId));
    
    if (user) {
        setLoading(true);
        // CORRECTION ICI : Filtrage des cadenas actifs seulement
        supabase.from('locks')
            .select('*')
            .eq('owner_id', user.id)
            .eq('status', 'Active') // <--- ICI
            .order('created_at', { ascending: false })
            .then(({ data }) => {
                setUserLocks(data || []);
                if (!selectedLockId && data && data.length > 0 && !paramLockId) {
                    setSelectedLockId(data[0].id);
                }
                setLoading(false);
            });
    } else {
        setLoading(false);
    }
  }, [user, searchParams]);

  const handleBoostPurchase = async () => {
    if (!user) return router.push('/purchase');
    if (!selectedLockId) return toast.error('Please select a lock to boost');

    const pkg = boostPackages.find(p => p.id === selectedPackage);
    const lock = userLocks.find(l => l.id === selectedLockId);

    // Sécurité supplémentaire
    if (!lock) return toast.error('Lock not found or not active');

    router.push(`/checkout?type=boost&lock_id=${selectedLockId}&package=${selectedPackage}&price=${pkg?.price}&zone=${lock.zone || 'Standard'}&skin=${lock.skin || 'Gold'}`);
  };

  const activePackage = boostPackages.find(p => p.id === selectedPackage);
  const activeLock = userLocks.find(l => l.id === selectedLockId);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-white"/></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <div className="bg-slate-900/50 backdrop-blur border-b border-slate-800 px-4 py-4 sticky top-0 z-30">
        <div className="container mx-auto max-w-6xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg flex items-center gap-2">
            <Rocket className="text-purple-500 fill-purple-500 h-5 w-5"/> Boost Center
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-10">
            <div>
               <h3 className="font-bold text-xl mb-6 flex items-center gap-2"><span className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-slate-700">1</span> Choose Power Level</h3>
               <div className="space-y-4">
                 {boostPackages.map((pkg) => {
                   const Icon = pkg.icon;
                   const isSelected = selectedPackage === pkg.id;
                   return (
                     <div key={pkg.id} onClick={() => setSelectedPackage(pkg.id)} className={`relative flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? `${pkg.border} bg-slate-800/80 shadow-lg scale-[1.02]` : 'border-slate-800 bg-slate-800/30 hover:border-slate-600'}`}>
                       {pkg.popular && <div className="absolute -top-3 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">BEST SELLER</div>}
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${pkg.color} shadow-lg shrink-0`}><Icon size={28} className="text-white" /></div>
                       <div className="flex-1">
                         <div className="flex items-center gap-2 mb-1"><h4 className="font-bold text-lg">{pkg.title}</h4><Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">{pkg.duration}</Badge></div>
                         <div className="text-sm text-slate-400">{pkg.features.join(' • ')}</div>
                       </div>
                       <div className="text-right shrink-0"><div className="text-2xl font-black">${pkg.price}</div><div className={`text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r ${pkg.color}`}>{pkg.views} Views</div></div>
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600'}`}>{isSelected && <CheckCircle size={16} className="text-black"/>}</div>
                     </div>
                   );
                 })}
               </div>
            </div>

            <div>
               <h3 className="font-bold text-xl mb-4 flex items-center gap-2"><span className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-slate-700">2</span> Select Asset</h3>
               {!user ? (
                 <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center"><Button onClick={() => router.push('/purchase')} variant="outline">Login to Continue</Button></div>
               ) : userLocks.length === 0 ? (
                 <div className="text-center py-6 text-slate-500">You don't have any active locks. <br/><Button variant="link" className="text-emerald-500" onClick={() => router.push('/purchase')}>Buy one now</Button></div>
               ) : (
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                   {userLocks.map(l => (
                     <div key={l.id} onClick={() => setSelectedLockId(l.id)} className={`relative p-2 rounded-xl border-2 cursor-pointer transition-all bg-slate-800 ${selectedLockId === l.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-700 hover:border-slate-600'}`}>
                        {selectedLockId === l.id && <div className="absolute top-1 right-1 bg-emerald-500 text-black rounded-full p-0.5 z-10"><CheckCircle size={10}/></div>}
                        <div className="relative w-full aspect-square mb-1"><Image src={getSkinImage(l.skin)} alt="lock" fill className="object-contain"/></div>
                        <div className="text-center font-mono font-bold text-[10px] text-slate-300">#{l.id}</div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
          </div>

          <div className="lg:col-span-5">
             <div className="sticky top-24">
                <Card className="bg-slate-900 border-slate-800 relative overflow-hidden mb-6">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${activePackage?.color}`}></div>
                  <CardContent className="p-6">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider flex justify-between"><span>Preview</span><span className="text-emerald-400">+{activePackage?.views} Traffic</span></h3>
                    <div className={`bg-white rounded-xl p-4 border-2 shadow-2xl relative overflow-hidden ${activePackage?.id === 'vip' ? 'border-purple-500 ring-4 ring-purple-500/20' : activePackage?.id === 'premium' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-cyan-500'}`}>
                       <div className="flex justify-between items-center mb-4"><span className="text-2xl font-black text-slate-900">#{activeLock?.id || '000'}</span>{activePackage?.id === 'vip' && <Trophy size={20} className="text-purple-600"/>}</div>
                       <div className="h-28 flex items-center justify-center mb-4"><Image src={getSkinImage(activeLock?.skin || 'gold')} alt="lock" width={80} height={80} className="drop-shadow-2xl object-contain"/></div>
                       <div className="flex justify-between items-end"><div><p className="text-[10px] text-slate-400 uppercase font-bold">Price</p><p className="text-xl font-bold text-slate-900">${activeLock?.price || '29.99'}</p></div><Button size="sm" className={`h-8 text-xs font-bold bg-gradient-to-r ${activePackage?.color} text-white border-0`}>Buy Now</Button></div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-end px-2"><span className="text-slate-400 text-sm">Total</span><span className="text-3xl font-black text-white">${activePackage?.price}</span></div>
                  <Button onClick={handleBoostPurchase} className={`w-full h-16 text-xl font-black text-white bg-gradient-to-r ${activePackage?.color} hover:opacity-90 shadow-2xl rounded-xl`}>{user ? <><Rocket className="mr-2 h-6 w-6" /> BOOST NOW</> : 'LOGIN TO BOOST'}</Button>
                </div>
             </div>
          </div>
      </div>
    </div>
  );
}

export default function BoostPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-white"/></div>}>
      <BoostPageContent />
    </Suspense>
  );
}
