'use client';

// Force dynamic
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, Crown, Trophy, Clock, CheckCircle, Loader2, 
  ArrowLeft, Zap, Rocket, Eye, ShieldCheck, LogIn, Lock 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

// --- PACKS ---
const boostPackages = [
  { 
    id: 'basic', 
    title: 'Starter Boost', 
    price: 19.99, 
    duration: '7 Days', 
    views: '2x',
    color: 'from-blue-500 to-cyan-500', 
    border: 'border-blue-500',
    icon: Sparkles, 
    badge: 'BOOSTED',
    features: ['Top 50 Rotation', 'Basic Badge', 'Email Alert']
  },
  { 
    id: 'premium', 
    title: 'Pro Exposure', 
    price: 49.99, 
    duration: '14 Days', 
    views: '5x',
    color: 'from-amber-500 to-orange-500', 
    border: 'border-amber-500',
    icon: Crown, 
    badge: 'PREMIUM',
    popular: true, 
    features: ['Top 10 Fixed Position', 'Golden Border', 'Priority Support']
  },
  { 
    id: 'vip', 
    title: 'VIP Domination', 
    price: 99.99, 
    duration: '30 Days', 
    views: '10x',
    color: 'from-purple-600 to-pink-600', 
    border: 'border-purple-500',
    icon: Trophy, 
    badge: 'VIP LEGEND',
    features: ['Homepage Feature', 'Social Media Blast', 'VIP Trophy Badge', 'Instant Notification']
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const paramLockId = searchParams.get('lock_id');
    if (paramLockId) setSelectedLockId(parseInt(paramLockId));
    
    if (user) {
        setLoading(true);
        supabase.from('locks').select('*').eq('owner_id', user.id).order('created_at', { ascending: false })
            .then(({ data }) => {
                setUserLocks(data || []);
                // Auto-select si pas de param URL et que des locks existent
                if (!selectedLockId && data && data.length > 0 && !paramLockId) {
                    setSelectedLockId(data[0].id);
                }
                setLoading(false);
            });
    }
  }, [user, searchParams]);

  const handleBoostPurchase = async () => {
    if (!user) {
        router.push('/purchase');
        return;
    }
    if (!selectedLockId) return toast.error('Please select a lock to boost');

    const pkg = boostPackages.find(p => p.id === selectedPackage);
    router.push(`/checkout?type=boost&lock_id=${selectedLockId}&package=${selectedPackage}&price=${pkg?.price}`);
  };

  const activePackage = boostPackages.find(p => p.id === selectedPackage);
  const activeLock = userLocks.find(l => l.id === selectedLockId);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur border-b border-slate-800 px-4 py-4 sticky top-0 z-20">
        <div className="container mx-auto max-w-6xl flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="text-slate-400 hover:text-white hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-bold text-lg flex items-center gap-2 text-white">
            <Zap className="text-amber-500 fill-amber-500 h-4 w-4"/> Boost & Sell Faster
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        
        {/* HERO TEXT */}
        <div className="text-center mb-12">
          <Badge className="bg-amber-500 text-black font-bold mb-4 hover:bg-amber-400 border-0">ROCKET FUEL FOR YOUR ASSET</Badge>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Skyrocket Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Visibility</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Boosted locks appear at the top of the marketplace and get <strong>5x more views</strong>. 
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* GAUCHE (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. SELECT LOCK */}
            <div>
               <h3 className="font-bold text-xl text-white mb-4 flex items-center gap-2">
                 <span className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-slate-700">1</span>
                 Select Asset to Boost
               </h3>
               
               {!user ? (
                 <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center bg-slate-800/30">
                    <Lock className="h-10 w-10 text-slate-500 mx-auto mb-3" />
                    <p className="text-slate-400 mb-4">Login to view your collection.</p>
                    <Button onClick={() => router.push('/purchase')} variant="outline" className="border-slate-600 text-white hover:bg-white hover:text-slate-900">
                        <LogIn className="mr-2 h-4 w-4"/> Login
                    </Button>
                 </div>
               ) : userLocks.length === 0 ? (
                 <div className="p-8 border border-dashed border-slate-700 rounded-xl text-center">
                    <p className="text-slate-500 mb-4">You don't own any locks yet.</p>
                    <Button onClick={() => router.push('/purchase')} variant="outline" className="border-slate-600 text-white">Buy a Lock First</Button>
                 </div>
               ) : (
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                   {userLocks.map(l => (
                     <div 
                       key={l.id} 
                       onClick={() => setSelectedLockId(l.id)}
                       className={`
                         relative p-3 rounded-xl border-2 cursor-pointer transition-all group
                         ${selectedLockId === l.id 
                           ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                           : 'border-slate-800 bg-slate-800/50 hover:border-slate-600'}
                       `}
                     >
                        {selectedLockId === l.id && <div className="absolute top-2 right-2 bg-emerald-500 text-black rounded-full p-0.5 z-10"><CheckCircle size={12}/></div>}
                        <div className="relative w-full aspect-square mb-2">
                           <Image src={getSkinImage(l.skin)} alt="lock" fill className="object-contain group-hover:scale-110 transition-transform"/>
                        </div>
                        <div className="text-center font-mono font-bold text-xs text-white">#{l.id}</div>
                     </div>
                   ))}
                 </div>
               )}
            </div>

            {/* 2. CHOOSE PACKAGE */}
            <div>
               <h3 className="font-bold text-xl text-white mb-6 flex items-center gap-2">
                 <span className="bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm border border-slate-700">2</span>
                 Choose Power Level
               </h3>
               
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
                       {pkg.popular && (
                         <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                           MOST POPULAR
                         </div>
                       )}

                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br ${pkg.color} shadow-lg shrink-0`}>
                         <Icon size={28} className="text-white" />
                       </div>

                       <div className="flex-1 text-center sm:text-left">
                         <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                           <h4 className="font-bold text-lg text-white">{pkg.title}</h4>
                           <Badge variant="outline" className="border-slate-600 text-slate-400 text-[10px]">{pkg.duration}</Badge>
                         </div>
                         <div className="text-sm text-slate-400 flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1">
                           {pkg.features.map((f, i) => (
                             <span key={i} className="flex items-center gap-1">
                               <CheckCircle size={10} className="text-emerald-500"/> {f}
                             </span>
                           ))}
                         </div>
                       </div>

                       <div className="text-right shrink-0">
                          <div className="text-3xl font-black text-white">${pkg.price}</div>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>
          </div>

          {/* DROITE (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              
              {/* PREVIEW */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur-xl opacity-20 animate-pulse"></div>
                <Card className="bg-slate-900 border-slate-700 relative overflow-hidden">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${activePackage?.color}`}></div>
                  <CardContent className="p-6">
                    <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider flex items-center justify-between">
                      <span>Live Preview</span>
                      <span className="text-emerald-400 flex items-center gap-1"><Eye size={12}/> +{activePackage?.views} Views</span>
                    </h3>

                    {/* La Carte Cadenas */}
                    <div className={`
                       bg-white rounded-xl p-4 border-2 shadow-xl relative overflow-hidden group
                       ${activePackage?.id === 'vip' ? 'border-purple-400 ring-2 ring-purple-500/30' : 
                         activePackage?.id === 'premium' ? 'border-amber-400 ring-2 ring-amber-500/30' : 'border-blue-400'}
                    `}>
                       <div className={`absolute top-0 right-0 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg bg-gradient-to-r ${activePackage?.color}`}>
                         {activePackage?.badge}
                       </div>

                       <div className="flex justify-between items-center mb-4">
                          <span className="text-2xl font-black text-slate-900">#{activeLock?.id || '000'}</span>
                          {activePackage?.id === 'vip' && <Trophy size={20} className="text-purple-600" />}
                          {activePackage?.id === 'premium' && <Crown size={20} className="text-amber-500" />}
                       </div>
                       
                       <div className="h-24 flex items-center justify-center mb-4">
                          <Image 
                            src={getSkinImage(activeLock?.skin || 'gold')} 
                            alt="lock" width={80} height={80} 
                            className="drop-shadow-lg object-contain"
                          />
                       </div>
                       
                       <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase font-bold">Price</p>
                            <p className="text-xl font-bold text-slate-900">${activeLock?.price || '29.99'}</p>
                          </div>
                          <Button size="sm" className={`h-8 text-xs font-bold bg-gradient-to-r ${activePackage?.color} text-white border-0`}>
                            Buy Now
                          </Button>
                       </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* PAIEMENT */}
              <Card className="bg-slate-800 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-slate-400">Total to Pay</span>
                    <span className="text-3xl font-bold text-white">${activePackage?.price}</span>
                  </div>
                  
                  <Button 
                    onClick={handleBoostPurchase} 
                    className={`w-full h-14 text-xl font-bold text-white bg-gradient-to-r ${activePackage?.color} hover:opacity-90 shadow-lg transition-all hover:scale-[1.02]`}
                  >
                    {user ? <><Rocket className="mr-2 h-6 w-6" /> BOOST NOW</> : <><LogIn className="mr-2 h-6 w-6"/> LOGIN TO BOOST</>}
                  </Button>
                  
                  <div className="mt-4 flex justify-center gap-4 text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><ShieldCheck size={12}/> Secure Payment</span>
                    <span className="flex items-center gap-1"><Zap size={12}/> Instant Activation</span>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function BoostPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-white"/></div>}>
      <BoostPageContent />
    </Suspense>
  );
}
