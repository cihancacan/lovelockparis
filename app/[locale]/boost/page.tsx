'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// CORRECTION ICI : Ajout de 'Rocket' et 'Flame' qui manquaient
import { 
  Sparkles, Crown, Trophy, Clock, CheckCircle, Loader2, ArrowLeft, 
  Zap, Rocket, Flame, TrendingUp, Eye, Target, MousePointerClick
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

// --- PACKAGES CONFIG ---
const boostPackages = [
  { 
    id: 'basic', 
    title: 'Quick Spark', 
    days: 5,
    price: 14.99, 
    multiplier: '3x',
    color: 'from-blue-500 to-cyan-400',
    border: 'border-cyan-500',
    shadow: 'shadow-cyan-500/20',
    icon: Zap,
    features: ['Top 50 Rotation', 'Blue Badge', 'Search Highlight']
  },
  { 
    id: 'premium', 
    title: 'Market Heat', 
    days: 10,
    price: 29.99, 
    multiplier: '10x',
    color: 'from-orange-500 to-red-500',
    border: 'border-orange-500',
    shadow: 'shadow-orange-500/40',
    icon: Flame,
    popular: true,
    features: ['Top 20 Fixed', 'Animated Fire Badge', 'Weekly Newsletter', 'Priority Support']
  },
  { 
    id: 'vip', 
    title: 'Diamond Domination', 
    days: 15,
    price: 59.99, 
    multiplier: '25x',
    color: 'from-purple-600 to-pink-500',
    border: 'border-purple-500',
    shadow: 'shadow-purple-500/50',
    icon: Trophy,
    features: ['Homepage Cover (24h)', 'Golden Border', 'Social Media Blast', 'Top 3 Guarantee']
  }
];

const getSkinImage = (skin: string | null) => `/images/skin-${skin ? skin.toLowerCase() : 'gold'}.png`;

// --- TICKER LIVE ---
const BoostTicker = () => (
  <div className="bg-emerald-900/30 border-b border-emerald-500/20 py-2 overflow-hidden">
    <div className="flex items-center gap-8 whitespace-nowrap animate-marquee text-xs font-mono text-emerald-400 px-4">
       <span className="flex items-center gap-1"><Rocket size={12}/> USER @ALEX JUST BOOSTED LOCK #777</span>
       <span>•</span>
       <span className="flex items-center gap-1"><Eye size={12}/> +450% VIEWS ON BOOSTED ITEMS</span>
       <span>•</span>
       <span className="flex items-center gap-1"><TrendingUp size={12}/> VIP LOCK #123 SOLD IN 2 HOURS</span>
       <span>•</span>
       <span className="flex items-center gap-1"><Zap size={12}/> 14 ACTIVE BOOSTS RIGHT NOW</span>
    </div>
    <style jsx>{`
      .animate-marquee { animation: marquee 30s linear infinite; }
      @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
    `}</style>
  </div>
);

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
        supabase.from('locks').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
            .then(({ data }) => {
                setUserLocks(data || []);
                if (!selectedLockId && data && data.length > 0 && !paramLockId) setSelectedLockId(data[0].id);
                setLoading(false);
            });
    } else {
        setLoading(false);
    }
  }, [user, searchParams]);

  const handleBoostPurchase = async () => {
    if (!user) return router.push('/purchase');
    if (!selectedLockId) return toast.error('Select a lock to boost');

    const pkg = boostPackages.find(p => p.id === selectedPackage);
    // Envoi de toutes les infos au checkout
    const lock = userLocks.find(l => l.id === selectedLockId);
    router.push(`/checkout?type=boost&lock_id=${selectedLockId}&package=${selectedPackage}&price=${pkg?.price}&zone=${lock?.zone || 'Standard'}&skin=${lock?.skin || 'Gold'}`);
  };

  const activePackage = boostPackages.find(p => p.id === selectedPackage);
  const activeLock = userLocks.find(l => l.id === selectedLockId);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-950"><Loader2 className="animate-spin text-white"/></div>;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Header */}
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

      <BoostTicker />

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* GAUCHE : SÉLECTEUR DE PACKS (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. SELECT LOCK */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                    <Target className="text-slate-400"/> 1. Select Asset
                </h3>
                
                {!user ? (
                    <div className="text-center py-6 text-slate-500">Please login to see your locks.</div>
                ) : userLocks.length === 0 ? (
                    <div className="text-center py-6 text-slate-500">You don't own any locks.</div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {userLocks.map(l => (
                            <div 
                                key={l.id} 
                                onClick={() => setSelectedLockId(l.id)}
                                className={`
                                    relative p-2 rounded-xl border-2 cursor-pointer transition-all bg-slate-800
                                    ${selectedLockId === l.id 
                                    ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                                    : 'border-slate-700 hover:border-slate-600'}
                                `}
                            >
                                {selectedLockId === l.id && <div className="absolute top-1 right-1 bg-emerald-500 text-black rounded-full p-0.5 z-10"><CheckCircle size={10}/></div>}
                                <div className="relative w-full aspect-square mb-1">
                                    <Image src={getSkinImage(l.skin)} alt="lock" fill className="object-contain"/>
                                </div>
                                <div className="text-center font-mono font-bold text-[10px] text-slate-300">#{l.id}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 2. CHOOSE PACKAGE */}
            <div className="space-y-4">
                 {boostPackages.map((pkg) => {
                   const Icon = pkg.icon;
                   const isSelected = selectedPackage === pkg.id;
                   
                   return (
                     <div 
                       key={pkg.id}
                       onClick={() => setSelectedPackage(pkg.id)}
                       className={`
                         relative flex flex-col sm:flex-row items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-300
                         ${isSelected 
                           ? `${pkg.border} bg-slate-800/80 shadow-lg scale-[1.02]` 
                           : 'border-slate-800 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'}
                       `}
                     >
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${pkg.color} shadow-lg shrink-0`}>
                         <Icon size={28} className="text-white" />
                       </div>
                       <div className="flex-1 text-center sm:text-left">
                         <h4 className="font-bold text-lg text-white">{pkg.title} <span className="text-xs font-normal opacity-70 ml-2">({pkg.days} Days)</span></h4>
                         <div className="text-sm text-slate-400">{pkg.features.join(' • ')}</div>
                       </div>
                       <div className="text-right shrink-0">
                          <div className="text-3xl font-black text-white">${pkg.price}</div>
                       </div>
                     </div>
                   );
                 })}
            </div>
          </div>

          {/* DROITE : SIMULATEUR LIVE (5 cols) */}
          <div className="lg:col-span-5">
             <div className="sticky top-24">
                
                {/* PREVIEW CARD */}
                <div className="relative group">
                    <div className={`absolute -inset-1 bg-gradient-to-r ${activePackage?.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000`}></div>
                    <Card className="bg-slate-900 border-slate-800 relative z-10 overflow-hidden">
                        <div className="bg-black/30 p-3 border-b border-white/5 flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Preview</span>
                            <div className="text-emerald-400 text-xs font-bold flex gap-1"><Eye size={12}/> +{activePackage?.multiplier} Traffic</div>
                        </div>
                        <CardContent className="p-6 text-center">
                           <div className="h-32 flex items-center justify-center mb-4">
                              <Image 
                                src={getSkinImage(activeLock?.skin || 'gold')} 
                                alt="lock" width={100} height={100} 
                                className="drop-shadow-2xl object-contain"
                              />
                           </div>
                           <p className="text-white font-black text-2xl">#{activeLock?.id || '000'}</p>
                           <Badge className={`mt-2 bg-gradient-to-r ${activePackage?.color}`}>{activePackage?.badge}</Badge>
                        </CardContent>
                    </Card>
                </div>

                {/* TOTAL & PAY BUTTON */}
                <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-end px-2">
                        <span className="text-slate-400 text-sm">Total</span>
                        <span className="text-3xl font-black text-white">${activePackage?.price}</span>
                    </div>

                    <Button 
                        onClick={handleBoostPurchase} 
                        className={`w-full h-16 text-xl font-black text-white bg-gradient-to-r ${activePackage?.color} hover:opacity-90 shadow-2xl transition-all hover:scale-[1.02] rounded-xl`}
                    >
                        {user ? <><Rocket className="mr-2 h-6 w-6" /> BOOST NOW</> : 'LOGIN TO BOOST'}
                    </Button>
                </div>
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
