'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search, Crown, Sparkles, Trophy, ShoppingCart, 
  Loader2, DollarSign, Activity, Zap, ArrowRight, Eye, TrendingUp, BarChart3, Globe, ArrowLeft
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

// --- TYPES ---
type MarketLock = {
  id: number;
  zone: string;
  skin: string;
  price: number;
  views_count: number;
  boost_level: 'none' | 'basic' | 'premium' | 'vip' | 'golden';
  price_increase: number;
  viewers_now: number;
  is_golden: boolean;
};

// --- HELPER IMAGE ---
const getSkinImage = (skin: string) => {
  const s = skin ? skin.toLowerCase() : 'gold';
  return `/images/skin-${s}.png`;
};

// --- COMPOSANT TICKER ---
const LiveTicker = () => {
  return (
    <div className="bg-black text-white py-1 border-b border-white/10 text-[10px] uppercase tracking-widest font-bold overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: flex; width: fit-content; animation: marquee 30s linear infinite; }
      `}} />
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap px-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-8">
            <span className="text-emerald-400 flex gap-1 shrink-0"><Activity size={12}/> MARKET ACTIVE</span>
            <span className="shrink-0">🔥 #777 sold $12,500</span>
            <span className="text-white/20 shrink-0">|</span>
            <span className="shrink-0">💎 #1313 VIP Listed</span>
            <span className="text-white/20 shrink-0">|</span>
            <span className="text-amber-400 shrink-0">⚡ 842 Buyers Online</span>
            <span className="text-white/20 shrink-0">|</span>
            <span className="shrink-0">🚀 #2024 Offer Received</span>
            <span className="text-white/20 shrink-0">|</span>
            <span className="shrink-0 text-emerald-400">💰 24h Vol: $142,000</span>
            <span className="text-white/20 shrink-0">|</span>
          </div>
        ))}
      </div>
    </div>
  );
};

function MarketplaceContent() {
  const router = useRouter();
  const { user } = useAuth();
  
  const [locks, setLocks] = useState<MarketLock[]>([]);
  const [top10Locks, setTop10Locks] = useState<MarketLock[]>([]); // LES 10 DU HAUT
  const [feedLocks, setFeedLocks] = useState<MarketLock[]>([]);   // LE RESTE
  
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<'trending' | 'price_low' | 'price_high'>('trending');
  
  const ITEMS_PER_PAGE = 60;

  useEffect(() => {
    setMounted(true);
    loadMarketplaceLocks();
  }, []);

  const loadMarketplaceLocks = async () => {
    try {
      const { data, error } = await supabase
        .from('locks')
        .select('*')
        .or('status.eq.For_Sale,status.eq.Reserved_Admin') 
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedLocks = (data || []).map(lock => {
        const isGolden = lock.status === 'Reserved_Admin';
        
        let finalPrice = isGolden ? lock.golden_asset_price : lock.resale_price;
        if (!finalPrice || isNaN(Number(finalPrice)) || Number(finalPrice) <= 0) {
            finalPrice = 29.99;
        }

        let boostLvl = lock.boost_level || 'none';
        if (isGolden) boostLvl = 'golden';

        const viewers = (lock.id % 20) + 5; 
        const increase = ((lock.id % 50) * 2) + 10;

        return {
          id: lock.id,
          zone: lock.zone || 'Standard',
          skin: lock.skin || 'Gold',
          content_text: lock.content_text,
          price: Number(finalPrice),
          views_count: (lock.views_count || 0) + 100,
          boost_level: boostLvl,
          price_increase: increase,
          viewers_now: viewers,
          is_golden: isGolden
        };
      });

      // TRI : Les Golden/VIP/Chers en premier
      formattedLocks.sort((a, b) => {
        if (a.boost_level === 'golden' || a.boost_level === 'vip') return -1;
        if (b.boost_level === 'golden' || b.boost_level === 'vip') return 1;
        return b.price - a.price;
      });

      // SÉPARATION : Top 10 vs Le Reste
      const top10 = formattedLocks.slice(0, 10);
      const rest = formattedLocks.slice(10);
      
      setTop10Locks(top10);
      setLocks(rest); // On garde "le reste" dans locks pour le filtrage
      setFeedLocks(rest);
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filtrage sur le FEED uniquement (Le Top 10 reste fixe)
  useEffect(() => {
    if (!mounted) return;

    let result = [...locks];
    if (search) result = result.filter(l => l.id.toString().includes(search));
    
    if (sortBy === 'price_low') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_high') result.sort((a, b) => b.price - a.price);
    
    setFeedLocks(result);
    setCurrentPage(1);
  }, [search, sortBy, locks, mounted]);

  const handleQuickBuy = (lockId: number, price: number) => {
    if (!user) {
      if (typeof window !== 'undefined') sessionStorage.setItem('pendingBuy', JSON.stringify({ lockId, price }));
      router.push('/purchase'); // Redirection Login/Inscription
      return;
    }
    router.push(`/checkout?lock_id=${lockId}&price=${price}&type=marketplace`); // Redirection Stripe
  };

  // Pagination
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = feedLocks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(feedLocks.length / ITEMS_PER_PAGE);

  if (!mounted || loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin h-10 w-10 text-emerald-500"/></div>;

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900">
      
      <LiveTicker />

      {/* HEADER ACTIONS */}
      <section className="bg-slate-900 pt-6 pb-12 px-4 border-b border-slate-800">
        <div className="container mx-auto">
          
          {/* BOUTON RETOUR & TITRE */}
          <div className="flex items-center gap-4 mb-8">
             <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="text-white hover:bg-white/10">
                <ArrowLeft className="h-6 w-6"/>
             </Button>
             <div>
                <h1 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
                  Market<span className="text-emerald-500">Place</span>
                </h1>
                <p className="text-slate-400 text-sm">Live Trading Floor • 85k+ Traders</p>
             </div>
             
             {/* ACTIONS RAPIDES (Droite) */}
             <div className="ml-auto flex gap-3">
                <Button onClick={() => router.push('/sell')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/20">
                  <DollarSign className="mr-2 h-4 w-4"/> SELL
                </Button>
                <Button onClick={() => router.push('/boost')} className="bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-400/20">
                  <Zap className="mr-2 h-4 w-4"/> BOOST
                </Button>
             </div>
          </div>

          {/* --- TOP 10 LEADERS (10 ITEMS / 5 PAR LIGNE) --- */}
          {top10Locks.length > 0 && (
            <div className="mb-4">
               <div className="flex items-center gap-2 mb-4 text-amber-400 font-bold tracking-widest text-xs uppercase animate-pulse">
                  <Crown size={14} /> Market Leaders (Top 10)
               </div>
               {/* GRILLE 5 PAR LIGNE SUR ORDI */}
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {top10Locks.map((lock, idx) => (
                   <div 
                     key={lock.id}
                     onClick={() => handleQuickBuy(lock.id, lock.price)}
                     className="relative group cursor-pointer bg-slate-800 rounded-xl border border-amber-500/30 hover:border-amber-400 transition-all overflow-hidden hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                   >
                     <div className="absolute top-0 left-0 bg-amber-500 text-slate-900 text-[10px] font-black px-2 py-0.5 z-10">#{idx + 1}</div>
                     <div className="absolute top-0 right-0 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 z-10 flex items-center gap-1">
                        <Eye size={10} className="text-emerald-400"/> {lock.viewers_now}
                     </div>
                     
                     <div className="p-3 flex flex-col items-center relative">
                       <div className="relative z-10 w-16 h-16 mb-2 transition-transform duration-300 group-hover:scale-110">
                         <Image src={getSkinImage(lock.skin)} alt={lock.skin} fill className="object-contain drop-shadow-2xl" />
                       </div>
                       <div className="relative z-10 text-center w-full">
                         <div className="font-black text-lg text-white">#{lock.id}</div>
                         <div className="text-amber-400 font-bold text-base">${lock.price.toLocaleString()}</div>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

        </div>
      </section>

      {/* --- LE MUR (FEED) --- */}
      <div className="container mx-auto px-4 py-8">
        
        {/* BARRE RECHERCHE */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6 sticky top-4 z-30 bg-white/90 backdrop-blur p-2 rounded-xl shadow-sm border border-slate-200">
           <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search ID..." 
                className="pl-9 h-10 text-sm bg-slate-50 border-slate-200"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
              <Button onClick={() => setSortBy('trending')} size="sm" variant={sortBy === 'trending' ? 'default' : 'ghost'} className="h-9 text-xs">Trending</Button>
              <Button onClick={() => setSortBy('price_low')} size="sm" variant={sortBy === 'price_low' ? 'default' : 'ghost'} className="h-9 text-xs">Low $</Button>
              <Button onClick={() => setSortBy('price_high')} size="sm" variant={sortBy === 'price_high' ? 'default' : 'ghost'} className="h-9 text-xs">High $</Button>
           </div>
        </div>

        {/* GRILLE DENSE (5 PAR LIGNE SUR ORDI) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 mb-10">
          {currentItems.map((lock) => {
            const isVip = lock.boost_level === 'vip' || lock.boost_level === 'golden';
            return (
              <div 
                key={lock.id}
                onClick={() => handleQuickBuy(lock.id, lock.price)}
                className={`
                  relative group cursor-pointer rounded-xl border transition-all duration-200
                  hover:-translate-y-1 hover:shadow-lg overflow-hidden bg-white
                  ${isVip ? 'border-purple-300 ring-1 ring-purple-100' : 'border-slate-200 hover:border-emerald-300'}
                `}
              >
                {isVip && <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg z-10">VIP</div>}
                
                <div className="p-3 flex flex-col h-full items-center text-center">
                  <div className="relative w-14 h-14 mb-2">
                     <Image 
                       src={getSkinImage(lock.skin)} 
                       alt={lock.skin} 
                       fill
                       className="object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                     />
                  </div>

                  <div className="w-full mt-auto">
                    <div className="text-[9px] text-slate-400 uppercase font-bold leading-none mb-1">
                      {lock.zone}
                    </div>
                    <div className="text-sm font-black text-slate-900 leading-none mb-1">
                      #{lock.id}
                    </div>
                    <div className={`text-sm font-bold ${isVip ? 'text-purple-600' : 'text-emerald-600'}`}>
                      ${lock.price.toLocaleString()}
                    </div>
                  </div>
                  
                  {/* Bouton Buy au survol */}
                  <div className="absolute inset-x-0 bottom-0 bg-slate-900 text-white text-[10px] font-bold py-1.5 uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Buy
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-8 border-t border-slate-200">
            <Button variant="outline" size="sm" onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo(0,0); }} disabled={currentPage === 1}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <span className="text-xs font-bold text-slate-500">Page {currentPage} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo(0,0); }} disabled={currentPage === totalPages}>
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-900"><Loader2 className="animate-spin text-white" /></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
