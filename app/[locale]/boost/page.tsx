'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    <div className="flex items-center gap-8 whitespace-nowrap animate-marquee text-xs font-mono text-emerald-400">
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
        // Chargement des cadenas si connecté
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
    router.push(`/checkout?type=boost&lock_id=${selectedLockId}&package=${selectedPackage}&price=${pkg?.price}`);
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
        
        {/* TITRE PUNCHY */}
        <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/50 text-purple-200 text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles size={12} className="animate-pulse"/> +850% more views on average
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6">
                Don't Let Your Asset <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-500 to-slate-700">Be Invisible.</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                The marketplace is crowded. <span className="text-white font-bold">Boost your lock</span> to the top of the list and sell up to <span className="text-emerald-400 font-bold">5x faster</span>.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">

          {/* GAUCHE : SÉLECTEUR DE PACKS (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. CHOIX DU PACK */}
            <div className="space-y-4">
                {boostPackages.map((pkg) => {
                    const Icon = pkg.icon;
                    const isSelected = selectedPackage === pkg.id;
                    
                    return (
                        <div 
                            key={pkg.id} 
                            onClick={() => setSelectedPackage(pkg.id)}
                            className={`
                                group relative p-1 rounded-2xl cursor-pointer transition-all duration-300
                                ${isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01] opacity-80 hover:opacity-100'}
                            `}
                        >
                            {/* Bordure Gradient Animée si sélectionné */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${pkg.color} ${isSelected ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}></div>
                            
                            <div className="relative bg-slate-900 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-6 border border-slate-800 h-full">
                                
                                {pkg.popular && (
                                    <div className="absolute -top-3 left-6 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                                        <Flame size={10} className="fill-white"/> BEST SELLER
                                    </div>
                                )}

                                {/* Icone */}
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${pkg.color} shadow-lg shrink-0`}>
                                    <Icon size={32} className="text-white drop-shadow-md" />
                                </div>

                                {/* Infos */}
                                <div className="flex-1 text-center sm:text-left">
                                    <h3 className="font-bold text-xl text-white flex items-center justify-center sm:justify-start gap-3">
                                        {pkg.title}
                                        <span className={`text-xs px-2 py-0.5 rounded bg-white/10 text-white/80 border border-white/10`}>{pkg.days} Days</span>
                                    </h3>
                                    <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
                                        {pkg.features.map((f, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                                                <CheckCircle size={12} className="text-emerald-500 shrink-0"/> {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Prix & Multiplicateur */}
                                <div className="text-right shrink-0 flex flex-col items-center sm:items-end">
                                    <div className="text-3xl font-black text-white">${pkg.price}</div>
                                    <div className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${pkg.color} flex items-center gap-1`}>
                                        <TrendingUp size={14} className={pkg.id === 'basic' ? 'text-cyan-400' : pkg.id === 'premium' ? 'text-orange-400' : 'text-pink-400'}/>
                                        {pkg.multiplier} Views
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 2. SÉLECTION CADENAS */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                    <Target className="text-slate-400"/> Select Asset to Boost
                </h3>
                
                {!user ? (
                    <div className="text-center py-8">
                        <p className="text-slate-400 mb-4 text-sm">Login to select one of your locks.</p>
                        <Button onClick={() => router.push('/purchase')} variant="outline" className="border-slate-700 text-white hover:bg-slate-800">Login to Continue</Button>
                    </div>
                ) : userLocks.length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-slate-500 text-sm">You don't own any locks.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {userLocks.map(l => (
                            <div 
                                key={l.id} 
                                onClick={() => setSelectedLockId(l.id)}
                                className={`
                                    relative p-2 rounded-xl border-2 cursor-pointer transition-all bg-slate-800
                                    ${selectedLockId === l.id ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-700 hover:border-slate-600'}
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

          </div>

          {/* DROITE : SIMULATEUR LIVE (5 cols) */}
          <div className="lg:col-span-5">
             <div className="sticky top-24">
                
                {/* PREVIEW CARD */}
                <div className="relative group">
                    {/* Glow effect */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${activePackage?.color} rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000`}></div>
                    
                    <Card className="bg-slate-900 border-slate-800 relative z-10 overflow-hidden">
                        
                        {/* Simulation Views Header */}
                        <div className="bg-black/30 p-3 border-b border-white/5 flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Live Preview</span>
                            <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded text-emerald-400 text-xs font-bold">
                                <Eye size={12} className="animate-pulse"/> +{activePackage?.multiplier} Traffic
                            </div>
                        </div>

                        <CardContent className="p-6">
                            
                            {/* La Carte Cadenas (telle qu'elle sera vue) */}
                            <div className={`
                                bg-white rounded-xl p-4 border-2 shadow-2xl relative overflow-hidden transform transition-all duration-500
                                ${activePackage?.id === 'vip' ? 'border-purple-500 ring-4 ring-purple-500/20 scale-105' : 
                                  activePackage?.id === 'premium' ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-cyan-500'}
                            `}>
                                {/* Badge */}
                                <div className={`absolute top-0 right-0 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg bg-gradient-to-r ${activePackage?.color}`}>
                                    {activePackage?.badge}
                                </div>

                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-2xl font-black text-slate-900">#{activeLock?.id || '000'}</span>
                                    {activePackage?.id === 'vip' && <Trophy size={20} className="text-purple-600" />}
                                    {activePackage?.id === 'premium' && <Flame size={20} className="text-orange-500" />}
                                </div>
                                
                                <div className="h-28 flex items-center justify-center mb-4 relative">
                                    <div className={`absolute inset-0 bg-gradient-to-t ${activePackage?.color} opacity-10 rounded-full blur-xl`}></div>
                                    <Image 
                                        src={getSkinImage(activeLock?.skin || 'gold')} 
                                        alt="lock" width={80} height={80} 
                                        className="drop-shadow-2xl object-contain relative z-10"
                                    />
                                </div>
                                
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] text-slate-400 uppercase font-bold">Price</p>
                                        <p className="text-xl font-bold text-slate-900">${activeLock?.price || '29.99'}</p>
                                    </div>
                                    <Button size="sm" className={`h-8 text-xs font-bold bg-gradient-to-r ${activePackage?.color} text-white border-0 shadow-lg`}>
                                        Buy Now
                                    </Button>
                                </div>
                            </div>

                        </CardContent>
                    </Card>
                </div>

                {/* TOTAL & PAY BUTTON */}
                <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-end px-2">
                        <span className="text-slate-400 text-sm">Total Investment</span>
                        <span className="text-3xl font-black text-white">${activePackage?.price}</span>
                    </div>

                    <Button 
                        onClick={handleBoostPurchase} 
                        className={`w-full h-16 text-xl font-black text-white bg-gradient-to-r ${activePackage?.color} hover:opacity-90 shadow-2xl transition-all hover:scale-[1.02] rounded-xl`}
                    >
                        {user ? (
                           <div className="flex items-center gap-2">
                              <Rocket className="h-6 w-6 animate-bounce" /> BOOST NOW
                           </div>
                        ) : (
                           'LOGIN TO BOOST'
                        )}
                    </Button>
                    
                    <p className="text-center text-xs text-slate-500 flex justify-center gap-4">
                        <span className="flex items-center gap-1"><MousePointerClick size={12}/> One-click setup</span>
                        <span className="flex items-center gap-1"><Zap size={12}/> Instant live</span>
                    </p>
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
